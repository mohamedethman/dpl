import { TestBed } from '@angular/core/testing';

import { DmmService } from '../features/demandes/services/dmm.service';

describe('DmmService', () => {
  let service: DmmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DmmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
