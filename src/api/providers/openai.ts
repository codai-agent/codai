import { Anthropic } from "@anthropic-ai/sdk"
import OpenAI, { AzureOpenAI } from "openai"
import { withRetry } from "../retry"
import { azureOpenAiDefaultApiVersion, ModelInfo, openAiModelInfoSaneDefaults, OpenAiCompatibleModelInfo } from "@shared/api"
import { ApiHandler } from "../index"
import { convertToOpenAiMessages } from "../transform/openai-format"
import { ApiStream } from "../transform/stream"
import { convertToR1Format } from "../transform/r1-format"
import type { ChatCompletionReasoningEffort } from "openai/resources/chat/completions"

interface OpenAiHandlerOptions {
	openAiApiKey?: string
	openAiBaseUrl?: string
	azureApiVersion?: string
	openAiHeaders?: Record<string, string>
	openAiModelId?: string
	openAiModelInfo?: OpenAiCompatibleModelInfo
	reasoningEffort?: string
}
import { EncryptUtil, getPluginVersion } from "@/utils/encrypt"

export class OpenAiHandler implements ApiHandler {
	private options: OpenAiHandlerOptions
	private client: OpenAI | undefined

	constructor(options: OpenAiHandlerOptions) {
		this.options = options
	}

	private ensureClient(): OpenAI {
		if (!this.client) {
			if (!this.options.openAiApiKey) {
				throw new Error("OpenAI API key is required")
			}
			try {
				// Azure API shape slightly differs from the core API shape: https://github.com/openai/openai-node?tab=readme-ov-file#microsoft-azure-openai
				// Use azureApiVersion to determine if this is an Azure endpoint, since the URL may not always contain 'azure.com'
				if (
					this.options.azureApiVersion ||
					((this.options.openAiBaseUrl?.toLowerCase().includes("azure.com") ||
						this.options.openAiBaseUrl?.toLowerCase().includes("azure.us")) &&
						!this.options.openAiModelId?.toLowerCase().includes("deepseek"))
				) {
					this.client = new AzureOpenAI({
						baseURL: this.options.openAiBaseUrl,
						apiKey: this.options.openAiApiKey,
						apiVersion: this.options.azureApiVersion || azureOpenAiDefaultApiVersion,
						defaultHeaders: this.options.openAiHeaders,
					})
				} else {
					this.client = new OpenAI({
						baseURL: this.options.openAiBaseUrl,
						apiKey: this.options.openAiApiKey,
						defaultHeaders: this.options.openAiHeaders,
					})
				}
			} catch (error: any) {
				throw new Error(`Error creating OpenAI client: ${error.message}`)
			}
		}
		return this.client
	}

	// 移除装饰器，直接实现方法
	async *createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): ApiStream {
		const descriptor = { value: this._createMessageImpl }
		const wrappedDescriptor = withRetry()(this, "createMessage", descriptor)
		yield* await wrappedDescriptor.value.apply(this, [systemPrompt, messages])
	}
	// @withRetry()
	async *_createMessageImpl(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): ApiStream {

		this.client = this.ensureClient()
		const modelId = this.options.openAiModelId ?? ""
		const isDeepseekReasoner = modelId.includes("deepseek-reasoner")
		const isR1FormatRequired = this.options.openAiModelInfo?.isR1FormatRequired ?? false
		const isReasoningModelFamily = modelId.includes("o1") || modelId.includes("o3") || modelId.includes("o4")

		let openAiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
			{ role: "system", content: systemPrompt },
			...convertToOpenAiMessages(messages),
		]
		let temperature: number | undefined = this.options.openAiModelInfo?.temperature ?? openAiModelInfoSaneDefaults.temperature
		let reasoningEffort: ChatCompletionReasoningEffort | undefined = undefined
		let maxTokens: number | undefined

		if (this.options.openAiModelInfo?.maxTokens && this.options.openAiModelInfo.maxTokens > 0) {
			maxTokens = Number(this.options.openAiModelInfo.maxTokens)
		} else {
			maxTokens = undefined
		}

		if (isDeepseekReasoner || isR1FormatRequired) {
			openAiMessages = convertToR1Format([{ role: "user", content: systemPrompt }, ...messages])
		}

		if (isReasoningModelFamily) {
			openAiMessages = [{ role: "developer", content: systemPrompt }, ...convertToOpenAiMessages(messages)]
			temperature = undefined // does not support temperature
			reasoningEffort = (this.options.reasoningEffort as ChatCompletionReasoningEffort) || "medium"
		}

		const stream = await this.client.chat.completions.create(
			{
				model: modelId,
				messages: openAiMessages,
				temperature,
				max_tokens: maxTokens,
				reasoning_effort: reasoningEffort,
				stream: true,
				stream_options: { include_usage: true },
			},
			// 通过 axios 的请求配置合并 headers //huqb
			{
				headers: {
					"X-Codee-Token": EncryptUtil.encrypt(this.options.openAiApiKey ?? ""), //huqb
					"X-Codee-Ver": "CodeeVsCodeExtension/" + getPluginVersion(),
				},
			},
		)
		for await (const chunk of stream) {
			const delta = chunk.choices[0]?.delta
			if (delta?.content) {
				yield {
					type: "text",
					text: delta.content,
				}
			}

			if (delta && "reasoning_content" in delta && delta.reasoning_content) {
				yield {
					type: "reasoning",
					reasoning: (delta.reasoning_content as string | undefined) || "",
				}
			}

			if (chunk.usage) {
				yield {
					type: "usage",
					inputTokens: chunk.usage.prompt_tokens || 0,
					outputTokens: chunk.usage.completion_tokens || 0,
					// @ts-ignore-next-line
					cacheReadTokens: chunk.usage.prompt_tokens_details?.cached_tokens || 0,
					// @ts-ignore-next-line
					cacheWriteTokens: chunk.usage.prompt_cache_miss_tokens || 0,
				}
			}
		}
	}

	getModel(): { id: string; info: ModelInfo } {
		return {
			id: this.options.openAiModelId ?? "",
			info: this.options.openAiModelInfo ?? openAiModelInfoSaneDefaults,
		}
	}
}
