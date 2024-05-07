import {
  ConflictException,
  Injectable,
  Request,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';
import { SignupDto } from './dto/signupDto';
import { SigninDto } from './dto/signinDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { filterUserClean } from 'src/utils/filter/user.filter';
import { stat } from 'fs';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    private readonly accountService: AccountsService,
  ) {}
  async signup(signupDto: SignupDto, session: Record<string, any>,@Request() req) {
    const { email, password } = signupDto;
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (userExist) {
      throw new ConflictException('User already exists');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: { email, password: hashPassword },
    });

    const account = await this.prismaService.account.create({
      data: {
        owner: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    const shadowFolder = await this.prismaService.folder.create({
      data: {
        isShadow: true,
        order: 10000,
        account: {
          connect: {
            id: account.id,
          },
        },
      },
    });

    req.user = user;
    req.session.save();
    await new Promise<void>((resolve, reject) => {
      req.login(req.user, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    const confirmationToken = randomBytes(32).toString('hex');
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // Le token expire dans 1 jour

    await this.prismaService.confirmationToken.create({
      data: {
        userId: user.id,
        token: confirmationToken,
        expiresAt: expirationDate,
      },
    });

    this.mailerService.sendEmail(
      user.email,
      'Welcome to Nexus',
      'ConfirmationSignin',
      {
        confirmationToken,
      },
    );

    return { status: 201, data: { user, account } };
  }

  async signin(@Request() req, @Session() session: Record<string, any>) {
    req.session.save();
    try {
      await new Promise<void>((resolve, reject) => {
        req.login(req.user, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      const account = await this.accountService.findAccountByUserId(
        req.user.id,
      );

      return {
        status: 200,
        data: { user: filterUserClean(req.user), account },
      };
    } catch (err) {
      return {
        status: 500,
        message: 'Une erreur est survenue lors de la connexion',
      };
    }
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
