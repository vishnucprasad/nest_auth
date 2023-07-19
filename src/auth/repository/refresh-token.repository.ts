import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from '../schema';
import { FilterQuery, Model } from 'mongoose';
import { ForbiddenException } from '@nestjs/common';

export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
  ) {}

  async create(refreshToken: RefreshToken): Promise<void> {
    try {
      const newRefreshToken = new this.refreshTokenModel(refreshToken);
      await newRefreshToken.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ForbiddenException(
          'A refresh token already exists for this user',
        );
      }

      throw error;
    }
  }

  async findOne(
    refreshTokenFilterQuery: FilterQuery<RefreshToken>,
  ): Promise<RefreshToken> {
    return this.refreshTokenModel.findOne(
      refreshTokenFilterQuery,
      {},
      { lean: true },
    );
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<RefreshToken>,
    user: Partial<RefreshToken>,
  ): Promise<void> {
    return this.refreshTokenModel.findOneAndUpdate(userFilterQuery, user, {
      lean: true,
      new: true,
    });
  }
}
