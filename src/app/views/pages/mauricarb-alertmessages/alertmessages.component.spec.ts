import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertmessagesComponent } from './alertmessages.component';

describe('AlertmessagesComponent', () => {
  let component: AlertmessagesComponent;
  let fixture: ComponentFixture<AlertmessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertmessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertmessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
