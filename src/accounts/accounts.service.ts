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

}
