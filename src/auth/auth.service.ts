import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenRepository, UserRepository } from './repository';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto';
import { ObjectId } from 'mongodb';
import { FilterQuery } from 'mongoose';
import {
  JwtConfig,
  Payload,
  accessTokenConfig,
  refreshTokenConfig,
} from 'src/config';
import * as argon from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { RefreshToken, User } from './schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthDto> {
    return await this.userRepository.create({
      _id: new ObjectId(),
      ...dto,
    });
  }

  async login(dto: LoginDto): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const user = await this.userRepository.findOne({
      email: dto.email,
    });

    if (!user) throw new NotFoundException('User not found');

    const checkPassword = await argon.verify(user.password, dto.password);

    if (!checkPassword) throw new UnauthorizedException('Invalid password');

    const payload: Payload = {
      sub: user._id,
      email: user.email,
    };

    const accessToken = this.generateJWT(payload, accessTokenConfig());
    const refreshToken = this.generateJWT(payload, refreshTokenConfig());

    const doc = await this.refreshTokenRepository.findOne({
      user: user._id,
    } as FilterQuery<RefreshToken>);

    if (doc) {
      await this.refreshTokenRepository.findOneAndUpdate(
        { _id: doc._id } as FilterQuery<RefreshToken>,
        { token: refreshToken } as Partial<RefreshToken>,
      );

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    }

    await this.refreshTokenRepository.create({
      _id: new ObjectId(),
      user: new ObjectId(user._id),
      token: refreshToken,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  generateJWT(payload: Payload, config: JwtConfig) {
    return this.jwtService.sign(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    });
  }

  async refreshToken(
    user: User,
    dto: RefreshTokenDto,
  ): Promise<{ access_token: string }> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      token: dto.refreshToken,
    } as FilterQuery<RefreshToken>);

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const payload: Payload = {
      sub: user._id,
      email: user.email,
    };

    const accessToken = await this.generateJWT(payload, accessTokenConfig());

    return {
      access_token: accessToken,
    };
  }
}
