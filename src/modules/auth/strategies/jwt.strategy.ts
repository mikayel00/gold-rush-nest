import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { Request } from 'express';
import { UserService } from '../../user/user.service';
import { UserDto } from '../../user/dto/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      secretOrKey: configService.jwtConfig.secret,
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }

  async validate(data: { email: string }): Promise<UserDto> {
    const user = await this.userService.getOneByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
