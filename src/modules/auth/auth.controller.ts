import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from '../../guards/google-oauth.guard';
import { Request } from 'express';
import { AuthUserDto } from './dto/auth-user.dto';
import { TokenDto } from './dto/token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  @UseGuards(GoogleOauthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Authorize user with OAuth2',
  })
  login(): void {
    return;
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'OAuth google callback',
  })
  googleAuthCallback(@Req() req: Request): Promise<TokenDto> {
    return this.authService.validate(req.user as AuthUserDto);
  }
}
