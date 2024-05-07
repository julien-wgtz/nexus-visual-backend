import { Module } from '@nestjs/common';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';

@Module({
  providers: [FoldersService],
  controllers: [FoldersController]
})
export class FoldersModule {}
