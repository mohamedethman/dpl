import { TestBed } from '@angular/core/testing';

import { CncmpParametrageService } from './cncmp-parametrage.service';

describe('CncmpParametrageService', () => {
  let service: CncmpParametrageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CncmpParametrageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
