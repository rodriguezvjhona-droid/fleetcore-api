import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mechanic } from './entities/mechanic.entity.js';
import { MechanicsService } from './mechanics.service.js';
import { MechanicsController } from './mechanics.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Mechanic])],
  providers: [MechanicsService],
  controllers: [MechanicsController],
  exports: [MechanicsService],
})
export class MechanicsModule {}