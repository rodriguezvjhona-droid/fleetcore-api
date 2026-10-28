import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maintenance } from './entities/maintenances.entity.js';
import { MaintenancesService } from './maintenances.service.js';
import { MaintenancesController } from './maintenances.controller.js';
import { VehiclesModule } from '../vehicles/vehicles.module.js';
import { MechanicsModule } from '../mechanics/mechanics.module.js';
import { WorkshopsModule } from '../workshops/workshops.module.js';
import { Vehicle } from '../vehicles/entities/vehicle.entity.js';
import { Mechanic } from '../mechanics/entities/mechanic.entity.js';
import { Workshop } from '../workshops/entities/workshop.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Maintenance, Vehicle, Mechanic, Workshop]),
    VehiclesModule,
    MechanicsModule,
    WorkshopsModule,
  ],
  providers: [MaintenancesService],
  controllers: [MaintenancesController],
  exports: [MaintenancesService],
})
export class MaintenancesModule {}