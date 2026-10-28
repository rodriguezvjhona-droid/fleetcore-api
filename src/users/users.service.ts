import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './Dto/create-user.dto.js';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
) {}

async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
    where: { email: createUserDto.email },
    });
    if (existing) {
    throw new ConflictException('El correo electrónico ya está registrado');
    }

    const passwordHash = await argon2.hash(createUserDto.password);

    const user = this.userRepository.create({
    name: createUserDto.name,
    email: createUserDto.email,
    passwordHash,
    role: createUserDto.role,
    });

    return await this.userRepository.save(user);
}

async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
}

async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
    throw new NotFoundException('Usuario no encontrado');
    }
    return user;
}

async findAll(): Promise<User[]> {
    return await this.userRepository.find();
    }
}
