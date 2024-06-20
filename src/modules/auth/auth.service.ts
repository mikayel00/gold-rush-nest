import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { JwtTokenService } from './jwt-token.service';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly userService: UserService,
  ) {}

  async validate(user: AuthUserDto): Promise<TokenDto> {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    let registeredUser = await this.userService.getOneByEmail(user.email);

    if (!registeredUser) {
      registeredUser = await this.userService.create({
        fullName: user.name,
        ...user,
      });
    }

    const token = await this.jwtTokenService.createToken(registeredUser);

    return new TokenDto(token);
  }
}
