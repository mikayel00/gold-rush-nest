import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get appConfig() {
    return {
      port: this.configService.get<string>('PORT'),
    };
  }

  get jwtConfig() {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
    };
  }

  get database() {
    return {
      url: this.configService.get<string>('DATABASE_URL'),
    };
  }

  get oAuth() {
    return {
      clientID: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: this.configService.get<string>('GOOGLE_CALLBACK_URL'),
    };
  }
}
