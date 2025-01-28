import { TestBed } from '@angular/core/testing';

import { DatapullerService } from './datapuller.service';

describe('DatapullerService', () => {
  let service: DatapullerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatapullerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
