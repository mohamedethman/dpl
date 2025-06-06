import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms"; // Import ReactiveFormsModule here
import { APP_INITIALIZER } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";

import { LayoutModule } from "./views/layout/layout.module";
import { AuthGuard } from "./core/guard/auth.guard";

import { AppComponent } from "./app.component";
import { ErrorPageComponent } from "./views/pages/error-page/error-page.component";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { HIGHLIGHT_OPTIONS } from "ngx-highlightjs";
import { AuthenticationService } from "./service/authenticationService";
import { HttpClientModule } from "@angular/common/http";
import { CncmpParametrageService } from "./views/pages/mauricarb-parametrage/cncmp-parametrage.service";
import { ListesService } from "./views/pages/mauricarb-parametrage/listes/listes.service";
import { CncmpEnregistrementService } from "./views/pages/mauricarb-enregistrement/cncmp-enregistrement.service";
import { ToastrModule } from "ngx-toastr";
import { NgxPermissionsModule } from "ngx-permissions";
import { AppConfigService } from "./app-config.service";
import { NgWizardModule, NgWizardConfig, THEME } from "ng-wizard";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { DossierModule } from "./features/dossier/dossier.module";
import { DmmCreateComponent } from "./features/demandes/components/dmm-create/dmm-create.component";
import { CompletsavemedicamentComponent } from "./features/demandes/components/completsavemedicament/completsavemedicament.component";
import { DemandesModule } from "./features/demandes/demandes.module";
import { DcisComponent } from "./features/references/dcis/components/dcis/dcis.component";
import { AtcsComponent } from "./features/references/atcs/components/atcs/atcs.component";
import { LaboratoiresComponent } from "./features/references/laboratoires/components/laboratoires/laboratoires.component";
import { FileUploadComponent } from "./features/demandes/components/file-upload-component/file-upload-component.component";
import { IncqdemandesComponent } from "./features/dossier/components/incqdemandes/incqdemandes.component";
import { RechercheDocsComponent } from "./features/demandes/components/recherche-docs/recherche-docs.component";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";

import { DpldemandesComponent } from "./features/dossier/components/dpldemandes/dpldemandes.component";
import { RechercheDossiersComponent } from "./features/dossier/components/recherche-dossiers/recherche-dossiers.component";
import { RechercherDocumentsComponent } from "./features/demandes/components/rechercher-documents/rechercher-documents.component";
import { CommissionComponent } from "./views/pages/mauricarb-parametrage/commission/commission.component";
import { RenouvellementAmmComponent } from "./features/demandes/components/renouvellement-amm/renouvellement-amm.component";
import { DplcomptesComponent } from "./features/dplcomptes/dplcomptes.component";
import { UtilisateurComponent } from "./views/pages/mauricarb-parametrage/utilisateur/utilisateur.component";
import { GroupesComponent } from "./views/pages/mauricarb-parametrage/groupes/groupes.component";
import { NgSelectModule } from "@ng-select/ng-select";

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default,
};
export function initializeApp(appConfig: AppConfigService) {
  return () => appConfig.loadAppConfig();
}
@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
    DmmCreateComponent,
    CompletsavemedicamentComponent,
    DcisComponent,
    UtilisateurComponent,
    GroupesComponent,
    AtcsComponent,
    LaboratoiresComponent,
    FileUploadComponent,
    IncqdemandesComponent,
    RechercheDocsComponent,
    CommissionComponent,
    RenouvellementAmmComponent,
    DplcomptesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    NgbPaginationModule,
    BsDropdownModule.forRoot(), // Add this line
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: "toast-top-right",
      progressBar: true,
      closeButton: true,
      //    disableTimeOut: true,
      progressAnimation: "increasing",
    }),
    NgxPermissionsModule.forRoot(),
    NgWizardModule.forRoot(ngWizardConfig),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DossierModule,
    DemandesModule,
    //  NgSelectModule,
  ],

  providers: [
    AuthGuard,
    AuthenticationService,
    CncmpParametrageService,
    CncmpEnregistrementService,
    ListesService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
