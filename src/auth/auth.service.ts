import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';
import { SignupDto } from './dto/signupDto';
import { SigninDto } from './dto/sugninDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
  ) {}
  async signup(signupDto: SignupDto, session: Record<string, any>) {
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

    session.userId = createdUser.id;

    const confirmationToken = randomBytes(32).toString('hex');
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // Le token expire dans 1 jour

    await this.prismaService.confirmationToken.create({
      data: {
        userId: createdUser.id,
        token: confirmationToken,
        expiresAt: expirationDate,
      },
    });

    this.mailerService.sendEmail(createdUser.email, 'Welcome to Nexus', null, {
      confirmationToken,
    });

    return { data: 'User is successfully create' };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    } else {
      throw new UnauthorizedException('Identifiants invalides');
    }
  }
}
