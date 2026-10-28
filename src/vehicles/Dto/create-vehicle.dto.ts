import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class createvehicleDto {
  @IsNotEmpty()
  @IsString()
  plate: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1886)
  year: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  currentMileage: number;
}