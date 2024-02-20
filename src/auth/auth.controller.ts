import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Response,
  Session,
  UseGuards,
} from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

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
  @UseGuards(AuthGuard('local'))
  @Post('signin')
  signin(@Request() req, @Session() session: Record<string, any>) {
    req.session.userId = req.user.id;
    return req.user;
  }

  @Post('logout')
  async logout(
    @Request() req,
    @Response() res,
    @Session() session: Record<string, any>,
  ) {
    session.userId = null;
    req.logout(function (err) {
      if (err) {
        return err;
      }
      res.status(200).send({ message: 'Déconnexion réussie' });
    });
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
