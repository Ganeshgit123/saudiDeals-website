import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorCategoryComponent } from './motor-category.component';

describe('MotorCategoryComponent', () => {
  let component: MotorCategoryComponent;
  let fixture: ComponentFixture<MotorCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotorCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotorCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
