import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mechanic } from './entities/mechanic.entity.js';
import { User } from '../users/entities/user.entity.js';
import { CreateMechanicDto } from './Dto/create-mechanic.dto.js';
import { UpdateMechanicDto } from './Dto/update-mechanic.dto.js';

@Injectable()
export class MechanicsService {
  constructor(
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
  ) {}

  async create(createMechanicDto: CreateMechanicDto): Promise<Mechanic> {
    const existing = await this.mechanicRepository.findOne({ where: { email: createMechanicDto.email } });
    if (existing) {
      throw new ConflictException('Ya existe un mecánico con este correo');
    }
    const mechanic = this.mechanicRepository.create({
      name: createMechanicDto.name,
      email: createMechanicDto.email,
      specialty: createMechanicDto.specialty,
      user: createMechanicDto.userId
        ? this.mechanicRepository.manager.create(User, { id: createMechanicDto.userId })
        : undefined,
    });
    return await this.mechanicRepository.save(mechanic);
  }

  async findAll(): Promise<Mechanic[]> {
    return await this.mechanicRepository.find({ relations: { user: true } });
  }

  async findOne(id: string): Promise<Mechanic> {
    const mechanic = await this.mechanicRepository.findOne({
      where: { id },
      relations: { user: true, maintenances: true },
    });
    if (!mechanic) {
      throw new NotFoundException('Mecánico no encontrado');
    }
    return mechanic;
  }

  async update(id: string, updateMechanicDto: UpdateMechanicDto): Promise<Mechanic> {
    const mechanic = await this.findOne(id);
    const { userId, ...updates } = updateMechanicDto;
    if (userId) {
      mechanic.user = this.mechanicRepository.manager.create(User, { id: userId });
    }
    Object.assign(mechanic, updates);
    return await this.mechanicRepository.save(mechanic);
  }

  async remove(id: string): Promise<Mechanic> {
    const mechanic = await this.findOne(id);
    mechanic.isActive = false;
    return await this.mechanicRepository.save(mechanic);
  }
}