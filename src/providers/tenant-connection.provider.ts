import { InternalServerErrorException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export const tenantConnectionProvider = {
  provide: 'TENANT_CONNECTION',
  useFactory: async (request, connection: Connection) => {
    if (!request.tenantId) {
      throw new InternalServerErrorException('Tenant not found');
    }
    return connection.useDb(`tenant_${request.tenantId}`);
  },
  inject: [REQUEST, getConnectionToken()],
  //scope: Scope.REQUEST,
};
