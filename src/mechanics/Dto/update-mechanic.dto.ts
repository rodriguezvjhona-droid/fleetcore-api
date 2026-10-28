import { PartialType } from '@nestjs/mapped-types';
import { CreateMechanicDto } from './create-mechanic.dto.js';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateMechanicDto extends PartialType(CreateMechanicDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}