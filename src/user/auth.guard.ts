import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

      if (token) {
        const decoded = this.jwtService.verify(token);
        req.userId = decoded;

        return true;
      }
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизованн',
      });
    }
  }
}
