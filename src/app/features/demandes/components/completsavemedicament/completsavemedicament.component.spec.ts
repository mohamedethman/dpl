import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletsavemedicamentComponent } from './completsavemedicament.component';

describe('CompletsavemedicamentComponent', () => {
  let component: CompletsavemedicamentComponent;
  let fixture: ComponentFixture<CompletsavemedicamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletsavemedicamentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletsavemedicamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
