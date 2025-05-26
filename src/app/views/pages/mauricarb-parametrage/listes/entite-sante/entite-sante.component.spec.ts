import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntiteSanteComponent } from './entite-sante.component';

describe('EntiteSanteComponent', () => {
  let component: EntiteSanteComponent;
  let fixture: ComponentFixture<EntiteSanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntiteSanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntiteSanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
