import { TestBed } from '@angular/core/testing';

import { ProducthandlerService } from './producthandler.service';

describe('ProducthandlerService', () => {
  let service: ProducthandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProducthandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
