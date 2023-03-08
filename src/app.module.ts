import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { join } from 'path';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
