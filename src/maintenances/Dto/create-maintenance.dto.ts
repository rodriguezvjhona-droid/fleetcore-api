import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { MaintenanceStatus } from '../../Cammon/enums/maintenance-status.enum.js';
import { MaintenanceType } from '../../Cammon/enums/maintenance-type.enum.js';

export class CreateMaintenanceDto {
  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @IsString()
  description: string;

  @IsInt()
  @Min(0)
  initialMileage: number;

  @IsDateString()
  scheduledStartDate: string;

  @IsDateString()
  scheduledEndDate: string;

  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @IsUUID()
  vehicleId: string;

  @IsOptional()
  @IsUUID()
  mechanicId?: string;

  @IsUUID()
  workshopId: string;
}