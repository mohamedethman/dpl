import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcisComponent } from './dcis.component';

describe('DcisComponent', () => {
  let component: DcisComponent;
  let fixture: ComponentFixture<DcisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DcisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
