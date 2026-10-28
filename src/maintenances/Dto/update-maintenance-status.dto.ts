import { IsEnum } from 'class-validator';
import { MaintenanceStatus } from '../../Cammon/enums/maintenance-status.enum.js';

export class UpdateMaintenanceStatusDto {
  @IsEnum(MaintenanceStatus)
  status: MaintenanceStatus;
}