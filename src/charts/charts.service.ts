import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FolderDto } from './dto/folderDto';

@Injectable()
export class ChartsService {
  constructor(private prisma: PrismaService) {}

  createFolder(folder: FolderDto) {
    return this.prisma.folder.create({
      data: {
        accountId: folder.accountId,
        name: folder.name,
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

  // une function pour supprimer un folder
  deleteFolder(id: number) {
    return this.prisma.folder.delete({
      where: { id },
    });
  }
}
