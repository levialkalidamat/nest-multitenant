import { InternalServerErrorException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Post, PostSchema } from 'src/schemas/Post.Schema';
import { User, UserSchema } from 'src/schemas/User.Schema';

export const tenantModels = {
  postModel: {
    provide: 'POST_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      /* if (!request.tenantId) {
        throw new InternalServerErrorException('Tenant not found');
      } */
      return tenantConnection.model(Post.name, PostSchema);
    },
    inject: ['TENANT_CONNECTION'],
    //scope: Scope.REQUEST,
  },
  userModel: {
    provide: 'USER_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      /* if (!request.tenantId) {
        throw new InternalServerErrorException('Tenant not found');
      } */
      return tenantConnection.model(User.name, UserSchema);
    },
    inject: ['TENANT_CONNECTION'],
    //scope: Scope.REQUEST,
  },
};
