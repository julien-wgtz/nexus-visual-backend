import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Request,
  Response,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { filterUserClean } from 'src/utils/filter/user.filter';
import { log } from 'console';
import { use } from 'passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @Post('signup')
  signup(
    @Body() signupDto: SignupDto,
    @Session() session: Record<string, any>,
  ) {
    return this.authService.signup(signupDto, session);
  }

  @Post('signin')
  @UseGuards(AuthGuard('local'))
  async signin(
    @Request() req,
    @Session() session: Record<string, any>,
    @Response() res,
  ) {
    session.userId = req.user.id;
    const response = await this.authService.signin(req, session);
    return res.status(HttpStatus.OK).send(response);
  }

  @Post('logout')
  async logout(@Request() req, @Response() res) {
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: 'Erreur lors de la déconnexion' });
      }
      res.clearCookie('connect.sid');
      return res.status(HttpStatus.OK).send({ message: 'Déconnexion réussie' });
    });
  }

  @UseGuards(AuthGuard('session'))
  @Get('check')
  checkLogin(@Req() req: Request) {
    console.log(req);
    return req;
  }

  @Get('confirm')
  async confirm(@Query('token') token: string, @Response() res) {
    const confirmation = await this.usersService.confirmUser(token);
    if (confirmation) {
      return res.status(200).send({ message: 'Compte confirmé' });
    } else {
      return res.status(400).send({ message: 'Token introuvable ou expiré' });
    }
  }
}
