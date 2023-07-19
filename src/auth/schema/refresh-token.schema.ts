import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'refreshtokens',
})
export class RefreshToken {
  @Prop()
  _id: ObjectId;

  @Prop({
    required: true,
    unique: true,
    ref: 'User',
  })
  user: ObjectId;

  @Prop({
    required: true,
  })
  token: string;
}

export type RefreshTokenDocument = RefreshToken & Document;

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
