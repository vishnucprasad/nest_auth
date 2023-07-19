import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto, RefreshTokenDto, RegisterDto } from './dto';
import { AccessTokenGuard, RefreshTokenGuard } from './guard';
import { SerializeUser } from './decorator';
import { User } from './schema';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  getAuth(@SerializeUser() user: AuthDto): AuthDto {
    return user;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshToken(@SerializeUser() user: User, @Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(user, dto);
  }
}
