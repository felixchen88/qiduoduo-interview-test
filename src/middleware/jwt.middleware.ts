// src/middleware/jwt.middleware

import { Inject, Middleware } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { httpError } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';
import MidwayConfig from '../config/config.default';
@Middleware()
export class JwtMiddleware {
  @Inject()
  jwtService: JwtService;

  public static getName(): string {
    return 'jwt';
  }

  resolve() {
    return async (ctx: Context) => {
      if (this.ignore(ctx)) {
        return;
      }
      // 判断下有没有校验信息
      if (!ctx.headers['authorization']) {
        throw new httpError.UnauthorizedError();
      }
      // 从 header 上获取校验信息
      const parts = ctx.get('authorization').trim().split(' ');
      console.log('parts', parts);
      if (parts.length !== 2) {
        throw new httpError.UnauthorizedError();
      }

      const [scheme, token] = parts;

      if (/^Bearer$/i.test(scheme)) {
        try {
          //jwt.verify方法验证token是否有效
          await this.jwtService.verify(token, {
            complete: true,
          });
        } catch (error) {
          const newToken = await this.jwtService.sign({
            expiresIn: MidwayConfig.jwt.expiresIn,
          });
          ctx.set('Authorization', newToken);
        }
      }
    };
  }

  // 配置忽略鉴权的路由地址
  public ignore(ctx: Context): boolean {
    const ignore =
      ctx.path.indexOf('/api/user/login') === -1 ||
      ctx.path.indexOf('/api/user/register') === -1;
    return ignore;
  }
}
