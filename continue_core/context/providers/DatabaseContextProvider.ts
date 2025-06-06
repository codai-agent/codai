import { getDatabaseAdapter } from "dbinfoz"

import {
	ContextItem,
	ContextProviderDescription,
	ContextProviderExtras,
	ContextSubmenuItem,
	LoadSubmenuItemsArgs,
} from "../../index.js"
import { BaseContextProvider } from "../index.js"

class DatabaseContextProvider extends BaseContextProvider {
	static override description: ContextProviderDescription = {
		title: "database",
		displayTitle: "Database",
		description: "Table schemas",
		type: "submenu",
		renderInlineAs: "",
	}

	async getContextItems(query: string, extras: ContextProviderExtras): Promise<ContextItem[]> {
		const contextItems: ContextItem[] = []

		const connections = this.options?.connections

		if (connections === null) {
			return contextItems
		}

		const [connectionName, table] = query.split(".")

		for (const connection of connections) {
			if (connection.name === connectionName) {
				// @ts-ignore (incorrect typings on module's declaration file)
				const adapter = getDatabaseAdapter(connection.connection_type, connection.connection)
				const tablesAndSchemas = await adapter.getAllTablesAndSchemas(connection.connection.database)

				if (table === "all") {
					let prompt = `Schema for all tables on ${connection.connection_type} is `
					prompt += JSON.stringify(tablesAndSchemas)

					const contextItem = {
						name: `${connectionName}-all-tables-schemas`,
						description: "Schema for all tables.",
						content: prompt,
					}

					contextItems.push(contextItem)
				} else {
					const tables = Object.keys(tablesAndSchemas)

					tables.forEach((tableName) => {
						if (table === tableName) {
							let prompt = `Schema for ${tableName} on ${connection.connection_type} is `
							prompt += JSON.stringify(tablesAndSchemas[tableName])

							const contextItem = {
								name: `${connectionName}-${tableName}-schema`,
								description: `${tableName} Schema`,
								content: prompt,
							}

							contextItems.push(contextItem)
						}
					})
				}
			}
		}

		return contextItems
	}

	override async loadSubmenuItems(args: LoadSubmenuItemsArgs): Promise<ContextSubmenuItem[]> {
		const contextItems: ContextSubmenuItem[] = []
		const connections = this.options?.connections

		if (connections === null) {
			return contextItems
		}

		for (const connection of connections) {
			// @ts-ignore (incorrect typings on module's declaration file)
			const adapter = getDatabaseAdapter(connection.connection_type, connection.connection)
			const tablesAndSchemas = await adapter.getAllTablesAndSchemas(connection.connection.database)
			const tables = Object.keys(tablesAndSchemas)

			const contextItem = {
				id: `${connection.name}.all`,
				title: `${connection.name} all table schemas`,
				description: "",
			}

			contextItems.push(contextItem)

			tables.forEach((tableName) => {
				const contextItem = {
					id: `${connection.name}.${tableName}`,
					title: `${connection.name}.${tableName} schema`,
					description: "",
				}

				contextItems.push(contextItem)
			})
		}

		return contextItems
	}
}

export default DatabaseContextProvider
