import { ConflictException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(signupDto: SignupDto) {
    const { email, password } = signupDto;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new ConflictException('User already exists');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await this.prismaService.user.create({
      data: { email, password: hashPassword },
    });

    // TODO Connect with session ?

    // TODO SEND a email

    return { data: 'User is successfully create' };
  }
}
