import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FolderDto } from '../folders/dto/folderDto';
import { Chart } from '@prisma/client';
import { ChartDto } from './dto/chartDto';

@Injectable()
export class ChartsService {
  constructor(private prisma: PrismaService) {}

    async createChart(chart: ChartDto ) {
      
      const numberChart = await this.prisma.folder.findFirst({
        where: {
          id: chart.folderId
        },
        include: {
          _count: {
            select: { charts: true },
          },
        },
      })

     return this.prisma.chart.create({
        data: {
          databaseId: chart.databaseId,
          folderId: chart.folderId,
          title: chart.title,
          currentChartType: chart.type,
          order: numberChart._count.charts,
        }
    })
  }

  async deleteChart(chart: ChartDto) {
    const chartToDelete = await this.prisma.chart.delete({
      where: { id: chart.id },
    });

    const folder = await this.prisma.folder.findUnique({
      where: { id: chartToDelete.folderId },
      include: {
        charts: true,
      },
    });

    let indexOrder = chartToDelete.order;

    for(let i = indexOrder; i < folder.charts.length; i++) {
        if(folder.charts[i].id !== chart.id) {
          await this.prisma.chart.update({
            where: { id: folder.charts[i].id },
            data: {
              order: i,
            },
          });
        }
    }

    return folder;
  }

  updateChart(chart: ChartDto) {
    const chartUpdated = this.prisma.chart.update({
      where: { id: chart.id },
      data: {
        title: chart.title,
        currentChartType: chart.type,
        databaseId: chart.databaseId,
        order: chart.order,
      },
    });

    return chartUpdated;
  }

  async updateOrder(indexOrigine: number, indexDestination: number, folderOrigineId: number, folderDestinationId: number) {

    const folderOrgine = await this.prisma.folder.findUnique({
      where: { id: folderOrigineId },
      include: {
        charts: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    const chartToMove = folderOrgine.charts[indexOrigine];

if(folderOrigineId != folderDestinationId) {
    const folderDestination = await this.prisma.folder.findUnique({
      where: { id: folderDestinationId },
      include: {
        charts: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    
    folderOrgine.charts.splice(indexOrigine, 1);
    folderDestination.charts.splice(indexDestination, 0, chartToMove);
    
      await this.prisma.chart.update({
        where: { id: chartToMove.id },
        data: {
          order: indexDestination,
          folderId: folderDestinationId,
        },
      });


      for(let i = 0; i < folderDestination.charts.length; i++) {
        folderDestination.charts[i].order = i;
        if(folderDestination.charts[i].id !== chartToMove.id || folderOrigineId !== folderDestinationId) {
          await this.prisma.chart.update({
            where: { id: folderDestination.charts[i].id },
            data: {
              order: i,
            },
          });
        }
      }
    } else {
      folderOrgine.charts.splice(indexOrigine, 1);
      folderOrgine.charts.splice(indexDestination > indexOrigine ? indexDestination - 1 : indexDestination, 0, chartToMove);
    }

    for(let i = 0; i < folderOrgine.charts.length; i++) {
      folderOrgine.charts[i].order = i;
      await this.prisma.chart.update({
        where: { id: folderOrgine.charts[i].id },
        data: {
          order: i,
        },
      });
    }


    const folders = await this.prisma.folder.findMany({
      orderBy: {
        order: 'asc'
      },
      include: {
        charts: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
   return folders;
  }

}
