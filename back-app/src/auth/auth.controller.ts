import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public, SignInService } from '@nestjs/authentication';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly signInService: SignInService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto): Promise<{ userId: string }> {
    const userId = this.authService.validate(dto.username, dto.password);
    await this.signInService.signIn(userId, { method: 'password' });
    return { userId };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(): Promise<{ isLogout: boolean }> {
    await this.signInService.signOut();
    return { isLogout: true };
  }
}
