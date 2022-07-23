import { Inject, Provide } from '@midwayjs/decorator';
import { JwtService } from '@midwayjs/jwt';
import { UserLoginDTO } from '../dto/user.dto';
import { UserEntity } from '../entity/user.entity';
import { UserModel } from '../model/user.model';
import * as md5 from 'md5';
import MidwayConfig from '../config/config.default';
@Provide()
export class UserService {
  @Inject()
  userModel: UserModel;
  @Inject()
  jwtService: JwtService;
  async save(userDTO: UserLoginDTO) {
    const user = new UserEntity();
    user.username = userDTO.username;
    user.password = md5(userDTO.password);
    await this.userModel.save(user);
  }
  async login(user: UserLoginDTO) {
    const userEntity = await this.userModel.getUserByUsernameAndPassword(
      user.username,
      user.password
    );
    if (userEntity === null) {
      return {
        code: 400,
        result: 'error',
        message: '账号或密码不正确',
        data: null,
      };
    } else {
      const token = await this.jwtService.sign({
        expiresIn: MidwayConfig.jwt.expiresIn,
      });
      return {
        code: 200,
        result: 'success',
        message: '登录成功',
        data: {
          token: token,
        },
      };
    }
  }
}
