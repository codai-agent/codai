import { ContinueProperties } from "@continuedev/config-yaml"

import { ControlPlaneProxyInfo } from "../../../control-plane/analytics/IAnalyticsProvider.js"
import { Telemetry } from "../../../util/posthog.js"
import OpenAI from "../OpenAI.js"

import type { Chunk, LLMOptions } from "../../../index.js"

class ContinueProxy extends OpenAI {
	set controlPlaneProxyInfo(value: ControlPlaneProxyInfo) {
		this.apiKey = value.workOsAccessToken
		if (!this.onPremProxyUrl) {
			this.apiBase = new URL("model-proxy/v1/", value.controlPlaneProxyUrl).toString()
		}
	}

	// The apiKey and apiBase are set to the values for the proxy,
	// but we need to keep track of the actual values that the proxy will use
	// to call whatever LLM API is chosen
	private actualApiBase?: string

	constructor(options: LLMOptions) {
		super(options)
		this.actualApiBase = options.apiBase
		this.apiKeyLocation = options.apiKeyLocation
		this.orgScopeId = options.orgScopeId
		this.onPremProxyUrl = options.onPremProxyUrl
		if (this.onPremProxyUrl) {
			this.apiBase = new URL("model-proxy/v1/", this.onPremProxyUrl).toString()
		}
	}

	static override providerName = "continue-proxy"
	static override defaultOptions: Partial<LLMOptions> = {
		useLegacyCompletionsEndpoint: false,
	}

	protected override extraBodyProperties(): Record<string, any> {
		const continueProperties: ContinueProperties = {
			apiKeyLocation: this.apiKeyLocation,
			apiBase: this.actualApiBase,
			orgScopeId: this.orgScopeId ?? null,
		}
		return {
			continueProperties,
		}
	}

	protected override _getHeaders() {
		const headers: any = super._getHeaders()
		headers["x-continue-unique-id"] = Telemetry.uniqueId
		return headers
	}

	override supportsCompletions(): boolean {
		return false
	}

	override supportsFim(): boolean {
		return true
	}

	override async rerank(query: string, chunks: Chunk[]): Promise<number[]> {
		const url = new URL("rerank", this.apiBase)
		const resp = await this.fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.apiKey}`,
			},
			body: JSON.stringify({
				query,
				documents: chunks.map((chunk) => chunk.content),
				model: this.model,
				...this.extraBodyProperties(),
			}),
		})
		const data: any = await resp.json()
		const results = data.data.sort((a: any, b: any) => a.index - b.index)
		return results.map((result: any) => result.relevance_score)
	}
}

export default ContinueProxy
