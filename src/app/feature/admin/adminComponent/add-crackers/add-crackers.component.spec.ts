import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrackersComponent } from './add-crackers.component';

describe('AddCrackersComponent', () => {
  let component: AddCrackersComponent;
  let fixture: ComponentFixture<AddCrackersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCrackersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCrackersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
