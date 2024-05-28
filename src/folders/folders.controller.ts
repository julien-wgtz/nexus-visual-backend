import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FolderDto } from './dto/folderDto';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('folders')
export class FoldersController {

	constructor(private foldersService: FoldersService) {}

	@Post('')
	async getAllFolders(@Body() folderDto: FolderDto, @Res() response: Response, @Req() request ){
		try {
			const folders = await this.foldersService.getAllFolders(folderDto, request.user.account.id);
			return response.status(HttpStatus.OK).json(folders);
		} catch (error) {
			return response.status(HttpStatus.BAD_REQUEST).json({message: error.message});
		}

	}

	@Post('create')
	async createFolder(@Body() folderDto: FolderDto, @Res() response: Response, @Req() request) {
		try {
			const newfolder = await this.foldersService.createFolder(folderDto, request.user.account.id);
			return response.status(HttpStatus.CREATED).json(newfolder);
		} catch (error) {
			return response.status(HttpStatus.BAD_REQUEST).json({message: error.message});
		}
	}

	@Post('update')
	async updateFolder(@Body() folderDto: FolderDto, @Res() response: Response, @Req() request) {
		try {
			await this.foldersService.authorizeFolder(request.user.account.id, folderDto.id);
			const updatedFolder = await this.foldersService.updateFolder(folderDto, response, request.user.account.id);
			return response.status(HttpStatus.OK).json(updatedFolder);
		} catch (error) {
			return response.status(HttpStatus.BAD_REQUEST).json({message: error.message});
		}
	}
	
	@Post('update-order')
	async updateFolderOrder(@Body() {indexOrigine, indexDestination} : {indexOrigine: number, indexDestination: number}, @Res() response: Response, @Req() request) {
		try {
			const updatedFolder = await this.foldersService.updateFolderOrder(indexOrigine, indexDestination, request.user.account.id);
			return response.status(HttpStatus.OK).json(updatedFolder);
		} catch (error) {
			return response.status(HttpStatus.BAD_REQUEST).json({message: error.message});
		}
	}

	@Post('delete')
	async deleteFolder(@Body() folderDto: FolderDto, @Res() response: Response, @Req() request) {
		try {	
			await this.foldersService.authorizeFolder(request.user.account.id, folderDto.id);
			const folderDeleted = await this.foldersService.deleteFolder(folderDto, request.user.account.id);
			return response.status(HttpStatus.OK).json(folderDeleted);
		} catch (error) {
			return response.status(HttpStatus.BAD_REQUEST).json({message: error.message});
		}
	}

	@Post('delete-with-charts')
	async deleteFolderWithCharts(@Body() folderDto: FolderDto, @Res() response: Response, @Req() request) {
		try {
			await this.foldersService.authorizeFolder(request.user.account.id, folderDto.id);
			const folderDeleted = await this.foldersService.deleteFolderWithCharts(folderDto, response, request.user.account.id);
			return response.status(HttpStatus.OK).json(folderDeleted);
		} catch (error) {
			return response.status(HttpStatus.BAD_REQUEST).json({message: error.message});
		}
	}

}
