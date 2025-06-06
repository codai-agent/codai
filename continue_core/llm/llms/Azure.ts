import { LLMOptions } from "../../index.js"
import { LlmApiRequestType } from "../openaiTypeConverters.js"

import OpenAI from "./OpenAI.js"

class Azure extends OpenAI {
	static override providerName = "azure"

	protected override supportsPrediction(model: string): boolean {
		return false
	}

	protected override useOpenAIAdapterFor: (LlmApiRequestType | "*")[] = []

	static override defaultOptions: Partial<LLMOptions> = {
		apiVersion: "2024-02-15-preview",
		apiType: "azure-openai",
	}

	constructor(options: LLMOptions) {
		super(options)
		this.deployment = options.deployment ?? options.model
	}
}

export default Azure
