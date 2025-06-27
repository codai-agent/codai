#!/usr/bin/env node

import * as fs from "fs/promises"
import * as path from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"
import { globby } from "globby"
import chalk from "chalk"
import os from "os"

import { createRequire } from "module"
const require = createRequire(import.meta.url)
<<<<<<< HEAD
const PROTOC = path.join(require.resolve("grpc-tools"), "../bin/protoc")

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(SCRIPT_DIR, "..")

const TS_OUT_DIR = path.join(ROOT_DIR, "src/shared/proto")
const GRPC_JS_OUT_DIR = path.join(ROOT_DIR, "src/generated/grpc-js")
const NICE_JS_OUT_DIR = path.join(ROOT_DIR, "src/generated/nice-grpc")
const DESCRIPTOR_OUT_DIR = path.join(ROOT_DIR, "dist-standalone/proto")

const isWindows = process.platform === "win32"
const TS_PROTO_PLUGIN = isWindows
	? path.join(ROOT_DIR, "node_modules", ".bin", "protoc-gen-ts_proto.cmd") // Use the .bin directory path for Windows
	: require.resolve("ts-proto/protoc-gen-ts_proto")

const TS_PROTO_OPTIONS = [
	"env=node",
	"esModuleInterop=true",
	"outputServices=generic-definitions", // output generic ServiceDefinitions
	"outputIndex=true", // output an index file for each package which exports all protos in the package.
	"useOptionals=messages", // Message fields are optional, scalars are not.
	"useDate=false", // Timestamp fields will not be automatically converted to Date.
]

=======
const protoc = path.join(require.resolve("grpc-tools"), "../bin/protoc")

const __filename = fileURLToPath(import.meta.url)
const SCRIPT_DIR = path.dirname(__filename)
const ROOT_DIR = path.resolve(SCRIPT_DIR, "..")

const isWindows = process.platform === "win32"
const tsProtoPlugin = isWindows
	? path.join(ROOT_DIR, "node_modules", ".bin", "protoc-gen-ts_proto.cmd") // Use the .bin directory path for Windows
	: require.resolve("ts-proto/protoc-gen-ts_proto")

>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
// List of gRPC services
// To add a new service, simply add it to this map and run this script
// The service handler will be automatically discovered and used by grpc-handler.ts
const serviceNameMap = {
	account: "codai.AccountService",
	browser: "codai.BrowserService",
	checkpoints: "codai.CheckpointsService",
	file: "codai.FileService",
	mcp: "codai.McpService",
	state: "codai.StateService",
	task: "codai.TaskService",
	web: "codai.WebService",
	models: "codai.ModelsService",
	slash: "codai.SlashService",
	ui: "codai.UiService",
	// Add new services here - no other code changes needed!
}
<<<<<<< HEAD
const serviceDirs = Object.keys(serviceNameMap).map((serviceKey) => path.join(ROOT_DIR, "src/core/controller", serviceKey))
=======
const serviceDirs = Object.keys(serviceNameMap).map((serviceKey) => path.join(ROOT_DIR, "src", "core", "controller", serviceKey))
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d

// List of host gRPC services (IDE API bridge)
// These services are implemented in the IDE extension and called by the standalone Cline Core
const hostServiceNameMap = {
	uri: "host.UriService",
	watch: "host.WatchService",
<<<<<<< HEAD
	workspace: "host.WorkspaceService",
	// Add new host services here
}
const hostServiceDirs = Object.keys(hostServiceNameMap).map((serviceKey) => path.join(ROOT_DIR, "src/hosts/vscode", serviceKey))
=======
	// Add new host services here
}
const hostServiceDirs = Object.keys(hostServiceNameMap).map((serviceKey) => path.join(ROOT_DIR, "hosts", "vscode", serviceKey))
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d

async function main() {
	console.log(chalk.bold.blue("Starting Protocol Buffer code generation..."))

	// Check for Apple Silicon compatibility before proceeding
	checkAppleSiliconCompatibility()
<<<<<<< HEAD

	// Create output directories if they don't exist
	for (const dir of [TS_OUT_DIR, GRPC_JS_OUT_DIR, NICE_JS_OUT_DIR, DESCRIPTOR_OUT_DIR]) {
		await fs.mkdir(dir, { recursive: true })
	}

	await cleanup()

=======

	// Define output directories
	const TS_OUT_DIR = path.join(ROOT_DIR, "src", "shared", "proto")

	// Create output directories if they don't exist
	await fs.mkdir(TS_OUT_DIR, { recursive: true })

	// Clean up existing generated files
	console.log(chalk.cyan("Cleaning up existing generated TypeScript files..."))
	const existingFiles = await globby("**/*.ts", { cwd: TS_OUT_DIR })
	for (const file of existingFiles) {
		await fs.unlink(path.join(TS_OUT_DIR, file))
	}

>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
	// Check for missing proto files for services in serviceNameMap
	await ensureProtoFilesExist()

	// Process all proto files
<<<<<<< HEAD
	const protoFiles = await globby("**/*.proto", { cwd: SCRIPT_DIR, realpath: true })
	console.log(chalk.cyan(`Processing ${protoFiles.length} proto files from`), SCRIPT_DIR)

	tsProtoc(TS_OUT_DIR, protoFiles, TS_PROTO_OPTIONS)
	// grpc-js is used to generate service impls for the ProtoBus service.
	tsProtoc(GRPC_JS_OUT_DIR, protoFiles, ["outputServices=grpc-js,outputClientImpl=false", ...TS_PROTO_OPTIONS])
	// nice-js is used for the Host Bridge client impls because it uses promises.
	tsProtoc(NICE_JS_OUT_DIR, protoFiles, ["outputServices=nice-grpc,useExactTypes=false", ...TS_PROTO_OPTIONS])

	const descriptorFile = path.join(DESCRIPTOR_OUT_DIR, "descriptor_set.pb")
	const descriptorProtocCommand = [
		PROTOC,
=======
	console.log(chalk.cyan("Processing proto files from"), SCRIPT_DIR)
	const protoFiles = await globby("**/*.proto", { cwd: SCRIPT_DIR, realpath: true })

	// Build the protoc command with proper path handling for cross-platform
	const tsProtocCommand = [
		protoc,
		`--proto_path="${SCRIPT_DIR}"`,
		`--plugin=protoc-gen-ts_proto="${tsProtoPlugin}"`,
		`--ts_proto_out="${TS_OUT_DIR}"`,
		"--ts_proto_opt=exportCommonSymbols=false",
		"--ts_proto_opt=outputIndex=true",
		"--ts_proto_opt=outputServices=generic-definitions,env=node,esModuleInterop=true,useDate=false,useOptionals=messages",
		...protoFiles,
	].join(" ")
	try {
		console.log(chalk.cyan(`Generating TypeScript code for:\n${protoFiles.join("\n")}...`))
		execSync(tsProtocCommand, { stdio: "inherit" })
	} catch (error) {
		console.error(chalk.red("Error generating TypeScript for proto files:"), error)
		process.exit(1)
	}

	const descriptorOutDir = path.join(ROOT_DIR, "dist-standalone", "proto")
	await fs.mkdir(descriptorOutDir, { recursive: true })
	const descriptorFile = path.join(descriptorOutDir, "descriptor_set.pb")
	const descriptorProtocCommand = [
		protoc,
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
		`--proto_path="${SCRIPT_DIR}"`,
		`--descriptor_set_out="${descriptorFile}"`,
		"--include_imports",
		...protoFiles,
	].join(" ")
	try {
<<<<<<< HEAD
		log_verbose(chalk.cyan("Generating descriptor set..."))
=======
		console.log(chalk.cyan("Generating descriptor set..."))
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
		execSync(descriptorProtocCommand, { stdio: "inherit" })
	} catch (error) {
		console.error(chalk.red("Error generating descriptor set for proto file:"), error)
		process.exit(1)
	}

	log_verbose(chalk.green("Protocol Buffer code generation completed successfully."))
	log_verbose(chalk.green(`TypeScript files generated in: ${TS_OUT_DIR}`))

	await generateMethodRegistrations()
	await generateHostMethodRegistrations()
	await generateServiceConfig()
	await generateHostServiceConfig()
	await generateGrpcClientConfig()
<<<<<<< HEAD

	console.log(chalk.bold.blue("Finished Protocol Buffer code generation."))
}

async function tsProtoc(outDir, protoFiles, protoOptions) {
	// Build the protoc command with proper path handling for cross-platform
	const command = [
		PROTOC,
		`--proto_path="${SCRIPT_DIR}"`,
		`--plugin=protoc-gen-ts_proto="${TS_PROTO_PLUGIN}"`,
		`--ts_proto_out="${outDir}"`,
		`--ts_proto_opt=${protoOptions.join(",")} `,
		...protoFiles.map((s) => `"${s}"`),
	].join(" ")
	try {
		log_verbose(chalk.cyan(`Generating TypeScript code in ${outDir} for:\n${protoFiles.join("\n")}...`))
		log_verbose(command)
		execSync(command, { stdio: "inherit" })
	} catch (error) {
		console.error(chalk.red("Error generating TypeScript for proto files:"), error)
		process.exit(1)
=======
	await generateHostGrpcClientConfig()
}

/**
 * Generate a gRPC client configuration file for the webview
 * This eliminates the need for manual imports and client creation in grpc-client.ts
 */
async function generateGrpcClientConfig() {
	console.log(chalk.cyan("Generating gRPC client configuration..."))

	const serviceImports = []
	const serviceClientCreations = []
	const serviceExports = []

	// Process each service in the serviceNameMap
	for (const [dirName, fullServiceName] of Object.entries(serviceNameMap)) {
		const capitalizedName = dirName.charAt(0).toUpperCase() + dirName.slice(1)

		// Add import statement
		serviceImports.push(`import { ${capitalizedName}ServiceDefinition } from "@shared/proto/${dirName}"`)

		// Add client creation
		serviceClientCreations.push(
			`const ${capitalizedName}ServiceClient = createGrpcClient(${capitalizedName}ServiceDefinition)`,
		)

		// Add to exports
		serviceExports.push(`${capitalizedName}ServiceClient`)
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
	}

	// Generate the file content
	const content = `// AUTO-GENERATED FILE - DO NOT MODIFY DIRECTLY
// Generated by proto/build-proto.js

import { createGrpcClient } from "./grpc-client-base"
${serviceImports.join("\n")}

${serviceClientCreations.join("\n")}

export {
	${serviceExports.join(",\n\t")}
}`

	const configPath = path.join(ROOT_DIR, "webview-ui", "src", "services", "grpc-client.ts")
	await fs.writeFile(configPath, content)
	console.log(chalk.green(`Generated gRPC client at ${configPath}`))
}

/**
 * Parse proto files to extract streaming method information
 * @param protoFiles Array of proto file names
 * @param scriptDir Directory containing proto files
 * @returns Map of service names to their streaming methods
 */
async function parseProtoForStreamingMethods(protoFiles, scriptDir) {
	console.log(chalk.cyan("Parsing proto files for streaming methods..."))

	// Map of service name to array of streaming method names
	const streamingMethodsMap = new Map()

	for (const protoFile of protoFiles) {
		const content = await fs.readFile(path.join(scriptDir, protoFile), "utf8")

		// Extract package name
		const packageMatch = content.match(/package\s+([^;]+);/)
		const packageName = packageMatch ? packageMatch[1].trim() : "unknown"

		// Extract service definitions
		const serviceMatches = Array.from(content.matchAll(/service\s+(\w+)\s*\{([^}]+)\}/g))
		for (const serviceMatch of serviceMatches) {
			const serviceName = serviceMatch[1]
			const serviceBody = serviceMatch[2]
			const fullServiceName = `${packageName}.${serviceName}`

			// Extract method definitions with streaming
			const methodMatches = Array.from(
				serviceBody.matchAll(/rpc\s+(\w+)\s*\(\s*(stream\s+)?(\w+)\s*\)\s*returns\s*\(\s*(stream\s+)?(\w+)\s*\)/g),
			)

			const streamingMethods = []
			for (const methodMatch of methodMatches) {
				const methodName = methodMatch[1]
				const isRequestStreaming = !!methodMatch[2]
				const requestType = methodMatch[3]
				const isResponseStreaming = !!methodMatch[4]
				const responseType = methodMatch[5]

				if (isResponseStreaming) {
					streamingMethods.push({
						name: methodName,
						requestType,
						responseType,
						isRequestStreaming,
					})
				}
			}

			if (streamingMethods.length > 0) {
				streamingMethodsMap.set(fullServiceName, streamingMethods)
			}
		}
	}

	return streamingMethodsMap
}

/**
 * Generate a gRPC client configuration file for the webview
 * This eliminates the need for manual imports and client creation in grpc-client.ts
 */
async function generateGrpcClientConfig() {
	log_verbose(chalk.cyan("Generating gRPC client configuration..."))

<<<<<<< HEAD
	const serviceImports = []
	const serviceClientCreations = []
	const serviceExports = []

	// Process each service in the serviceNameMap
	for (const [dirName, _fullServiceName] of Object.entries(serviceNameMap)) {
		const capitalizedName = dirName.charAt(0).toUpperCase() + dirName.slice(1)

		// Add import statement
		serviceImports.push(`import { ${capitalizedName}ServiceDefinition } from "@shared/proto/${dirName}"`)

		// Add client creation
		serviceClientCreations.push(
			`const ${capitalizedName}ServiceClient = createGrpcClient(${capitalizedName}ServiceDefinition)`,
		)

		// Add to exports
		serviceExports.push(`${capitalizedName}ServiceClient`)
	}

	// Generate the file content
	const content = `// AUTO-GENERATED FILE - DO NOT MODIFY DIRECTLY
// Generated by proto/build-proto.js

import { createGrpcClient } from "./grpc-client-base"
${serviceImports.join("\n")}

${serviceClientCreations.join("\n")}

export {
	${serviceExports.join(",\n\t")}
}`

	const filePath = path.join(ROOT_DIR, "webview-ui/src/services/grpc-client.ts")
	await writeFileWithMkdirs(filePath, content)
	log_verbose(chalk.green(`Generated gRPC client at ${filePath}`))
}

/**
 * Parse proto files to extract streaming method information
 * @param protoFiles Array of proto file names
 * @param scriptDir Directory containing proto files
 * @returns Map of service names to their streaming methods
 */
async function parseProtoForStreamingMethods(protoFiles, scriptDir) {
	log_verbose(chalk.cyan("Parsing proto files for streaming methods..."))

	// Map of service name to array of streaming method names
	const streamingMethodsMap = new Map()

	for (const protoFile of protoFiles) {
		const content = await fs.readFile(path.join(scriptDir, protoFile), "utf8")

		// Extract package name
		const packageMatch = content.match(/package\s+([^;]+);/)
		const packageName = packageMatch ? packageMatch[1].trim() : "unknown"

		// Extract service definitions
		const serviceMatches = Array.from(content.matchAll(/service\s+(\w+)\s*\{([^}]+)\}/g))
		for (const serviceMatch of serviceMatches) {
			const serviceName = serviceMatch[1]
			const serviceBody = serviceMatch[2]
			const fullServiceName = `${packageName}.${serviceName}`

			// Extract method definitions with streaming
			const methodMatches = Array.from(
				serviceBody.matchAll(/rpc\s+(\w+)\s*\(\s*(stream\s+)?(\w+)\s*\)\s*returns\s*\(\s*(stream\s+)?(\w+)\s*\)/g),
			)

			const streamingMethods = []
			for (const methodMatch of methodMatches) {
				const methodName = methodMatch[1]
				const isRequestStreaming = !!methodMatch[2]
				const requestType = methodMatch[3]
				const isResponseStreaming = !!methodMatch[4]
				const responseType = methodMatch[5]

				if (isResponseStreaming) {
					streamingMethods.push({
						name: methodName,
						requestType,
						responseType,
						isRequestStreaming,
					})
				}
			}

			if (streamingMethods.length > 0) {
				streamingMethodsMap.set(fullServiceName, streamingMethods)
			}
		}
	}

	return streamingMethodsMap
}

async function generateMethodRegistrations() {
	log_verbose(chalk.cyan("Generating method registration files..."))

=======
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
	// Parse proto files for streaming methods
	const protoFiles = await globby("*.proto", { cwd: SCRIPT_DIR })
	const streamingMethodsMap = await parseProtoForStreamingMethods(protoFiles, SCRIPT_DIR)

	for (const serviceDir of serviceDirs) {
<<<<<<< HEAD
		const serviceName = path.basename(serviceDir)
=======
		try {
			await fs.access(serviceDir)
		} catch (error) {
			console.log(chalk.cyan(`Creating directory ${serviceDir} for new service`))
			await fs.mkdir(serviceDir, { recursive: true })
		}

		const serviceName = path.basename(serviceDir)
		const registryFile = path.join(serviceDir, "methods.ts")
		const indexFile = path.join(serviceDir, "index.ts")

>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
		const fullServiceName = serviceNameMap[serviceName]
		const streamingMethods = streamingMethodsMap.get(fullServiceName) || []

		log_verbose(chalk.cyan(`Generating method registrations for ${serviceName}...`))

		// Get all TypeScript files in the service directory
		const files = await globby("*.ts", { cwd: serviceDir })

		// Filter out index.ts and methods.ts
		const implementationFiles = files.filter((file) => file !== "index.ts" && file !== "methods.ts")

		// Create the methods.ts file with header
		let methodsContent = `// AUTO-GENERATED FILE - DO NOT MODIFY DIRECTLY
// Generated by proto/build-proto.js

// Import all method implementations
import { registerMethod } from "./index"\n`

		// Import implementations directly
		for (const file of implementationFiles) {
			const baseName = path.basename(file, ".ts")
			methodsContent += `import { ${baseName} } from "./${baseName}"\n`
		}

		// Add streaming methods information
		if (streamingMethods.length > 0) {
			methodsContent += `\n// Streaming methods for this service
export const streamingMethods = ${JSON.stringify(
				streamingMethods.map((m) => m.name),
				null,
				2,
			)}\n`
		}

		// Add registration function
		methodsContent += `\n// Register all ${serviceName} service methods
export function registerAllMethods(): void {
\t// Register each method with the registry\n`

		// Add registration statements
		for (const file of implementationFiles) {
			const baseName = path.basename(file, ".ts")
			const isStreaming = streamingMethods.some((m) => m.name === baseName)

			if (isStreaming) {
				methodsContent += `\tregisterMethod("${baseName}", ${baseName}, { isStreaming: true })\n`
			} else {
				methodsContent += `\tregisterMethod("${baseName}", ${baseName})\n`
			}
		}

		// Close the function
		methodsContent += `}`

		// Write the methods.ts file
<<<<<<< HEAD
		const registryFile = path.join(serviceDir, "methods.ts")
		await writeFileWithMkdirs(registryFile, methodsContent)
		log_verbose(chalk.green(`Generated ${registryFile}`))
=======
		await fs.writeFile(registryFile, methodsContent)
		console.log(chalk.green(`Generated ${registryFile}`))
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d

		// Generate index.ts file
		const capitalizedServiceName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1)
		const indexContent = `// AUTO-GENERATED FILE - DO NOT MODIFY DIRECTLY
// Generated by proto/build-proto.js

import { createServiceRegistry, ServiceMethodHandler, StreamingMethodHandler } from "../grpc-service"
import { StreamingResponseHandler } from "../grpc-handler"
import { registerAllMethods } from "./methods"

// Create ${serviceName} service registry
const ${serviceName}Service = createServiceRegistry("${serviceName}")

// Export the method handler types and registration function
export type ${capitalizedServiceName}MethodHandler = ServiceMethodHandler
export type ${capitalizedServiceName}StreamingMethodHandler = StreamingMethodHandler
export const registerMethod = ${serviceName}Service.registerMethod

// Export the request handlers
export const handle${capitalizedServiceName}ServiceRequest = ${serviceName}Service.handleRequest
export const handle${capitalizedServiceName}ServiceStreamingRequest = ${serviceName}Service.handleStreamingRequest
export const isStreamingMethod = ${serviceName}Service.isStreamingMethod

// Register all ${serviceName} methods
registerAllMethods()`

		// Write the index.ts file
<<<<<<< HEAD
		const indexFile = path.join(serviceDir, "index.ts")
		await writeFileWithMkdirs(indexFile, indexContent)
		log_verbose(chalk.green(`Generated ${indexFile}`))
=======
		await fs.writeFile(indexFile, indexContent)
		console.log(chalk.green(`Generated ${indexFile}`))
>>>>>>> 16bc1c863785d2e3350bd9c2baa4bc31be43087d
	}

	log_verbose(chalk.green("Method registration files generated successfully."))
}

/**
 * Generate a service configuration file that maps service names to their handlers
 * This eliminates the need for manual switch/case statements in grpc-handler.ts
 */
async function generateServiceConfig() {
	log_verbose(chalk.cyan("Generating service configuration file..."))

	const serviceImports = []
	const serviceConfigs = []

	// Add all services from the serviceNameMap
	for (const [dirName, fullServiceName] of Object.entries(serviceNameMap)) {
		const capitalizedName = dirName.charAt(0).toUpperCase() + dirName.slice(1)
		serviceImports.push(
			`import { handle${capitalizedName}ServiceRequest, handle${capitalizedName}ServiceStreamingRequest } from "./${dirName}/index"`,
		)
		serviceConfigs.push(`
  "${fullServiceName}": {
    requestHandler: handle${capitalizedName}ServiceRequest,
    streamingHandler: handle${capitalizedName}ServiceStreamingRequest
  }`)
	}

	const content = `// AUTO-GENERATED FILE - DO NOT MODIFY DIRECTLY
// Generated by proto/build-proto.js

import { Controller } from "./index"
import { StreamingResponseHandler } from "./grpc-handler"
${serviceImports.join("\n")}

/**
 * Configuration for a service handler
 */
export interface ServiceHandlerConfig {
  requestHandler: (controller: Controller, method: string, message: any) => Promise<any>;
  streamingHandler: (controller: Controller, method: string, message: any, responseStream: StreamingResponseHandler, requestId?: string) => Promise<void>;
}

/**
 * Map of service names to their handler configurations
 */
export const serviceHandlers: Record<string, ServiceHandlerConfig> = {${serviceConfigs.join(",")}
};`

	const configPath = path.join(ROOT_DIR, "src/core/controller/grpc-service-config.ts")
	await writeFileWithMkdirs(configPath, content)
	log_verbose(chalk.green(`Generated service configuration at ${configPath}`))
}

/**
 * Ensure that a .proto file exists for each service in the serviceNameMap
 * If a .proto file doesn't exist, create a template file
 */
async function ensureProtoFilesExist() {
	log_verbose(chalk.cyan("Checking for missing proto files..."))

	// Get existing proto files
	const existingProtoFiles = await globby("*.proto", { cwd: SCRIPT_DIR })
	const existingProtoServices = existingProtoFiles.map((file) => path.basename(file, ".proto"))

	// Check each service in serviceNameMap
	for (const [serviceName, fullServiceName] of Object.entries(serviceNameMap)) {
		if (!existingProtoServices.includes(serviceName)) {
			log_verbose(chalk.yellow(`Creating template proto file for ${serviceName}...`))

			// Extract service class name from full name (e.g., "codai.ModelsService" -> "ModelsService")
			const serviceClassName = fullServiceName.split(".").pop()

			// Create template proto file
			const protoContent = `syntax = "proto3";

package codai;
option java_package = "bot.cline.proto";
option java_multiple_files = true;

import "common.proto";

// ${serviceClassName} provides methods for managing ${serviceName}
service ${serviceClassName} {
  // Add your RPC methods here
  // Example (String is from common.proto, responses should be generic types):
  // rpc YourMethod(YourRequest) returns (String);
}

// Add your message definitions here
// Example (Requests must always start with Metadata):
// message YourRequest {
//   Metadata metadata = 1;
//   string stringField = 2;
//   int32 int32Field = 3;
// }
`

			// Write the template proto file
			const protoFilePath = path.join(SCRIPT_DIR, `${serviceName}.proto`)
			await fs.writeFile(protoFilePath, protoContent)
			log_verbose(chalk.green(`Created template proto file at ${protoFilePath}`))
		}
	}
}

/**
 * Generate method registration files for host services
 */
async function generateHostMethodRegistrations() {
	log_verbose(chalk.cyan("Generating host method registration files..."))

	// Parse proto files for streaming methods
	const hostProtoFiles = await globby("*.proto", { cwd: path.join(SCRIPT_DIR, "host") })
	const streamingMethodsMap = await parseProtoForStreamingMethods(hostProtoFiles, path.join(SCRIPT_DIR, "host"))

	for (const serviceDir of hostServiceDirs) {
		const serviceName = path.basename(serviceDir)
		const fullServiceName = hostServiceNameMap[serviceName]
		const streamingMethods = streamingMethodsMap.get(fullServiceName) || []

		log_verbose(chalk.cyan(`Generating method registrations for host ${serviceName}...`))

		// Get all TypeScript files in the service directory
		const files = await globby("*.ts", { cwd: serviceDir })

		// Filter out index.ts and methods.ts
		const implementationFiles = files.filter((file) => file !== "index.ts" && file !== "methods.ts")

		// Create the methods.ts file with header
		let methodsContent = `// AUTO-GENERATED FILE - DO NOT MODIFY DIRECTLY
// Generated by proto/build-proto.js

// Import all method implementations
import { registerMethod } from "./index"\n`

		// Import implementations directly
		for (const file of implementationFiles) {
			const baseName = path.basename(file, ".ts")
			methodsContent += `import { ${baseName} } from "./${baseName}"\n`
		}

		// Add streaming methods information
		if (streamingMethods.length > 0) {
			methodsContent += `\n// Streaming methods for this service
export const streamingMethods = ${JSON.stringify(
				streamingMethods.map((m) => m.name),
				null,
				2,
			)}\n`
		}

		// Add registration function
		methodsContent += `\n// Register all ${serviceName} service methods
export function registerAllMethods(): void {
\t// Register each method with the registry\n`

		// Add registration statements
		for (const file of implementationFiles) {
			const baseName = path.basename(file, ".ts")
			const isStreaming = streamingMethods.some((m) => m.name === baseName)

			if (isStreaming) {
				methodsContent += `\tregisterMethod("${baseName}", ${baseName}, { isStreaming: true })\n`
			} else {
				methodsContent += `\tregisterMethod("${baseName}", ${baseName})\n`
			}
		}

		// Close the function
		methodsContent += `}`

		// Write the methods.ts file
		const registryFile = path.join(serviceDir, "methods.ts")
		await writeFileWithMkdirs(registryFile, methodsContent)
		log_verbose(chalk.green(`Generated ${registryFile}`))

		// Generate index.ts file
		const capitalizedServiceName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1)
		const indexContent = `// AUTO-GENERATED FILE - DO NOT MODIFY DIRECTLY
// Generated by proto/build-proto.js

import { createServiceRegistry, ServiceMethodHandler, StreamingMethodHandler } from "../host-grpc-service"
import { StreamingResponseHandler } from "../host-grpc-handler"
import { registerAllMethods } from "./methods"

// Create ${serviceName} service registry
const ${serviceName}Service = createServiceRegistry("${serviceName}")

// Export the method handler types and registration function
export type ${capitalizedServiceName}MethodHandler = ServiceMethodHandler
export type ${capitalizedServiceName}StreamingMethodHandler = StreamingMethodHandler
export const registerMethod = ${serviceName}Service.registerMethod

// Export the request handlers
export const handle${capitalizedServiceName}ServiceRequest = ${serviceName}Service.handleRequest
export const handle${capitalizedServiceName}ServiceStreamingRequest = ${serviceName}Service.handleStreamingRequest
export const isStreamingMethod = ${serviceName}Service.isStreamingMethod

// Register all ${serviceName} methods
registerAllMethods()`

		// Write the index.ts file
		const indexFile = path.join(serviceDir, "index.ts")
		await writeFileWithMkdirs(indexFile, indexContent)
		log_verbose(chalk.green(`Generated ${indexFile}`))
	}

	log_verbose(chalk.green("Host method registration files generated successfully."))
}

/**
 * Generate a service configuration file for host services
 */
async function generateHostServiceConfig() {
	log_verbose(chalk.cyan("Generating host service configuration file..."))

	const serviceImports = []
	const serviceConfigs = []

	// Add all services from the hostServiceNameMap
	for (const [dirName, fullServiceName] of Object.entries(hostServiceNameMap)) {
		const capitalizedName = dirName.charAt(0).toUpperCase() + dirName.slice(1)
		serviceImports.push(
			`import { handle${capitalizedName}ServiceRequest, handle${capitalizedName}ServiceStreamingRequest } from "./${dirName}/index"`,
		)
		serviceConfigs.push(`
  "${fullServiceName}": {
    requestHandler: handle${capitalizedName}ServiceRequest,
    streamingHandler: handle${capitalizedName}ServiceStreamingRequest
  }`)
	}

	const content = `// AUTO-GENERATED FILE - DO NOT MODIFY DIRECTLY
// Generated by proto/build-proto.js

import { StreamingResponseHandler } from "./host-grpc-handler"
${serviceImports.join("\n")}

/**
 * Configuration for a host service handler
 */
export interface HostServiceHandlerConfig {
  requestHandler: (method: string, message: any) => Promise<any>;
  streamingHandler: (method: string, message: any, responseStream: StreamingResponseHandler, requestId?: string) => Promise<void>;
}

/**
 * Map of host service names to their handler configurations
 */
export const hostServiceHandlers: Record<string, HostServiceHandlerConfig> = {${serviceConfigs.join(",")}
};`

	const filePath = path.join(ROOT_DIR, "src/hosts/vscode/host-grpc-service-config.ts")
	await writeFileWithMkdirs(filePath, content)
	log_verbose(chalk.green(`Generated host service configuration at ${filePath}`))
}

async function cleanup() {
	// Clean up existing generated files
	log_verbose(chalk.cyan("Cleaning up existing generated TypeScript files..."))
	const existingFiles = await globby("**/*.ts", { cwd: TS_OUT_DIR })
	for (const file of existingFiles) {
		await fs.unlink(path.join(TS_OUT_DIR, file))
	}
	await rmdir(path.join(ROOT_DIR, "src/generated"))

	// Clean up generated files that were moved.
	await fs.rm(path.join(ROOT_DIR, "src/standalone/services/host-grpc-client.ts"), { force: true })
	await rmdir(path.join(ROOT_DIR, "src/standalone/services"))

	await fs.rm(path.join(ROOT_DIR, "hosts/vscode"), { force: true, recursive: true })
	await rmdir(path.join(ROOT_DIR, "hosts"))

	await fs.rm(path.join(ROOT_DIR, "src/standalone/server-setup.ts"), { force: true })
}

/**
 * Write `contents` to `filePath`, creating any necessary directories in `filePath`.
 */
async function writeFileWithMkdirs(filePath, content) {
	await fs.mkdir(path.dirname(filePath), { recursive: true })
	await fs.writeFile(filePath, content)
}

/**
 * Remove an empty dir, do nothing if the directory doesn't exist or is not empty.
 */
async function rmdir(path) {
	try {
		await fs.rmdir(path)
	} catch (error) {
		if (error.code !== "ENOTEMPTY" && error.code !== "ENOENT") {
			// Only re-throw if it's not "not empty" or "doesn't exist"
			throw error
		}
	}
}

function serviceNameWithoutPackage(fullServiceName) {
	return fullServiceName.replace(/.*\./, "")
}
function lowercaseFirstChar(str) {
	return str.charAt(0).toLowerCase() + str.slice(1)
}

// Check for Apple Silicon compatibility
function checkAppleSiliconCompatibility() {
	// Only run check on macOS
	if (process.platform !== "darwin") {
		return
	}

	// Check if running on Apple Silicon
	const cpuArchitecture = os.arch()
	if (cpuArchitecture === "arm64") {
		try {
			// Check if Rosetta is installed
			const rosettaCheck = execSync('/usr/bin/pgrep oahd || echo "NOT_INSTALLED"').toString().trim()

			if (rosettaCheck === "NOT_INSTALLED") {
				console.log(chalk.yellow("Detected Apple Silicon (ARM64) architecture."))
				console.log(
					chalk.red("Rosetta 2 is NOT installed. The npm version of protoc is not compatible with Apple Silicon."),
				)
				console.log(chalk.cyan("Please install Rosetta 2 using the following command:"))
				console.log(chalk.cyan("  softwareupdate --install-rosetta --agree-to-license"))
				console.log(chalk.red("Aborting build process."))
				process.exit(1)
			}
		} catch (error) {
			console.log(chalk.yellow("Could not determine Rosetta installation status. Proceeding anyway."))
		}
	}
}

function log_verbose(s) {
	if (process.argv.includes("-v") || process.argv.includes("--verbose")) {
		console.log(s)
	}
}

/**
 * Generate a service configuration file that maps service names to their handlers
 * This eliminates the need for manual switch/case statements in grpc-handler.ts
 */
async function generateServiceConfig() {
	console.log(chalk.cyan("Generating service configuration file..."))

	const serviceImports = []
	const serviceConfigs = []

	// Add all services from the serviceNameMap
	for (const [dirName, fullServiceName] of Object.entries(serviceNameMap)) {
		const capitalizedName = dirName.charAt(0).toUpperCase() + dirName.slice(1)
		serviceImports.push(
			`import { handle${capitalizedName}ServiceRequest, handle${capitalizedName}ServiceStreamingRequest } from "./${dirName}/index"`,
		)
		serviceConfigs.push(`
  "${fullServiceName}": {
    requestHandler: handle${capitalizedName}ServiceRequest,
    streamingHandler: handle${capitalizedName}ServiceStreamingRequest
  }`)
	}

	const content = `// AUTO-GENERATED FILE - DO NOT MODIFY DIRECTLY
// Generated by proto/build-proto.js

import { Controller } from "./index"
import { StreamingResponseHandler } from "./grpc-handler"
${serviceImports.join("\n")}

/**
 * Configuration for a service handler
 */
export interface ServiceHandlerConfig {
  requestHandler: (controller: Controller, method: string, message: any) => Promise<any>;
  streamingHandler: (controller: Controller, method: string, message: any, responseStream: StreamingResponseHandler, requestId?: string) => Promise<void>;
}

/**
 * Map of service names to their handler configurations
 */
export const serviceHandlers: Record<string, ServiceHandlerConfig> = {${serviceConfigs.join(",")}
};`

	const configPath = path.join(ROOT_DIR, "src", "core", "controller", "grpc-service-config.ts")
	await fs.writeFile(configPath, content)
	console.log(chalk.green(`Generated service configuration at ${configPath}`))
}

/**
 * Ensure that a .proto file exists for each service in the serviceNameMap
 * If a .proto file doesn't exist, create a template file
 */
async function ensureProtoFilesExist() {
	console.log(chalk.cyan("Checking for missing proto files..."))

	// Get existing proto files
	const existingProtoFiles = await globby("*.proto", { cwd: SCRIPT_DIR })
	const existingProtoServices = existingProtoFiles.map((file) => path.basename(file, ".proto"))

	// Check each service in serviceNameMap
	for (const [serviceName, fullServiceName] of Object.entries(serviceNameMap)) {
		if (!existingProtoServices.includes(serviceName)) {
			console.log(chalk.yellow(`Creating template proto file for ${serviceName}...`))

			// Extract service class name from full name (e.g., "codai.ModelsService" -> "ModelsService")
			const serviceClassName = fullServiceName.split(".").pop()

			// Create template proto file
			const protoContent = `syntax = "proto3";

package codai;
option java_package = "bot.cline.proto";
option java_multiple_files = true;

import "common.proto";

// ${serviceClassName} provides methods for managing ${serviceName}
service ${serviceClassName} {
  // Add your RPC methods here
  // Example (String is from common.proto, responses should be generic types):
  // rpc YourMethod(YourRequest) returns (String);
}

// Add your message definitions here
// Example (Requests must always start with Metadata):
// message YourRequest {
//   Metadata metadata = 1;
//   string stringField = 2;
//   int32 int32Field = 3;
// }
`

			// Write the template proto file
			const protoFilePath = path.join(SCRIPT_DIR, `${serviceName}.proto`)
			await fs.writeFile(protoFilePath, protoContent)
			console.log(chalk.green(`Created template proto file at ${protoFilePath}`))
		}
	}
}

/**
 * Generate method registration files for host services
 */
async function generateHostMethodRegistrations() {
	console.log(chalk.cyan("Generating host method registration files..."))

	// Parse proto files for streaming methods
	const hostProtoFiles = await globby("*.proto", { cwd: path.join(SCRIPT_DIR, "host") })
	const streamingMethodsMap = await parseProtoForStreamingMethods(hostProtoFiles, path.join(SCRIPT_DIR, "host"))

	for (const serviceDir of hostServiceDirs) {
		try {
			await fs.access(serviceDir)
		} catch (error) {
			console.log(chalk.cyan(`Creating directory ${serviceDir} for new host service`))
			await fs.mkdir(serviceDir, { recursive: true })
		}

		const serviceName = path.basename(serviceDir)
		const registryFile = path.join(serviceDir, "methods.ts")
		const indexFile = path.join(serviceDir, "index.ts")

		const fullServiceName = hostServiceNameMap[serviceName]
		const streamingMethods = streamingMethodsMap.get(fullServiceName) || []

		console.log(chalk.cyan(`Generating method registrations for host ${serviceName}...`))

		// Get all TypeScript files in the service directory
		const files = await globby("*.ts", { cwd: serviceDir })

		// Filter out index.ts and methods.ts
		const implementationFiles = files.filter((file) => file !== "index.ts" && file !== "methods.ts")

		// Create the methods.ts file with header
		let methodsContent = `// AUTO-GENERATED FILE - DO NOT MODIFY DIRECTLY
// Generated by proto/build-proto.js

// Import all method implementations
import { registerMethod } from "./index"\n`

		// Import implementations directly
		for (const file of implementationFiles) {
			const baseName = path.basename(file, ".ts")
			methodsContent += `import { ${baseName} } from "./${baseName}"\n`
		}

		// Add streaming methods information
		if (streamingMethods.length > 0) {
			methodsContent += `\n// Streaming methods for this service
export const streamingMethods = ${JSON.stringify(
				streamingMethods.map((m) => m.name),
				null,
				2,
			)}\n`
		}

		// Add registration function
		methodsContent += `\n// Register all ${serviceName} service methods
export function registerAllMethods(): void {
\t// Register each method with the registry\n`

		// Add registration statements
		for (const file of implementationFiles) {
			const baseName = path.basename(file, ".ts")
			const isStreaming = streamingMethods.some((m) => m.name === baseName)

			if (isStreaming) {
				methodsContent += `\tregisterMethod("${baseName}", ${baseName}, { isStreaming: true })\n`
			} else {
				methodsContent += `\tregisterMethod("${baseName}", ${baseName})\n`
			}
		}

		// Close the function
		methodsContent += `}`

		// Write the methods.ts file
		await fs.writeFile(registryFile, methodsContent)
		console.log(chalk.green(`Generated ${registryFile}`))

		// Generate index.ts file
		const capitalizedServiceName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1)
		const indexContent = `// AUTO-GENERATED FILE - DO NOT MODIFY DIRECTLY
// Generated by proto/build-proto.js

import { createServiceRegistry, ServiceMethodHandler, StreamingMethodHandler } from "../host-grpc-service"
import { StreamingResponseHandler } from "../host-grpc-handler"
import { registerAllMethods } from "./methods"

// Create ${serviceName} service registry
const ${serviceName}Service = createServiceRegistry("${serviceName}")

// Export the method handler types and registration function
export type ${capitalizedServiceName}MethodHandler = ServiceMethodHandler
export type ${capitalizedServiceName}StreamingMethodHandler = StreamingMethodHandler
export const registerMethod = ${serviceName}Service.registerMethod

// Export the request handlers
export const handle${capitalizedServiceName}ServiceRequest = ${serviceName}Service.handleRequest
export const handle${capitalizedServiceName}ServiceStreamingRequest = ${serviceName}Service.handleStreamingRequest
export const isStreamingMethod = ${serviceName}Service.isStreamingMethod

// Register all ${serviceName} methods
registerAllMethods()`

		// Write the index.ts file
		await fs.writeFile(indexFile, indexContent)
		console.log(chalk.green(`Generated ${indexFile}`))
	}

	console.log(chalk.green("Host method registration files generated successfully."))
}

/**
 * Generate a service configuration file for host services
 */
async function generateHostServiceConfig() {
	console.log(chalk.cyan("Generating host service configuration file..."))

	const serviceImports = []
	const serviceConfigs = []

	// Add all services from the hostServiceNameMap
	for (const [dirName, fullServiceName] of Object.entries(hostServiceNameMap)) {
		const capitalizedName = dirName.charAt(0).toUpperCase() + dirName.slice(1)
		serviceImports.push(
			`import { handle${capitalizedName}ServiceRequest, handle${capitalizedName}ServiceStreamingRequest } from "./${dirName}/index"`,
		)
		serviceConfigs.push(`
  "${fullServiceName}": {
    requestHandler: handle${capitalizedName}ServiceRequest,
    streamingHandler: handle${capitalizedName}ServiceStreamingRequest
  }`)
	}

	const content = `// AUTO-GENERATED FILE - DO NOT MODIFY DIRECTLY
// Generated by proto/build-proto.js

import { StreamingResponseHandler } from "./host-grpc-handler"
${serviceImports.join("\n")}

/**
 * Configuration for a host service handler
 */
export interface HostServiceHandlerConfig {
  requestHandler: (method: string, message: any) => Promise<any>;
  streamingHandler: (method: string, message: any, responseStream: StreamingResponseHandler, requestId?: string) => Promise<void>;
}

/**
 * Map of host service names to their handler configurations
 */
export const hostServiceHandlers: Record<string, HostServiceHandlerConfig> = {${serviceConfigs.join(",")}
};`

	const configPath = path.join(ROOT_DIR, "hosts", "vscode", "host-grpc-service-config.ts")
	await fs.mkdir(path.dirname(configPath), { recursive: true })
	await fs.writeFile(configPath, content)
	console.log(chalk.green(`Generated host service configuration at ${configPath}`))
}

/**
 * Generate a gRPC client configuration file for host services
 */
async function generateHostGrpcClientConfig() {
	console.log(chalk.cyan("Generating host gRPC client configuration..."))

	const serviceImports = []
	const serviceClientCreations = []
	const serviceExports = []

	// Process each service in the hostServiceNameMap
	for (const [dirName, fullServiceName] of Object.entries(hostServiceNameMap)) {
		const capitalizedName = dirName.charAt(0).toUpperCase() + dirName.slice(1)

		// Add import statement
		serviceImports.push(`import { ${capitalizedName}ServiceDefinition } from "@shared/proto/host/${dirName}"`)

		// Add client creation
		serviceClientCreations.push(
			`const ${capitalizedName}ServiceClient = createGrpcClient(${capitalizedName}ServiceDefinition)`,
		)

		// Add to exports
		serviceExports.push(`${capitalizedName}ServiceClient`)
	}

	// Generate the file content
	const content = `// AUTO-GENERATED FILE - DO NOT MODIFY DIRECTLY
// Generated by proto/build-proto.js

import { createGrpcClient } from "./host-grpc-client-base"
${serviceImports.join("\n")}

${serviceClientCreations.join("\n")}

export {
	${serviceExports.join(",\n\t")}
}`

	const configPath = path.join(ROOT_DIR, "src", "standalone", "services", "host-grpc-client.ts")
	await fs.mkdir(path.dirname(configPath), { recursive: true })
	await fs.writeFile(configPath, content)
	console.log(chalk.green(`Generated host gRPC client at ${configPath}`))
}

// Check for Apple Silicon compatibility
function checkAppleSiliconCompatibility() {
	// Only run check on macOS
	if (process.platform !== "darwin") {
		return
	}

	// Check if running on Apple Silicon
	const cpuArchitecture = os.arch()
	if (cpuArchitecture === "arm64") {
		try {
			// Check if Rosetta is installed
			const rosettaCheck = execSync('/usr/bin/pgrep oahd || echo "NOT_INSTALLED"').toString().trim()

			if (rosettaCheck === "NOT_INSTALLED") {
				console.log(chalk.yellow("Detected Apple Silicon (ARM64) architecture."))
				console.log(
					chalk.red("Rosetta 2 is NOT installed. The npm version of protoc is not compatible with Apple Silicon."),
				)
				console.log(chalk.cyan("Please install Rosetta 2 using the following command:"))
				console.log(chalk.cyan("  softwareupdate --install-rosetta --agree-to-license"))
				console.log(chalk.red("Aborting build process."))
				process.exit(1)
			}
		} catch (error) {
			console.log(chalk.yellow("Could not determine Rosetta installation status. Proceeding anyway."))
		}
	}
}

// Run the main function
main().catch((error) => {
	console.error(chalk.red("Error:"), error)
	process.exit(1)
})
