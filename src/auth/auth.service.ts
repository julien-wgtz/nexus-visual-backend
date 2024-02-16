import { ConflictException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
  ) {}
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

    const createdUser = await this.prismaService.user.create({
      data: { email, password: hashPassword },
    });

    // TODO Connect with session ?

    // TODO Add confirmation in this mail
    this.mailerService.sendEmail(createdUser.email, 'Welcome to Nexus');

    return { data: 'User is successfully create' };
  }
}
