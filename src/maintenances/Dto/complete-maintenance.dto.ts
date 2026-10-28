import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CompleteMaintenanceDto {
  @IsString()
  workPerformed: string;

  @IsNumber()
  @Min(0)
  finalCost: number;

  @IsInt()
  @Min(0)
  finalMileage: number;

  @IsOptional()
  @IsDateString()
  actualEndDate?: string;
}