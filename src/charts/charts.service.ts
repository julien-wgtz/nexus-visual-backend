import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChartDto } from './dto/chartDto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class ChartsService {
  constructor(private prisma: PrismaService) {}

    async createChart(chart: ChartDto, accountId: number) {
      
      const numberChart = await this.prisma.folder.findFirst({
        where: {
          id: chart.folderId,
          accountId: accountId
        },
        include: {
          _count: {
            select: { charts: true },
          },
        },
      })

      const newChart = await this.prisma.chart.create({
        data: {
          databaseId: chart.databaseId,
          folderId: chart.folderId,
          title: chart.title,
          currentChartType: chart.type,
          order: numberChart._count.charts,
        }
    })
    
    const generateShareToken = async (data) => {
      const jsonString = JSON.stringify(data);
      const salt = await bcrypt.genSalt(10); // Génère un sel avec un facteur de coût de 10
      const hash = await bcrypt.hash(jsonString, salt);
      return hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '').replace(/\./g, '_');
    };

    // do share token for the chart this taken some data of the chart and the account id crypt it and return it, sharetoken is a string and a value in the chart table
    const shareToken = await this.prisma.chart.update({
      where: { id: newChart.id },
      data: {
        shareToken: await generateShareToken({
          chartId: newChart.id,
          accountId: accountId,
          createdAt: chart.createdAt,
          updateAt: chart.updateAt,
          title: newChart.title,
          databaseId: newChart.databaseId,
          currentChartType: newChart.currentChartType,
          order: newChart.order,
        }),
      },
    });

     return shareToken;
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

  async updateConfigChart(chartId: number, config: any) {
    return this.prisma.chart.update({
      where: {id: chartId},
      data: {
        config
      }
    })
  }

  async getConfigChart(chartId: number) {
    return this.prisma.chart.findFirst({
      select: {
        config: true
      },
      where: {
        id: chartId
      }
    })
  } 

  async updateOrder(accountId: number, indexOrigine: number, indexDestination: number, folderOrigineId: number, folderDestinationId: number) {

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
      where: {
        accountId: accountId
      },
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

  async getDatabaseId(chartId: number) {
    const chart = await this.prisma.chart.findUnique({
      where: { id: chartId },
    });
    return chart.databaseId;
  }

  async authorizeChart(accountId: number, chartId: number) {
    const chart = await this.prisma.chart.findUnique({
      where: { id: chartId },
      include: {
        folder: true
      }
    });

    if(!chart) {
      throw new Error("Chart not found")
    }

    if(chart.folder.accountId !== accountId) {
      throw new Error("Unauthorized")
    }
    return true;
  }

  async getChartFromToken(token: string) {
    const chart = await this.prisma.chart.findFirst({
      where: {
        shareToken: token
      }
    });

    if(!chart) {
      throw new Error("Chart not found")
    }

    return chart;
  }

  async regenerateToken(chartId: number, accountId: number) {
    const chart = await this.prisma.chart.findUnique({
      where: { id: chartId }
    });

    const generateShareToken = async (data) => {
      const jsonString = JSON.stringify(data);
      const salt = await bcrypt.genSalt(10); // Génère un sel avec un facteur de coût de 10
      const hash = await bcrypt.hash(jsonString, salt);
      return hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '').replace(/\./g, '_');
    };

    const shareToken = await this.prisma.chart.update({
      where: { id: chart.id },
      data: {
        shareToken: await generateShareToken({
          chartId: chart.id,
          accountId: accountId,
          createdAt: chart.createdAt,
          updateAt: new Date(),
          title: chart.title,
          databaseId: chart.databaseId,
          currentChartType: chart.currentChartType,
          order: chart.order,
        }),
      },
    });

    return shareToken;
  }

}
