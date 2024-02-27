import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from './users.decorator';
import { UsersService } from './users.service';
import { NotionMainPageDto } from './dto/notionPageDto';
import { filterUserClean } from 'src/utils/filter/user.filter';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('addNotionMainPage')
  async addNotionMainPage(
    @Body() body: NotionMainPageDto,
    @GetUser() userId: number,
  ) {
    const { notionPageId } = body;
    const user = await this.usersService.addNotionMainPageToUser(
      userId,
      notionPageId,
    );
    return filterUserClean(user);
  }
}
