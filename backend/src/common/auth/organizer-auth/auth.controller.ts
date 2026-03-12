import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Response } from 'express';

import { OrganizerAuthService } from './auth.service';
import { setAuthCookie, clearAuthCookie } from './login-cookie.helper';
import { CreateOrganizerDto } from 'src/common/dto/organizer-dto/create-organizer.dto';
import { LoginDto } from 'src/common/dto/organizer-dto/login-dto/login.dto';
import { OrganizerValidationPipe } from 'src/common/pipes/organizer-validation/organizer-validation.pipe';

@Controller('auth')
export class OrganizerAuthController {
  constructor(private readonly authService: OrganizerAuthService) {}

  @Post('register')
  @UsePipes(
    OrganizerValidationPipe,
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  )
  async register(@Body() dto: CreateOrganizerDto) {
    return this.authService.register(dto as any);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    setAuthCookie(res, result.access_token);
    return { message: 'Login successful', organizer: result.organizer };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    clearAuthCookie(res);
    return { message: 'Logout successful' };
  }
}
