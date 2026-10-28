import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import type { User } from '../../users/entities/user.entity.js';
import type { Maintenance } from '../../maintenances/entities/maintenances.entity.js';

@Entity('mechanics')
export class Mechanic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  specialty: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToOne('User', 'mechanic', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  user: User;

  @OneToMany('Maintenance', 'mechanic')
  maintenances: Maintenance[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}