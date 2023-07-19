import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop()
  _id: ObjectId;

  @Prop({
    required: true,
    trim: true,
    minlength: 3,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
