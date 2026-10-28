
import { PartialType } from '@nestjs/mapped-types';
import { createvehicleDto } from './create-vehicle.dto.js';
import { IsEnum, IsOptional } from 'class-validator';
import { VehicleStatus } from './../../Cammon/enums/vehicle-status.enum.js'

export class UpdateVehicleDto extends PartialType(createvehicleDto){
    @IsOptional()
    @IsEnum(VehicleStatus)
    status?: VehicleStatus;
}