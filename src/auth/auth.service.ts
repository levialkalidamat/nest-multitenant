import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.Schema';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Post } from 'src/schemas/Post.Schema';

@Injectable()
export class AuthService {
  constructor(
    //@InjectModel(User.name) private userModel: Model<User>,
    //@InjectModel(Post.name) private postModel: Model<Post>,
    @Inject('USER_MODEL') private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  //   Hash password
  async hashPassword(password: string, salt: number) {
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  async register(registerDto: RegisterDto) {
    const userFound = await this.userModel.findOne({
      email: registerDto.email,
    });
    if (userFound) {
      throw new ConflictException('User already exists');
    }

    // Hasher le mot de passe
    const saltOrRound = 10;
    const hashedPassword = await this.hashPassword(
      registerDto.password,
      saltOrRound,
    ); //bcrypt.hash(password, saltOrRound);

    const createdUser = await this.userModel.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });

    return {
      data: 'User created successfully',
      createdUser,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const userFound = await this.userModel.findOne({ email: email });

    if (!userFound) {
      throw new NotFoundException('Email or Password incorrect');
    }

    const matchPassword = await bcrypt.compare(password, userFound.password);
    if (!matchPassword) {
      throw new NotFoundException('Email or Password incorrect');
    }

    const payload = {
      sub: userFound._id.toString(),
      email: userFound.email,
      //role: userFound.role,
    };

    // Récuperer le Access token et le refresh token
    const tokens = await this.getTokens(payload);

    // Stocker le refresh token dans la BD
    const salt = 10;

    const userInfos = {
      id: userFound._id,
      name: userFound.name,
      email: userFound.email,
      //imageProfile: userFound.imageProfile,
      //city: userFound.city,
      //country: userFound.country,
      //role: userFound.role,
      tokens: tokens,
    };

    return { data: userInfos /*tokens, user: userInfos*/ };
  }

  /* Get tokens */
  async getTokens(payload: { sub: string; email: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '60m', //expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
