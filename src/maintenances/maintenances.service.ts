import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceStatus } from '../Cammon/enums/maintenance-status.enum.js';
import { Role } from '../Cammon/enums/role.enum.js';
import { CompleteMaintenanceDto } from './Dto/complete-maintenance.dto.js';
import { CreateMaintenanceDto } from './Dto/create-maintenance.dto.js';
import { Maintenance } from './entities/maintenances.entity.js';

@Injectable()
export class MaintenancesService {
  constructor(
    @InjectRepository(Maintenance)
    private readonly maintenanceRepository: Repository<Maintenance>,
  ) {}

  async create(dto: CreateMaintenanceDto): Promise<Maintenance> {
    const maintenance = this.maintenanceRepository.create({
      type: dto.type,
      description: dto.description,
      initialMileage: dto.initialMileage,
      scheduledStartDate: new Date(dto.scheduledStartDate),
      scheduledEndDate: new Date(dto.scheduledEndDate),
      status: dto.status ?? MaintenanceStatus.SCHEDULED,
      vehicle: { id: dto.vehicleId },
      mechanic: dto.mechanicId ? { id: dto.mechanicId } : null,
      workshop: { id: dto.workshopId },
    });

    return this.maintenanceRepository.save(maintenance);
  }

  async findAll(role: Role, userId: string): Promise<Maintenance[]> {
    const where =
      role === Role.TECHNICIAN
        ? { mechanic: { user: { id: userId } } }
        : undefined;

    return this.maintenanceRepository.find({
      where,
      relations: {
        vehicle: true,
        mechanic: { user: true },
        workshop: true,
      },
    });
  }

  async findOne(id: string): Promise<Maintenance> {
    const maintenance = await this.maintenanceRepository.findOne({
      where: { id },
      relations: {
        vehicle: true,
        mechanic: { user: true },
        workshop: true,
      },
    });
    if (!maintenance) {
      throw new NotFoundException('Mantenimiento no encontrado');
    }
    return maintenance;
  }

  async updateStatus(
    id: string,
    status: MaintenanceStatus,
  ): Promise<Maintenance> {
    const maintenance = await this.findOne(id);
    maintenance.status = status;
    return this.maintenanceRepository.save(maintenance);
  }

  async completeMaintenance(
    id: string,
    dto: CompleteMaintenanceDto,
  ): Promise<Maintenance> {
    const maintenance = await this.findOne(id);
    maintenance.status = MaintenanceStatus.COMPLETED;
    maintenance.workPerformed = dto.workPerformed;
    maintenance.finalCost = dto.finalCost;
    maintenance.finalMileage = dto.finalMileage;
    maintenance.actualEndDate = dto.actualEndDate
      ? new Date(dto.actualEndDate)
      : new Date();
    return this.maintenanceRepository.save(maintenance);
  }
}
