import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RenouvellementAmmComponent } from "./renouvellement-amm.component";

describe("DmmCreateComponent", () => {
  let component: RenouvellementAmmComponent;
  let fixture: ComponentFixture<RenouvellementAmmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenouvellementAmmComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenouvellementAmmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
