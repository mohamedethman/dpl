import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LaboratoiresComponent } from "./laboratoires.component";

describe("DcisComponent", () => {
  let component: LaboratoiresComponent;
  let fixture: ComponentFixture<LaboratoiresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratoiresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LaboratoiresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
