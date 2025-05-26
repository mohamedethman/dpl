import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadeauxComponent } from './cadeaux.component';

describe('CadeauxComponent', () => {
  let component: CadeauxComponent;
  let fixture: ComponentFixture<CadeauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadeauxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadeauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
