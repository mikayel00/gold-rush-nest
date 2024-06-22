import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService,
  ) {}

  async createToken(user: UserDocument): Promise<string> {
    const payload = {
      email: user.email,
      id: user.id,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.jwtConfig.secret,
    });
  }
}
