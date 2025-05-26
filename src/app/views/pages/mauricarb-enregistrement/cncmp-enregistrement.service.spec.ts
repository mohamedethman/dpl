import { TestBed } from '@angular/core/testing';

import { CncmpEnregistrementService } from './cncmp-enregistrement.service';

describe('CncmpEnregistrementService', () => {
  let service: CncmpEnregistrementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CncmpEnregistrementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
