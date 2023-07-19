import { Exclude, Expose, Transform } from 'class-transformer';

export class AuthDto {
  @Expose()
  @Transform((params) => params.obj._id.toString())
  readonly _id: string;

  readonly name: string;
  readonly email: string;

  @Exclude()
  readonly password: string;

  constructor(partial: Partial<AuthDto>) {
    Object.assign(this, partial);
  }
}
