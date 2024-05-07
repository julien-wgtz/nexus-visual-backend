import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FolderDto } from './dto/folderDto';
import { Response } from 'express';

@Injectable()
export class FoldersService {

	constructor(private prismaService: PrismaService) {}

	async getAllFolders(folderDto: FolderDto, response: Response) {
		try {
			const folder = await this.prismaService.folder.findMany({
				where: {
					accountId: folderDto.accountId
				},
				include: {
					charts: {
						orderBy: {
							order: 'asc'
						}
					}
				},
				orderBy: {
					order: 'asc',
				}
			});
			return response.status(HttpStatus.OK).json(folder);
		} catch (error) {
			return error;
		}
	}

	async createFolder(folderDto: FolderDto, response: Response) {
		try {
			const folder = await this.prismaService.folder.create({
				data: {
					name: folderDto.name,
					accountId: folderDto.accountId,
					order: folderDto.order
				}
			});
			return response.status(HttpStatus.CREATED).json(folder);
		} catch (error) {
			return error;
		}
	}

	async updateFolder(folderDto: FolderDto, response: Response) {
		try {
			const folder = await this.prismaService.folder.update({
				where: {
					id: folderDto.id
				},
				data: {
					name: folderDto.name,
					order: folderDto.order
				}
			});
			return response.status(HttpStatus.OK).json(folder);
		} catch (error) {
			return error;
		}
	}

	async updateFolderOrder(indexOrigine :number ,indexDestination: number, response: Response) {
		const folders = await this.prismaService.folder.findMany({
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

		const folder = folders[indexOrigine];
		folders.splice(indexOrigine, 1);
		if (indexDestination > indexOrigine) {
			indexDestination--;
		}
		folders.splice(indexDestination, 0, folder);

		for (let i = 0; i < folders.length; i++) {
			if(folders[i].order !== i && !folders[i].isShadow) {
				folders[i].order = i;
				await this.prismaService.folder.update({
					where: {
						id: folders[i].id
					},
					data: {
						order: i
					}
				});
			}
		}
		return response.status(HttpStatus.OK).json(folders);
	}

	async deleteFolder(folderDto: FolderDto, response: Response) {
		try {
			const charts = await this.prismaService.chart.findMany({
				where: {
					folderId: folderDto.id
				},
				orderBy: {
					order: 'asc'
				}
			});

			if(charts.length > 0) {
				const shadowFolder = await this.prismaService.folder.findFirst({
					where: {
						accountId: folderDto.accountId,
						isShadow: true
					},
					include: {
						charts: true
					}
				});


			let index = shadowFolder.charts.length
			for (let i = 0; i < charts.length; i++) {
				await this.prismaService.chart.update({
					where: {
						id: charts[i].id
					},
					data: {
						folderId: shadowFolder.id,
						order: index
					}
				});
				index++;
			}
		}

			const folderDelete = await this.prismaService.folder.delete({
				where: {
					id: folderDto.id
				}
			});

			const allFolders = await this.prismaService.folder.findMany({
				where: {
					accountId: folderDto.accountId
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

			for (let i = 0; i < allFolders.length; i++) {
				if(allFolders[i].order !== i && !allFolders[i].isShadow && allFolders[i].id !== folderDelete.id) {
					await this.prismaService.folder.update({
						where: {
							id: allFolders[i].id
						},
						data: {
							order: i
						}
					});
				}
			}

			return response.status(HttpStatus.OK).json(allFolders);
		} catch (error) {
			return error;
		}
	}

	async deleteFolderWithCharts(folderDto: FolderDto, response: Response) {
		try {

			const deleteCharts = await this.prismaService.chart.deleteMany({
				where: { folderId: folderDto.id },
			})

			const folderDelete = await this.prismaService.folder.delete({
				where: {
					id: folderDto.id
				}
			});

			const allFolders = await this.prismaService.folder.findMany({
				where: {
					accountId: folderDto.accountId
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

			for (let i = 0; i < allFolders.length; i++) {
				if(allFolders[i].order !== i && !allFolders[i].isShadow && allFolders[i].id !== folderDelete.id) {
					await this.prismaService.folder.update({
						where: {
							id: allFolders[i].id
						},
						data: {
							order: i
						}
					});
				}
			}

			return response.status(HttpStatus.OK).json(allFolders);
		} catch (error) {
			console.log(error)
			return error;
		}
	}
}
