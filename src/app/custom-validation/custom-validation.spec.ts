import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomValidation } from './custom-validation';

describe('CustomValidation', () => {
  let component: CustomValidation;
  let fixture: ComponentFixture<CustomValidation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomValidation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomValidation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
