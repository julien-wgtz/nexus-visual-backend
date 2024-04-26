import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FolderDto } from './dto/folderDto';

@Injectable()
export class ChartsService {
  constructor(private prisma: PrismaService) {}

  // Récupérer tous les folders d'un account id
  getFolders(accountId: number) {
    return this.prisma.folder.findMany({
      where: { accountId },
    });
  }

  createFolder(folder: FolderDto) {
    return this.prisma.folder.create({
      data: {
        accountId: folder.accountId,
        name: folder.name,
        order: folder.order,
      },
    });
  }

  // une function pour modifier le nom du folder
  updateFolder(id: number, folder: FolderDto) {
    return this.prisma.folder.update({
      where: { id },
      data: {
        name: folder.name,
      },
    });
  }

  changeOrder(id: number, order: number) {
    return this.prisma.folder.update({
      where: { id },
      data: {
        order,
      },
    });
  }

  //function to rename a folder name
  renameFolder(id: number, folder: FolderDto) {
    return this.prisma.folder.update({
      where: { id },
      data: {
        name: folder.name,
      },
    });
  }

  // une function pour supprimer un folder
  deleteFolder(id: number) {
    return this.prisma.folder.delete({
      where: { id },
    });
  }
}
