import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Login } from 'common/auth/dto/login.dto';
import { UserService } from 'modules/user/user.service';
import { SignUpDto } from 'common/auth/dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from 'modules/user/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }
  async signUp(signUpDto: SignUpDto): Promise<any> {
    const { name, email, password } = signUpDto;

    // Case-insensitive email check using query builder
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();

    console.log(`Checking email ${email}, found user: ${existingUser ? 'YES' : 'NO'}`);

    if (existingUser) {
      console.log(`Signup rejected: Email ${email} already exists`);
      return {
        success: false,
        message: 'Email already exists'
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    const token = this.jwtService.sign({ id: user.id });
    console.log(token);

    if (token) {
      return { success: true, user }; // JSON formatında dönüyoruz
    } else {
      return { success: false, message: 'Token generation failed' }; // Hata durumunda JSON formatında dönüyoruz
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Login) {
    const userEntity = await this.userService.findOne({
      where: { email: user.email },
    });
    console.log(userEntity);
    if (!userEntity) {
      return { success: false, message: 'User not found' };
    }

    const passwordValid = await bcrypt.compare(
      user.password,
      userEntity.password,
    );
    if (!passwordValid) {
      return { success: false, message: 'Invalid password' };
    }

    const token = this.jwtService.sign({
      id: userEntity.id,
      role: userEntity.role,
    });
    userEntity.token = token;
    await this.userRepository.save(userEntity);
    console.log(token)
    return {
      success: true,
      user: {
        id: userEntity.id,
        name: userEntity.name,
        email: userEntity.email,
        role: userEntity.role,
        token: userEntity.token,
      },
      // Token cevaba eklendi
    };
  }
}
