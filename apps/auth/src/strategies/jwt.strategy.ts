import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          console.error('__cookie__', request?.cookies?.Authentication);
          console.error('__secret__', configService.get('JWT_SECRET'));
          return (
            request?.cookies?.Authentication ||
            request?.Authentication ||
            request?.headers.Authentication
          );
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ userId }: TokenPayload) {
    console.error('__userId__', userId);
    return this.usersService.get({ _id: userId });
  }
}
