import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { UsersModule } from './users/users.module';
import { AccountsService } from './accounts/accounts.service';
import { AccountsController } from './accounts/accounts.controller';
import { AccountsModule } from './accounts/accounts.module';
import { ChartsController } from './charts/charts.controller';
import { ChartsService } from './charts/charts.service';
import { ChartsModule } from './charts/charts.module';
import { NotionController } from './notion/notion.controller';
import { NotionService } from './notion/notion.service';
import { ModuleService } from './module/module.service';
import { FoldersService } from './folders/folders.service';
import { FoldersModule } from './folders/folders.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    AuthModule,
    PrismaModule,
    MailerModule,
    UsersModule,
    AccountsModule,
    ChartsModule,
    FoldersModule,
  ],
  providers: [AccountsService, ChartsService, NotionService, ModuleService, FoldersService],
  controllers: [AccountsController, ChartsController, NotionController],
})
export class AppModule {}
