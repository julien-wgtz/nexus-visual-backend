import { Injectable, NotImplementedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async confirmUser(token: string): Promise<boolean> {
    const tokenRecord = await this.prismaService.confirmationToken.findUnique({
      where: { token },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return false;
    }

    await this.prismaService.user.update({
      where: { id: tokenRecord.userId },
      data: { confirmed: true },
    });

    await this.prismaService.confirmationToken.delete({ where: { token } });

    return true;
  }

  async list() {
    return await this.prismaService.user.findMany({ select: { email: true } });
  }

  // async addNotionMainPageToUser(
  //   userId: number,
  //   notionPageId: string,
  // ): Promise<User> {
  //   const user = await this.prismaService.user.update({
  //     where: { id: userId },
  //     data: { notionMainPageId: notionPageId },
  //   });
  //   return user;
  // }

  // Récupérez l'utilisateur à partir de la base de données
  async findOne(id: number): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }
}
