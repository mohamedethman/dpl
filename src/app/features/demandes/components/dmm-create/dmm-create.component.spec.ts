import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmmCreateComponent } from './dmm-create.component';

describe('DmmCreateComponent', () => {
  let component: DmmCreateComponent;
  let fixture: ComponentFixture<DmmCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmmCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmmCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
