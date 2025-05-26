import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMedicalComponent } from './service-medical.component';

describe('ServiceMedicalComponent', () => {
  let component: ServiceMedicalComponent;
  let fixture: ComponentFixture<ServiceMedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceMedicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceMedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
