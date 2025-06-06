import { LLMOptions } from "../../index.js"
import { osModelsEditPrompt } from "../templates/edit.js"

import OpenAI from "./OpenAI.js"

class OpenRouter extends OpenAI {
	static override providerName = "openrouter"
	static override defaultOptions: Partial<LLMOptions> = {
		apiBase: "https://openrouter.ai/api/v1/",
		model: "gpt-4o-mini",
		promptTemplates: {
			edit: osModelsEditPrompt,
		},
		useLegacyCompletionsEndpoint: false,
	}
}

export default OpenRouter
