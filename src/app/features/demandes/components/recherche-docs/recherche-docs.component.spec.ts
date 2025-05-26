import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheDocsComponent } from './recherche-docs.component';

describe('RechercheDocsComponent', () => {
  let component: RechercheDocsComponent;
  let fixture: ComponentFixture<RechercheDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechercheDocsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RechercheDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
