import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { FolderDto } from '../folders/dto/folderDto';
import { ChartDto } from './dto/chartDto';
import { AuthGuard } from 'src/auth/auth.guard';
@UseGuards(AuthGuard)
@Controller('charts')
export class ChartsController {
  constructor(private chartsService: ChartsService) {}

  @Post('create')
  async createChart(@Body() chart: ChartDto) {
    return this.chartsService.createChart(chart);
  }

  @Post('delete')
  async deleteChart(@Body() chart: ChartDto) {
    return this.chartsService.deleteChart(chart);
  }

  @Post('update')
  async updateChart(@Body() chart: ChartDto) {
    return this.chartsService.updateChart(chart);
  }

  @Post('update-order')
  async updateOrder(
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

    return this.chartsService.updateOrder(indexOrigine, indexDestination, folderOrigineId, folderDestinationId);
  }

}
