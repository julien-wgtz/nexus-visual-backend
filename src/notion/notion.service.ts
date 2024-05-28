import { Body, HttpStatus, Injectable, Req, Request } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class NotionService {
	constructor(private readonly accountService: AccountsService) {}

	async getDatabases(accountId: number, notionToken: string){

		const notion = new Client({ auth: notionToken });

		const response = await notion.search({
			"filter": {
				"value": "database",
				"property": "object"
			},
			"sort": {
				"direction": "ascending",
				"timestamp": "last_edited_time"
			}
		})
		const resultarray = [];
		response.results.forEach((result) => {
			if(result["title"][0].plain_text) {
				const item = {
					id: result["id"],
					title: result["title"][0].plain_text,
					icon: {
						emoji: undefined,
						url: undefined
					}
				}
				if(result["icon"]?.type === "emoji") {
					item.icon.emoji = result["icon"]?.emoji
				} else if (result["icon"]?.type === "external"){
					item.icon.url = result["icon"]?.external?.url
				}
				resultarray.push(item);
			}
		})
		return resultarray
	} 

	async getPagesFromDatabase(databaseId: string, notionToken: string){
	
		const notion = new Client({ auth: notionToken });
		const response = await notion.databases.query({
			database_id: databaseId,
			sorts: [
				{
				"property": "Name",
				"direction": "ascending"
				}
			]
		})

		const properties = []

		Object.keys(response.results[0]["properties"]).forEach((key) => {
			if(!["relation", "files", "unique_id"].includes(response.results[0]["properties"][key].type)){
				properties.push({
					name: key,
					type: response.results[0]["properties"][key].type,
					id: response.results[0]["properties"][key].id
				})
			}
		})

		const data = [];
		response.results.forEach((result: any) => {
			let item = {}
			Object.keys(result.properties).forEach((key) => {
				if(!["relation", "files", "unique_id"].includes(result.properties[key].type)){
					item[key] = this.getDataByType(result.properties[key])
				}
			})
			data.push(item)
		})

		return {data,properties}
	}

	getDataByType(property: any){
		switch(property.type){
			case "title":
				return property.title[0]?.plain_text || "";
			case "number":
				return property.number || 0;
			case "string":
				return property.string || "";
			case "date":
				return property.date.start || "";
			case "formula":
				return this.getDataByType(property.formula);
			case "status":
				return property.status.name || "";
			default: 
				console.log(property)
				return null
		}
	}
}
