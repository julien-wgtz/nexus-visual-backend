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
}
