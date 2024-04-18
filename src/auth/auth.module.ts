import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.Schema';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { Post, PostSchema } from 'src/schemas/Post.Schema';
import { tenantModels } from 'src/providers/tenant-models-provider';
import { TenantMiddleware } from 'src/middlewares/tenants.middleware';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      /* {
        name: User.name,
        schema: UserSchema,
      }, */
      /* {
        name: Post.name,
        schema: PostSchema,
      }, */
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, tenantModels.userModel],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(AuthController);
  }
}
