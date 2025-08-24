import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorSubscriptionComponent } from './motor-subscription.component';

describe('MotorSubscriptionComponent', () => {
  let component: MotorSubscriptionComponent;
  let fixture: ComponentFixture<MotorSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotorSubscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotorSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
