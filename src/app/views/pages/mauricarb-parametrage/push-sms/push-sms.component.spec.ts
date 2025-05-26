import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushSmsComponent } from './push-sms.component';

describe('PushSmsComponent', () => {
  let component: PushSmsComponent;
  let fixture: ComponentFixture<PushSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PushSmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PushSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
