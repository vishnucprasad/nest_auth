import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload, refreshTokenConfig } from 'src/config';
import { UserRepository } from '../repository';
import { ObjectId } from 'mongodb';
import { FilterQuery } from 'mongoose';
import { User } from '../schema';
import { AuthDto } from '../dto';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: refreshTokenConfig().secret,
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
