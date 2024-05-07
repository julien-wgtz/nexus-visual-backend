import { Body, Controller, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { NotionService } from './notion.service';

@UseGuards(AuthGuard)
@Controller('notion')
export class NotionController {
	  constructor(private notionService: NotionService) {}

	  //endpoint to get all the database of a user
	@Post('get-databases')
	async getDatabases(@Body() body: {accountId: number}){
		return this.notionService.getDatabases(body.accountId);
	}
}
