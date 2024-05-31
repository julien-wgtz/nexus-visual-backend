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
import { AccountsService } from 'src/accounts/accounts.service';

@Controller('charts')
export class ChartsController {
  constructor(
    private chartsService: ChartsService,
    private folderService: FoldersService,
    private notionService: NotionService,
    private accountService: AccountsService
   ) {}
   @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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

  @Post('get-chart-from-token')
  async getChartFromToken(@Req() request, @Res() response, @Body() body: {shareToken: string}) {
    try {
      const chart = await this.chartsService.getChartFromToken(body.shareToken);
      return response.status(HttpStatus.OK).json(chart);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: error.message})
    }
  }

  @Post('get-data-from-token')
  async getDataFromToken(@Req() request, @Res() response, @Body() body: {shareToken: string}) {
    try {
      const chart = await this.chartsService.getChartFromToken(body.shareToken);
      const databaseId = await this.chartsService.getDatabaseId(chart.id);
      const {notionToken} = await this.accountService.getNotionTokenFromFolderId(chart.folderId);
      const result = await this.notionService.getPagesFromDatabase(databaseId, notionToken);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: error.message})
    }
  }

  @Post('regenerate-token')
  async regenerateToken(@Req() request, @Res() response, @Body() body: {chartId: number}) {
    try {
      await this.chartsService.authorizeChart(request.user.account.id, body.chartId)
      const chart = await this.chartsService.regenerateToken(body.chartId, request.user.account.id);
      return response.status(HttpStatus.OK).json(chart);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({message: error.message})
    }
  }

}
