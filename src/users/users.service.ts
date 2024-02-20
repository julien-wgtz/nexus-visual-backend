import { Injectable } from '@nestjs/common';
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
}
