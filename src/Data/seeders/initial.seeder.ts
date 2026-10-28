import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Mechanic } from '../../mechanics/entities/mechanic.entity.js';
import { Workshop } from '../../workshops/entities/workshop.entity.js';
import { Vehicle } from '../../vehicles/entities/vehicle.entity.js';
import { Maintenance } from '../../maintenances/entities/maintenances.entity.js';
import { Role } from '../../Cammon/enums/role.enum.js';
import { VehicleStatus } from '../../Cammon/enums/vehicle-status.enum.js';
import { MaintenanceType } from '../../Cammon/enums/maintenance-type.enum.js';
import { MaintenanceStatus } from '../../Cammon/enums/maintenance-status.enum.js';
import * as argon2 from 'argon2';

@Injectable()
export class InitialSeeder {
  private readonly logger = new Logger(InitialSeeder.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Mechanic) private mechanicRepository: Repository<Mechanic>,
    @InjectRepository(Workshop) private workshopRepository: Repository<Workshop>,
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Maintenance) private maintenanceRepository: Repository<Maintenance>,
  ) {}

  async seed() {
    this.logger.log('Iniciando seeder idempotente de FleetCore...');

    const passwordHash = await argon2.hash('Admin123*');

    // 1. Usuarios
    const _adminUser = await this.upsertUser('Admin FleetCore', 'admin@fleetcore.com', passwordHash, Role.ADMIN);
    const techUser1 = await this.upsertUser('Mecánico Carlos', 'tech1@fleetcore.com', passwordHash, Role.TECHNICIAN);
    const techUser2 = await this.upsertUser('Mecánica Ana', 'tech2@fleetcore.com', passwordHash, Role.TECHNICIAN);
    const _managerUser = await this.upsertUser('Manager Luis', 'manager@fleetcore.com', passwordHash, Role.MANAGER);

    // 2. Talleres (2 talleres: 1 activo, 1 inactivo)
    const workshop1 = await this.upsertWorkshop('Taller Central', 'Calle 100 #15-20', true);
    const _workshop2 = await this.upsertWorkshop('Taller Norte (Inactivo)', 'Av. Carrera 45 #120-10', false);

    // 3. Mecánicos (3 mecánicos: 2 activos vinculados a técnicos, 1 inactivo)
    const mechanic1 = await this.upsertMechanic('Carlos Pérez', 'tech1@fleetcore.com', 'Motor y Transmisión', true, techUser1);
    const mechanic2 = await this.upsertMechanic('Ana Gómez', 'tech2@fleetcore.com', 'Electricidad Automotriz', true, techUser2);
    const _mechanic3 = await this.upsertMechanic('Pedro Inactivo', 'pedro.inactivo@fleetcore.com', 'Suspensión', false, null);

    // 4. Vehículos (4 vehículos con sus estados correspondientes)
    const vehicle1 = await this.upsertVehicle('ABC-123', 'Toyota', 'Hilux', 2022, 45000, VehicleStatus.AVAILABLE);
    const vehicle2 = await this.upsertVehicle('XYZ-789', 'Chevrolet', 'NPR', 2021, 80000, VehicleStatus.IN_MAINTENANCE);
    const _vehicle3 = await this.upsertVehicle('DEF-456', 'Renault', 'Duster', 2023, 15000, VehicleStatus.AVAILABLE);
    const _vehicle4 = await this.upsertVehicle('INAC-00', 'Ford', 'Cargo', 2018, 120000, VehicleStatus.INACTIVE);

    // 5. Mantenimientos de ejemplo (Historial COMPLETED y uno IN_PROGRESS)
    await this.upsertMaintenance({
      type: MaintenanceType.PREVENTIVE,
      description: 'Cambio de aceite y filtros generales',
      initialMileage: 44000,
      scheduledStartDate: new Date('2026-05-01T08:00:00Z'),
      scheduledEndDate: new Date('2026-05-01T12:00:00Z'),
      status: MaintenanceStatus.COMPLETED,
      vehicle: vehicle1,
      mechanic: mechanic1,
      workshop: workshop1,
      workPerformed: 'Sustitución completa de aceite sintético y filtros.',
      finalCost: 250000,
      finalMileage: 44050,
      actualEndDate: new Date('2026-05-01T11:30:00Z'),
    });

    await this.upsertMaintenance({
      type: MaintenanceType.CORRECTIVE,
      description: 'Reparación de sistema de frenos y discos',
      initialMileage: 79500,
      scheduledStartDate: new Date('2026-06-01T08:00:00Z'),
      scheduledEndDate: new Date('2026-06-02T18:00:00Z'),
      status: MaintenanceStatus.IN_PROGRESS,
      vehicle: vehicle2,
      mechanic: mechanic2,
      workshop: workshop1,
    });

    this.logger.log('Seeder ejecutado con éxito de forma idempotente.');
  }

  private async upsertUser(name: string, email: string, passwordHash: string, role: Role) {
    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      user = this.userRepository.create({ name, email, passwordHash, role, isActive: true });
      await this.userRepository.save(user);
    }
    return user;
  }

  private async upsertWorkshop(name: string, address: string, isActive: boolean) {
    let workshop = await this.workshopRepository.findOne({ where: { name } });
    if (!workshop) {
      workshop = this.workshopRepository.create({ name, address, isActive });
      await this.workshopRepository.save(workshop);
    }
    return workshop;
  }

  private async upsertMechanic(
    name: string,
    email: string,
    specialty: string,
    isActive: boolean,
    user: User | null,
  ) {
    let mechanic = await this.mechanicRepository.findOne({ where: { email } });
    if (!mechanic) {
      mechanic = this.mechanicRepository.create({
        name,
        email,
        specialty,
        isActive,
        user: user ?? undefined,
      });
      await this.mechanicRepository.save(mechanic);
    }
    return mechanic;
  }

  private async upsertVehicle(plate: string, brand: string, model: string, year: number, currentMileage: number, status: VehicleStatus) {
    let vehicle = await this.vehicleRepository.findOne({ where: { plate } });
    if (!vehicle) {
      vehicle = this.vehicleRepository.create({ plate, brand, model, year, currentMileage, status });
      await this.vehicleRepository.save(vehicle);
    }
    return vehicle;
  }

  private async upsertMaintenance(
    data: Pick<
      Maintenance,
      | 'type'
      | 'description'
      | 'initialMileage'
      | 'scheduledStartDate'
      | 'scheduledEndDate'
      | 'status'
      | 'vehicle'
      | 'mechanic'
      | 'workshop'
    > &
      Partial<
        Pick<
          Maintenance,
          'workPerformed' | 'finalCost' | 'finalMileage' | 'actualEndDate'
        >
      >,
  ) {
    let maintenance = await this.maintenanceRepository.findOne({
      where: { vehicle: { id: data.vehicle.id }, description: data.description },
    });
    if (!maintenance) {
      maintenance = this.maintenanceRepository.create(data);
      await this.maintenanceRepository.save(maintenance);
    }
    return maintenance;
  }
}