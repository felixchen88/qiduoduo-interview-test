import { Configuration, App } from '@midwayjs/decorator';
import * as orm from '@midwayjs/orm';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as jwt from '@midwayjs/jwt';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { initAppDataSource, AppDataSource } from './data-source';
import { ReportMiddleware } from './middleware/report.middleware';
import { JwtMiddleware } from './middleware/jwt.middleware';

@Configuration({
  imports: [
    koa,
    validate,
    jwt,
    orm,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware, JwtMiddleware]);
    if (!AppDataSource.isInitialized) {
      await initAppDataSource();
    }
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
