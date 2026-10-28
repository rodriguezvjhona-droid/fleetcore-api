import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { LoginDto } from './Dto/login.dto.js';
import { RegisterDto } from './Dto/register.dto.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
) {}

    async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
    accessToken: this.jwtService.sign(payload),
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
    throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await argon2.verify(
    user.passwordHash,
    loginDto.password,
    );
    if (!isPasswordValid) {
    throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
    accessToken: this.jwtService.sign(payload),
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    },
    };
    }
}
