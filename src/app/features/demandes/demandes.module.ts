import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms"; // Import ReactiveFormsModule here

import { DemandesDossierDetailsComponent } from "./components/dossier-details/demandes-dossier-details.component";
import { DemammComponent } from "./components/demamm/demamm.component";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { RechercherDocumentsComponent } from "./components/rechercher-documents/rechercher-documents.component";
@NgModule({
  declarations: [
    // Declare all components, directives, and pipes for this feature

    DemandesDossierDetailsComponent,
    DemammComponent,
    RechercherDocumentsComponent,
  ],
  imports: [
    // Import Angular modules and shared modules
    CommonModule,
    NgbPaginationModule,
    ToastrModule.forRoot({
      positionClass: "toast-top-right",
      progressBar: true,
      closeButton: true,

      //    disableTimeOut: true,
      progressAnimation: "increasing",
    }),
    RouterModule.forChild([
      // Define routes specific to this feature
      { path: ":id", component: DemandesDossierDetailsComponent },
    ]),
    FormsModule,
  ],
  providers: [DatePipe],
})
export class DemandesModule {}
