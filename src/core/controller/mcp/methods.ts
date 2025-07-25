// AUTO-GENERATED FILE - DO NOT MODIFY DIRECTLY
// Generated by scripts/build-proto.mjs

// Import all method implementations
import { registerMethod } from "./index"
import { addRemoteMcpServer } from "./addRemoteMcpServer"
import { deleteMcpServer } from "./deleteMcpServer"
import { downloadMcp } from "./downloadMcp"
import { getLatestMcpServers } from "./getLatestMcpServers"
import { openMcpSettings } from "./openMcpSettings"
import { refreshMcpMarketplace } from "./refreshMcpMarketplace"
import { restartMcpServer } from "./restartMcpServer"
import { subscribeToMcpMarketplaceCatalog } from "./subscribeToMcpMarketplaceCatalog"
import { subscribeToMcpServers } from "./subscribeToMcpServers"
import { toggleMcpServer } from "./toggleMcpServer"
import { toggleToolAutoApprove } from "./toggleToolAutoApprove"
import { updateMcpTimeout } from "./updateMcpTimeout"

// Streaming methods for this service
export const streamingMethods = [
  "subscribeToMcpMarketplaceCatalog",
  "subscribeToMcpServers"
]

// Register all mcp service methods
export function registerAllMethods(): void {
	// Register each method with the registry
	registerMethod("addRemoteMcpServer", addRemoteMcpServer)
	registerMethod("deleteMcpServer", deleteMcpServer)
	registerMethod("downloadMcp", downloadMcp)
	registerMethod("getLatestMcpServers", getLatestMcpServers)
	registerMethod("openMcpSettings", openMcpSettings)
	registerMethod("refreshMcpMarketplace", refreshMcpMarketplace)
	registerMethod("restartMcpServer", restartMcpServer)
	registerMethod("subscribeToMcpMarketplaceCatalog", subscribeToMcpMarketplaceCatalog, { isStreaming: true })
	registerMethod("subscribeToMcpServers", subscribeToMcpServers, { isStreaming: true })
	registerMethod("toggleMcpServer", toggleMcpServer)
	registerMethod("toggleToolAutoApprove", toggleToolAutoApprove)
	registerMethod("updateMcpTimeout", updateMcpTimeout)
}