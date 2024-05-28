import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private usersService: UsersService) {
    super();
  }

  async serializeUser(user: any, done: Function) {
    const data = {
      id: user.id,
    }
    done(null,data);
  }

  async deserializeUser(data: any, done: Function) {
    const user = await this.usersService.findOne(data.id);
    const res = {
      id: user.id,
      account: {
        id: user.currentAccount.id,
        status: user.currentAccount.status,
        notionToken: user.currentAccount.notionToken,
      },
    }
    done(null, res);
  }
}
