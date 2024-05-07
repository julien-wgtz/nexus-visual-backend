import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAccountByUserId(userId: number) {
    return this.prismaService.account.findFirst({
      where: {
        ownerId: userId,
      },
    });
  }

  async getNotionToken(accountId: number) {
    return this.prismaService.account.findUnique({
      where: {
        ownerId: accountId,
      },
      select: {
        notionToken: true,
      },
    });
  }
}
