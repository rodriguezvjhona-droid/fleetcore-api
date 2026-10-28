import { Test, TestingModule } from '@nestjs/testing';
import { MaintenancesService } from './maintenances.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Maintenance } from './entities/maintenances.entity.js';

describe('MaintenancesService', () => {
  let service: MaintenancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenancesService,
        { provide: getRepositoryToken(Maintenance), useValue: {} },
      ],
    }).compile();

    service = module.get<MaintenancesService>(MaintenancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
