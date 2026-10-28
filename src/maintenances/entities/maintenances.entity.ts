import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MaintenanceStatus } from '../../Cammon/enums/maintenance-status.enum.js';
import { MaintenanceType } from '../../Cammon/enums/maintenance-type.enum.js';
import { Mechanic } from '../../mechanics/entities/mechanic.entity.js';
import { Vehicle } from '../../vehicles/entities/vehicle.entity.js';
import { Workshop } from '../../workshops/entities/workshop.entity.js';

@Entity('maintenances')
export class Maintenance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: MaintenanceType })
  type: MaintenanceType;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  initialMileage: number;

  @Column({ type: 'timestamptz' })
  scheduledStartDate: Date;

  @Column({ type: 'timestamptz' })
  scheduledEndDate: Date;

  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.SCHEDULED,
  })
  status: MaintenanceStatus;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.maintenances, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  vehicle: Vehicle;

  @ManyToOne(() => Mechanic, (mechanic) => mechanic.maintenances, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  mechanic: Mechanic | null;

  @ManyToOne(() => Workshop, (workshop) => workshop.maintenances, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  workshop: Workshop;

  @Column({ type: 'text', nullable: true })
  workPerformed: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  finalCost: number | null;

  @Column({ type: 'int', nullable: true })
  finalMileage: number | null;

  @Column({ type: 'timestamptz', nullable: true })
  actualEndDate: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}