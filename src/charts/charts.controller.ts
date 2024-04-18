import { Body, Controller, Post } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { FolderDto } from './dto/folderDto';

@Controller('charts')
export class ChartsController {
  constructor(private chartsService: ChartsService) {}

  // create a route to create a folder
  @Post('create-folder')
  async createFolder(@Body() folderDto: FolderDto) {
    return this.chartsService.createFolder(folderDto);
  }

  // route to update the folder name
  @Post('update-folder')
  async updateFolder(@Body() folderDto: FolderDto) {
    return this.chartsService.updateFolder(folderDto.id, folderDto);
  }

  // route to delete a folder
  @Post('delete-folder')
  async deleteFolder(@Body() folderDto: FolderDto) {
    return this.chartsService.deleteFolder(folderDto.id);
  }
}
