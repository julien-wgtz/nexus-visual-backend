import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { FolderDto } from '../folders/dto/folderDto';
import { ChartDto } from './dto/chartDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { NotionService } from 'src/notion/notion.service';
import { request } from 'http';
import { FoldersService } from 'src/folders/folders.service';
import { response } from 'express';
import { cpSync } from 'fs';
@UseGuards(AuthGuard)
@Controller('charts')
export class ChartsController {
  constructor(
    private chartsService: ChartsService,
    private folderService: FoldersService,
    private notionService: NotionService
   ) {}

  @Post('create')
  async createChart(@Req() request, @Res() response, @Body() chart: ChartDto){
    try {
      await this.folderService.authorizeFolder(request.user.account.id, chart.folderId)
      const newChart = await this.chartsService.createChart(chart, request.user.account.id);
      return response.status(HttpStatus.CREATED).json(newChart);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: error.message})
    }
  }

  @Post('delete')
  async deleteChart(@Req() request, @Res() response, @Body() chart: ChartDto) {
    try {
      await this.chartsService.authorizeChart(request.user.account.id, chart.id)
      const chartDeleted = await this.chartsService.deleteChart(chart);
      return response.status(HttpStatus.OK).json(chartDeleted);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: error.message})
    }
  }

  @Post('update')
  async updateChart(@Req() request, @Res() response, @Body() chart: ChartDto) {
    try {
      await this.chartsService.authorizeChart(request.user.account.id, chart.id)
      const chartUpdated = await this.chartsService.updateChart(chart);
      return response.status(HttpStatus.OK).json(chartUpdated);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: error.message})
    }
  }

  @Post('update-order')
  async updateOrder(
    @Res() response,
    @Req() request,
    @Body() {
      indexOrigine,
      indexDestination,
      folderOrigineId,
      folderDestinationId
    } : {
      indexOrigine: number,
      indexDestination: number,
      folderOrigineId: number,
      folderDestinationId: number
    }) {

    try { 
      await this.folderService.authorizeFolder(request.user.account.id, folderOrigineId)
      await this.folderService.authorizeFolder(request.user.account.id, folderDestinationId)
      const folderUpdate = await this.chartsService.updateOrder(request.user.account.id,indexOrigine, indexDestination, folderOrigineId, folderDestinationId);
      return response.status(HttpStatus.OK).json(folderUpdate);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: error.message})
    }
  }

  @Post('get-data-from-chart')
	async getDataFromChart(@Req() request, @Res() response, @Body() body: {chartId: number}){

    if(!request.user.account.notionToken) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: "No notion token found for this account"})
    }

    try {
      await this.chartsService.authorizeChart(request.user.account.id, body.chartId)
      const databaseId = await this.chartsService.getDatabaseId(body.chartId);
      const result = await this.notionService.getPagesFromDatabase(databaseId, request.user.account.notionToken);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: error.message})
    }

	}

  @Post('get-config-from-chart')
	async getConfigFromChart(@Req() request, @Res() response, @Body() body: {chartId: number, config: any}){

    if(!request.user.account.notionToken) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: "No notion token found for this account"})
    }
    try {
      await this.chartsService.authorizeChart(request.user.account.id, body.chartId)
      const result = await this.chartsService.getConfigChart(body.chartId);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: error.message})
    }
	}

  @Post('update-config-from-chart')
	async updateConfigFromChart(@Req() request, @Res() response, @Body() body: {chartId: number, config: any}){

    if(!request.user.account.notionToken) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: "No notion token found for this account"})
    }
    try {
      await this.chartsService.authorizeChart(request.user.account.id, body.chartId)
      const result = await this.chartsService.updateConfigChart(body.chartId, body.config);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: error.message})
    }
	}

}
