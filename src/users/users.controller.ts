import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from './users.decorator';
import { UsersService } from './users.service';
import { NotionMainPageDto } from './dto/notionPageDto';
import { filterUserClean } from 'src/utils/filter/user.filter';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('addNotionMainPage')
  async addNotionMainPage(
    @Body() body: NotionMainPageDto,
    @GetUser() userId: number,
  ) {
    // const { notionPageId } = body;
    // const user = await this.usersService.addNotionMainPageToUser(
    //   userId,
    //   notionPageId,
    // );
    // return filterUserClean(user);
  }

  @Post('get-user-by-id')
  @UseGuards(AuthGuard)
  async getUserById(@Response() response, @Request() req) {
    try {
      const user = await this.usersService.findOne(req.user.id);
      return response.status(HttpStatus.OK).json(user);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
