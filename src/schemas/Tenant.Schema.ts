import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Tenant {
  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  tenantId: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
