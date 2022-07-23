import { Inject, Controller, Post, Body } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { UserLoginDTO } from '../dto/user.dto';
import { Validate } from '@midwayjs/validate';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/user/register')
  @Validate()
  async register(@Body() user: UserLoginDTO) {
    const resp = await this.userService.save(user);
    return resp;
  }

  @Post('/user/login')
  @Validate()
  async login(@Body() user: UserLoginDTO) {
    const resp = await this.userService.login(user);
    return resp;
  }
}
