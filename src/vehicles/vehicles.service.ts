import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity.js';
import { createvehicleDto } from './Dto/create-vehicle.dto.js';
import { UpdateVehicleDto } from './Dto/update-vehicle.dto.js';
import { VehicleStatus } from '../Cammon/enums/vehicle-status.enum.js';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createVehicleDto: createvehicleDto): Promise<Vehicle> {
    const existing = await this.vehicleRepository.findOne({
      where: { plate: createVehicleDto.plate },
    });
    if (existing) {
      throw new ConflictException(
        'Ya existe un vehículo registrado con esta placa',
      );
    }
    const vehicle = this.vehicleRepository.create(createVehicleDto);
    return await this.vehicleRepository.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find();
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: { maintenances: true },
    });
    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }
    return vehicle;
  }

  async findByPlate(plate: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({ where: { plate } });
    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }
    return vehicle;
  }

  async update(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    Object.assign(vehicle, updateVehicleDto);
    return await this.vehicleRepository.save(vehicle);
  }

  async remove(id: string): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    vehicle.status = VehicleStatus.INACTIVE;
    return await this.vehicleRepository.save(vehicle);
  }
}
