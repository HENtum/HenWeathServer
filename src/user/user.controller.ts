import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginTap2 } from './dto/login-tap2.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from './auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
  @Post('/login')
  loginTap1(@Body('email') email: string) {
    return this.userService.loginTap1(email);
  }
  @Post('/login/password')
  loginTap2(@Body() dto: LoginTap2) {
    return this.userService.loginTap2(dto);
  }
  @UseGuards(AuthGuard)
  @Get()
  validUser(@Request() req: { userId: { sub: number } }) {
    return this.userService.validUser(req.userId);
  }
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (_, file, cb) => {
          const newFileName = file.originalname;
          cb(null, newFileName);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (!file?.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
          return cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  @UseGuards(AuthGuard)
  @Patch('/editAvatar')
  editUserAvatar(
    @UploadedFile()
    file: Express.Multer.File,
    @Request() req: { userId: { sub: number } },
  ) {
    return this.userService.editUserAvatar(file.originalname, req.userId);
  }
  @UseGuards(AuthGuard)
  @Patch('/edit')
  editUser(
    @Request() req: { userId: { sub: number } },
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.editUser(dto, req.userId);
  }
  @UseGuards(AuthGuard)
  @Patch('/edit/password')
  editPassword(
    @Body('password') password: string,
    @Request() req: { userId: { sub: number } },
  ) {
    return this.userService.editPassword(password, req.userId);
  }
}
