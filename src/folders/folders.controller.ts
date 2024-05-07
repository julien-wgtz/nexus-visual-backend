import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FolderDto } from './dto/folderDto';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('folders')
export class FoldersController {

	constructor(private foldersService: FoldersService) {}

	@Post('')
	getAllFolders(@Body() folderDto: FolderDto, @Res() response: Response) {
		return this.foldersService.getAllFolders(folderDto, response);
	}

	@Post('create')
	createFolder(@Body() folderDto: FolderDto, @Res() response: Response) {
		return this.foldersService.createFolder(folderDto, response);
	}

	@Post('update')
	updateFolder(@Body() folderDto: FolderDto, @Res() response: Response) {
		return this.foldersService.updateFolder(folderDto, response);
	}
	
	@Post('update-order')
	updateFolderOrder(@Body() {indexOrigine, indexDestination} : {indexOrigine: number, indexDestination: number}, @Res() response: Response) {
		return this.foldersService.updateFolderOrder(indexOrigine, indexDestination, response);
	}

	@Post('delete')
	deleteFolder(@Body() folderDto: FolderDto, @Res() response: Response) {
		return this.foldersService.deleteFolder(folderDto, response);
	}

	@Post('delete-with-charts')
	deleteFolderWithCharts(@Body() folderDto: FolderDto, @Res() response: Response) {
		return this.foldersService.deleteFolderWithCharts(folderDto, response);
	}

}
