import { TestBed } from '@angular/core/testing';

import { CartController } from './cart-controller.service';

describe('CartControllerService', () => {
  let service: CartController;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
