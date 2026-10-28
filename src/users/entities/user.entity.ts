import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Role } from '../../Cammon/enums/role.enum.js';
import type { Mechanic } from '../../mechanics/entities/mechanic.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  passwordHash: string;

  @Column({ type: 'enum', enum: Role, default: Role.TECHNICIAN })
  role: Role;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToOne('Mechanic', 'user', {
    nullable: true,
    cascade: true,
  })
  mechanic: Mechanic;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
