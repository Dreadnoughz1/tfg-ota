import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findByUsername: jest.Mock };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    usersService = {
      findByUsername: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('mocked_jwt_token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('debe autenticar con éxito y devolver un access_token con credenciales correctas', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    usersService.findByUsername.mockResolvedValue({
      id: 1,
      username: 'admin',
      password: hashedPassword,
    });

    const result = await service.login('admin', 'password123');
    expect(result).toEqual({ access_token: 'mocked_jwt_token' });
    expect(jwtService.sign).toHaveBeenCalledWith({ sub: 1, username: 'admin' });
  });

  it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
    usersService.findByUsername.mockResolvedValue(null);

    await expect(service.login('desconocido', 'password')).rejects.toThrow(
      new UnauthorizedException('El usuario no existe'),
    );
  });

  it('debe lanzar UnauthorizedException si la contraseña es errónea', async () => {
    const hashedPassword = await bcrypt.hash('correct_pass', 10);
    usersService.findByUsername.mockResolvedValue({
      id: 1,
      username: 'admin',
      password: hashedPassword,
    });

    await expect(service.login('admin', 'wrong_pass')).rejects.toThrow(
      new UnauthorizedException('Credenciales incorrectas'),
    );
  });
});
