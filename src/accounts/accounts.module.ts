import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  exports: [AccountsService],
  providers: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
