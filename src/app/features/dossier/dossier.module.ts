import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule } from "@angular/router";

// Import components, directives, and pipes specific to this feature
import { DossierDetailsComponent } from "./components/dossier-details/dossier-details.component";
import { DpldemandesComponent } from "./components/dpldemandes/dpldemandes.component";
import { RechercheDossiersComponent } from "./components/recherche-dossiers/recherche-dossiers.component";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SuperviseurDemandesComponent } from "./components/superviseur-demandes/superviseur-demandes.component";
import { ExaminateurDemandesComponent } from "./components/examinateur-demandes/examinateur-demandes.component";
import { CommissionDemandesComponent } from "./components/commission-demandes/commission-demandes.component";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    // Declare all components, directives, and pipes for this feature
    DossierDetailsComponent,
    DpldemandesComponent,
    RechercheDossiersComponent,
    SuperviseurDemandesComponent,
    ExaminateurDemandesComponent,
    CommissionDemandesComponent,
  ],
  imports: [
    // Import Angular modules and shared modules
    CommonModule,
    RouterModule.forChild([
      // Define routes specific to this feature
      { path: ":id", component: DossierDetailsComponent },
    ]),
    FormsModule,
    NgbModule,
    NgbPaginationModule,
  ],
  providers: [DatePipe],
})
export class DossierModule {}
