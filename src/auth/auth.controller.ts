import {
  Body,
  Controller,
  Post,
  Request,
  Response,
  Session,
  UseGuards,
} from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
    session.userId = req.user.id;

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
}
