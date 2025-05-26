import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercherDocumentsComponent } from './rechercher-documents.component';

describe('RechercherDocumentsComponent', () => {
  let component: RechercherDocumentsComponent;
  let fixture: ComponentFixture<RechercherDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechercherDocumentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RechercherDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
