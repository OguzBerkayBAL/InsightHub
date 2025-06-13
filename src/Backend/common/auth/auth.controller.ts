import { Body, Controller, Get, Post, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from 'common/auth/dto/login.dto';
import { SignUpDto } from 'common/auth/dto/signup.dto';
import { Public } from 'public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @ApiOperation({ summary: 'Sign up a new user' }) // Swagger için özet açıklaması
  @ApiBody({ type: SignUpDto }) // Swagger body açıklaması
  @ApiResponse({ status: 201, description: 'User signed up successfully' })
  @ApiResponse({ status: 400, description: 'Bad request or Email already exists' })
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<any> {
    const result = await this.authService.signUp(signUpDto);

    // Başarısız işlemde HTTP exception fırlat
    if (!result.success) {
      console.log(`Signup error: ${result.message}`);
      throw new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: result.message,
        error: 'Bad Request'
      }, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Public()
  @ApiOperation({ summary: 'Login a user' }) // Swagger için özet açıklaması
  @ApiBody({ type: Login }) // Swagger body açıklaması
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @Post('/login')
  login(@Body() loginDto: Login) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {

  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    // Kullanıcı verileri bu rotada yakalanır
    return {
      message: 'Google Auth başarılı!',
      user: req.user,  // Bu kısımda doğrulanan kullanıcı bilgileri yer alır
    };
  }


}
