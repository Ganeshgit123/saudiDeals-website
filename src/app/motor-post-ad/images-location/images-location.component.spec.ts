import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesLocationComponent } from './images-location.component';

describe('ImagesLocationComponent', () => {
  let component: ImagesLocationComponent;
  let fixture: ComponentFixture<ImagesLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagesLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagesLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
