import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateWorkshopDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}