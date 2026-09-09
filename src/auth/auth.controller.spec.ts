import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { login: jest.Mock };

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login debe llamar a authService.login y devolver el token', async () => {
    authService.login.mockResolvedValue({ access_token: 'xyz' });
    const result = await controller.login({ username: 'admin', password: 'password' });
    expect(authService.login).toHaveBeenCalledWith('admin', 'password');
    expect(result).toEqual({ access_token: 'xyz' });
  });
});
