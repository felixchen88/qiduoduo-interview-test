import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import * as md5 from 'md5';
import { JwtService } from '@midwayjs/jwt';
import { Inject, Provide } from '@midwayjs/decorator';

@Provide()
export class UserModel {
  @InjectEntityModel(UserEntity)
  userRepo: Repository<UserEntity>;
  @Inject()
  jwtService: JwtService;
  /**
   * 根据用户名和密码获取用户信息
   * @param username {String} 用户名
   * @param password {String} 用户密码
   */
  async getUserByUsernameAndPassword(username, password): Promise<UserEntity> {
    return await this.userRepo.findOne({
      where: {
        username: username,
        password: md5(password),
      },
    });
  }

  async save(user: UserEntity) {
    this.userRepo.save(user);
  }
}
