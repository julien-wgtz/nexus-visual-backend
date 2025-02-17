import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailerService } from 'src/mailer/mailer.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './sessionSerializer';
import { UsersModule } from 'src/users/users.module';
import { AccountsService } from 'src/accounts/accounts.service';

@Module({
  imports: [PassportModule.register({ session: true }), UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailerService,
    LocalStrategy,
    SessionSerializer,
    AccountsService,
  ],
})
export class AuthModule {}
