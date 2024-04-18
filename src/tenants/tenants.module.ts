import { Global, Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { Tenant, TenantSchema } from 'src/schemas/Tenant.Schema';
import { MongooseModule } from '@nestjs/mongoose';
import { tenantConnectionProvider } from 'src/providers/tenant-connection.provider';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tenant.name,
        schema: TenantSchema,
      },
      /* {
        name: User.name,
        schema: UserSchema,
      }, */
    ]),
  ],
  controllers: [TenantsController],
  providers: [TenantsService, tenantConnectionProvider],
  exports: [TenantsService, tenantConnectionProvider],
})
export class TenantsModule {}
