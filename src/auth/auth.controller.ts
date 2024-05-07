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
    @Request() req
  ) {
    return this.authService.signup(signupDto, session, req);
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

  @Post('check')
  check(@Request() req, @Response() res, @Session() session: Record<string, any>) {
    if (req.user) {
      return {
        user: filterUserClean(req.user),
      };
    } else {
      req.session.destroy((err) => {
        if (err) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: 'Utilisateur non connecté' });
        }
        res.clearCookie('connect.sid');
        return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Utilisateur non connecté' });
      });
    }
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