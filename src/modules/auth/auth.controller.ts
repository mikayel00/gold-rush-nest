import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from '../../guards/google-oauth.guard';
import { Request, Response } from 'express';
import { AuthUserDto } from './dto/auth-user.dto';

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
  async googleAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const tokenDto = await this.authService.validate(req.user as AuthUserDto);

    const ONE_DAY = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    res
      .cookie('access_token', tokenDto.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: ONE_DAY,
      })
      .send({ status: 'ok' });
  }
}
