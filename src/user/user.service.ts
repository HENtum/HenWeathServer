import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { LoginTap2 } from './dto/login-tap2.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  async create(dto: CreateUserDto) {
    try {
      const isEmail = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (isEmail) {
        return {
          message: 'Пользователь с такой почтой уже существует',
        };
      }
      const isUsername = await this.prisma.user.findUnique({
        where: {
          name: dto.name,
        },
      });
      if (isUsername) {
        return {
          message: 'Похоже, что это имя уже занято',
        };
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(dto.password, salt);
      const createUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hash,
          avatar: null,
        },
      });
      if (createUser) {
        const payload = { name: createUser.name, sub: createUser.id };
        const token = this.jwtService.sign(payload);
        const { password, ...user } = createUser;
        return {
          user,
          token,
        };
      }
    } catch (error) {
      return {
        error,
        message: 'Не удалось зарегестрироватся',
      };
    }
  }
  async loginTap1(email: string) {
    try {
      console.log(email);
      const isEmail = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!isEmail) {
        return {
          message: 'Аккаунт не найден',
        };
      }

      if (isEmail) {
        const { password, ...user } = isEmail;
        return {
          user,
        };
      }
    } catch (error) {
      return {
        message: 'Возникла ошибка',
      };
    }
  }
  async loginTap2(dto: LoginTap2) {
    try {
      const isEmail = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (isEmail) {
        const validPassword = await bcrypt.compare(
          dto.password,
          isEmail.password,
        );
        const { password, ...user } = isEmail;
        if (!validPassword) {
          return {
            message: 'Не верный пароль',
          };
        }
        if (validPassword) {
          const payload = { name: isEmail.name, sub: isEmail.id };
          const token = this.jwtService.sign(payload);
          return {
            user,
            token,
          };
        }
      } else {
        return {
          message: 'Aккаунт не найден',
        };
      }
    } catch (error) {
      return {
        error,
        message: 'Возникла ошибка',
      };
    }
  }
  async validUser(userar: { sub: number }) {
    try {
      const isUser = await this.prisma.user.findUnique({
        where: {
          id: userar.sub,
        },
      });
      if (!isUser) {
        return {
          message: 'Такой пользователь не найден',
        };
      }
      const { password, ...user } = isUser;
      return {
        user,
      };
    } catch (error) {
      return {
        error,
        message: 'Возникла ошибка',
      };
    }
  }
  async editUserAvatar(filename: string, userar: { sub: number }) {
    try {
      const editUserAvatar = await this.prisma.user.update({
        where: {
          id: userar.sub,
        },
        data: {
          avatar: filename,
        },
      });
      if (editUserAvatar) {
        const { password, ...user } = editUserAvatar;
        return {
          user,
        };
      }
    } catch (error) {
      return {
        message: 'Возникла ошибка',
      };
    }
  }
  async editUser(dto: UpdateUserDto, userar: { sub: number }) {
    try {
      const isUser = await this.prisma.user.findUnique({
        where: {
          id: userar.sub,
        },
      });
      if (!isUser) {
        return {
          message: 'Ошибка обновления',
        };
      }
      const editUser = await this.prisma.user.update({
        where: {
          id: userar.sub,
        },
        data: {
          email: dto.email,
          name: dto.name,
        },
      });
      if (editUser) {
        const { password, ...user } = editUser;
        return {
          user,
        };
      }
    } catch (error) {
      return {
        error,
        message: 'Ошибка обновления',
      };
    }
  }
  async editPassword(password: string, userar: { sub: number }) {
    try {
      const isUser = await this.prisma.user.findUnique({
        where: {
          id: userar.sub,
        },
      });
      if (!isUser) {
        return {
          message: 'Пользователь не найден',
        };
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const passwordSend = await this.prisma.user.update({
        where: {
          id: userar.sub,
        },
        data: {
          password: hash,
        },
      });
      if (passwordSend) {
        return {
          message: 'Успешно',
        };
      }
    } catch (error) {
      return {
        error,
        message: 'Не удалось обновить пароль',
      };
    }
  }
}
