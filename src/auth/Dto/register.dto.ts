// register.dto.ts
import {
IsEmail,
IsEnum,
IsNotEmpty,
IsString,
MinLength,
} from 'class-validator';
import { Role } from '../../Cammon/enums/role.enum.js';

export class RegisterDto {
@IsNotEmpty()
@IsString()
name: string;

@IsNotEmpty()
@IsEmail()
email: string;

@IsNotEmpty()
@IsString()
@MinLength(6)
password: string;

@IsNotEmpty()
@IsEnum(Role)
role: Role;
}

