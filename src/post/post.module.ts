import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/schemas/Post.Schema';
import { User, UserSchema } from 'src/schemas/User.Schema';
import { TenantMiddleware } from 'src/middlewares/tenants.middleware';
import { tenantConnectionProvider } from 'src/providers/tenant-connection.provider';
import { tenantModels } from 'src/providers/tenant-models-provider';

@Module({
  /* imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ], */
  controllers: [PostController],
  providers: [
    PostService,
    /* tenantConnectionProvider, */ tenantModels.postModel,
    tenantModels.userModel,
  ],
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(PostController);
  }
}
