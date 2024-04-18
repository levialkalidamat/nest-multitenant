import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TenantsService } from 'src/tenants/tenants.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private tenantService: TenantsService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id']?.toString();
    if (!tenantId) {
      throw new BadRequestException('Tenant not provided');
    }
    const tenantExits = await this.tenantService.getTenantById(tenantId);
    if (!tenantExits) {
      throw new NotFoundException('Tenant does not exist');
    }

    console.log(tenantId);
    req['tenantId'] = tenantId;
    next();
  }
}
