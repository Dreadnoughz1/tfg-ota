import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user || user === null) {
      throw new UnauthorizedException('El usuario no existe');
    }

    const isValid: boolean = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
