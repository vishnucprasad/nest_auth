import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload, accessTokenConfig } from 'src/config';
import { UserRepository } from '../repository';
import { ObjectId } from 'mongodb';
import { FilterQuery } from 'mongoose';
import { User } from '../schema';
import { AuthDto } from '../dto';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: accessTokenConfig().secret,
    });
  }

  async validate(payload: Payload): Promise<AuthDto> {
    return new AuthDto(
      (await this.userRepository.findOne({
        _id: new ObjectId(payload.sub),
      } as FilterQuery<User>)) as Object,
    );
  }
}
