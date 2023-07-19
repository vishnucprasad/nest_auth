import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload, accessTokenConfig } from 'src/config';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-jwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: accessTokenConfig().secret,
    });
  }

  async validate(payload: Payload) {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
