import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FolderDto } from './dto/folderDto';
import { Response } from 'express';

@Injectable()
export class FoldersService {

	constructor(private prismaService: PrismaService) {}

	async getAllFolders(folderDto: FolderDto, accountId: number) {
		try {
			const folder = await this.prismaService.folder.findMany({
				where: {
					accountId: accountId
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
			return folder;
		} catch (error) {
			throw new Error(error);
		}
	}

	async createFolder(folderDto: FolderDto, accountId: number) {
		try {
			const folder = await this.prismaService.folder.create({
				data: {
					name: folderDto.name,
					accountId: accountId,
					order: folderDto.order
				}
			});
			return folder;
		} catch (error) {
			return error;
		}
	}

	async updateFolder(folderDto: FolderDto, response: Response, accountId: number) {
		try {
			const folder = await this.prismaService.folder.update({
				where: {
					id: folderDto.id,
					accountId: accountId
				},
				data: {
					name: folderDto.name,
					order: folderDto.order
				},
				include: {
					charts: {
						orderBy: {
							order: 'asc'
						}
					}
				}
			});

			if(folder === null) {
				return response.status(HttpStatus.NOT_FOUND).json({message: 'Folder not found'});
			}
			return response.status(HttpStatus.OK).json(folder);
		} catch (error) {
			return error;
		}
	}

	async updateFolderOrder(indexOrigine :number ,indexDestination: number, accountId: number) {
		const folders = await this.prismaService.folder.findMany({
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

		const folder = folders[indexOrigine];

		if(folder === null) {
			throw new Error('Folder not found');
		}

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
		return folders;
	}

	async deleteFolder(folderDto: FolderDto, accountId: number) {
		try {

			const folder = await this.prismaService.folder.findFirst({
				where: {
					id: folderDto.id,
					accountId: accountId
				}
			});

			if(folder === null) {
				throw new Error('Folder not found');
			}

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

			return allFolders;
		} catch (error) {
			return error;
		}
	}

	async deleteFolderWithCharts(folderDto: FolderDto, response: Response, accountId: number) {
		try {

			const folder = await this.prismaService.folder.findFirst({
				where: {
					id: folderDto.id,
					accountId: accountId
				}
			});

			if(folder === null) {
				return response.status(HttpStatus.NOT_FOUND).json({message: 'Folder not found'});
			}

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

	async authorizeFolder(accountId: number, folderId: number) {
		const folder = await this.prismaService.folder.findFirst({
			where: {
				id: folderId,
			}
		});

		if(folder.accountId !== accountId) {
			throw new Error('Unauthorized');
		}
	}
}
