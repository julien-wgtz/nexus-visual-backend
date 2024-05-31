import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findCurrentAccountByUserId(userId: number) {
    return this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        currentAccount: true,
      },
    });
  }

  async getNotionTokenFromFolderId(folderId: number) {
    const folder = await this.prismaService.folder.findFirst({
      where: {
        id: folderId,
      },
    });

    return this.prismaService.account.findFirst({
      where: {
        id: folder.accountId,
      },
      select: {
        notionToken: true,
      },
    });
  }

}
