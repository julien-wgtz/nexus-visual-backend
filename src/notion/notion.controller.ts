import { Body, Controller, HttpStatus, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { NotionService } from './notion.service';
import { response } from 'express';

@UseGuards(AuthGuard)
@Controller('notion')
export class NotionController {
	constructor(private notionService: NotionService) {}

	@Post('get-databases')
	async getDatabases(@Req() request, @Res() response){
		if(!request.user.account.notionToken) {
			return response.status(HttpStatus.BAD_REQUEST).json({message: "No notion token found for this account"})
		}
		const databases = await this.notionService.getDatabases(request.user.account.id, request.user.account.notionToken);
		return response.status(HttpStatus.OK).json(databases)
	}
}
