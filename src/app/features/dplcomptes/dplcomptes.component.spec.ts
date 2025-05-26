import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DplcomptesComponent } from './dplcomptes.component';

describe('DplcomptesComponent', () => {
  let component: DplcomptesComponent;
  let fixture: ComponentFixture<DplcomptesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DplcomptesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DplcomptesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
