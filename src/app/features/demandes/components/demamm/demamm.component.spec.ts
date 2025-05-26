import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemammComponent } from './demamm.component';

describe('DemammComponent', () => {
  let component: DemammComponent;
  let fixture: ComponentFixture<DemammComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemammComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemammComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
