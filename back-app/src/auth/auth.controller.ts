import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
  ): Promise<{ userId: string }> {
    const userId = this.authService.validate(dto.username, dto.password);

    await new Promise<void>((resolve, reject) => {
      req.session.regenerate((err) => (err ? reject(err) : resolve()));
    });

    req.session.userId = userId;
    req.session.createdAt = new Date().toISOString();

    return { userId };
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ isLogout: boolean }> {
    res.clearCookie(this.config.getOrThrow<string>('COOKIE_NAME'));
    res.clearCookie(this.config.getOrThrow<string>('SESSION_COOKIE_NAME'));

    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => (err ? reject(err) : resolve()));
    });

    return { isLogout: true };
  }
}
