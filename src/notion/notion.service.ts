import { Body, Injectable, Request } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class NotionService {
	constructor(private readonly accountService: AccountsService) {}

	async getDatabases(accountId: number){
		// get notionToken stored in the user in db 
		const {notionToken}= await this.accountService.getNotionToken(accountId);

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
}
