import { TestBed } from '@angular/core/testing';

import { ProductController } from './productController.service';

describe('ProductControllerService', () => {
  let service: ProductController;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
