import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BaseComponent } from "./views/layout/base/base.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { ErrorPageComponent } from "./views/pages/error-page/error-page.component";
import { DossierDetailsComponent } from "./features/dossier/components/dossier-details/dossier-details.component";
import { DpldemandesComponent } from "./features/dossier/components/dpldemandes/dpldemandes.component";
import { RechercheDossiersComponent } from "./features/dossier/components/recherche-dossiers/recherche-dossiers.component";
import { DmmCreateComponent } from "./features/demandes/components/dmm-create/dmm-create.component";
import { DemammComponent } from "./features/demandes/components/demamm/demamm.component";
import { DemandesDossierDetailsComponent } from "./features/demandes/components/dossier-details/demandes-dossier-details.component";
import { CompletsavemedicamentComponent } from "./features/demandes/components/completsavemedicament/completsavemedicament.component";
import { SuperviseurDemandesComponent } from "./features/dossier/components/superviseur-demandes/superviseur-demandes.component";
import { ExaminateurDemandesComponent } from "./features/dossier/components/examinateur-demandes/examinateur-demandes.component";
import { CommissionDemandesComponent } from "./features/dossier/components/commission-demandes/commission-demandes.component";
import { DcisComponent } from "./features/references/dcis/components/dcis/dcis.component";
import { AtcsComponent } from "./features/references/atcs/components/atcs/atcs.component";
import { LaboratoiresComponent } from "./features/references/laboratoires/components/laboratoires/laboratoires.component";
import { IncqdemandesComponent } from "./features/dossier/components/incqdemandes/incqdemandes.component";
import { RechercheDocsComponent } from "./features/demandes/components/recherche-docs/recherche-docs.component";
import { RechercherDocumentsComponent } from "./features/demandes/components/rechercher-documents/rechercher-documents.component";

import { CommissionComponent } from "./views/pages/mauricarb-parametrage/commission/commission.component";
import { RenouvellementAmmComponent } from "./features/demandes/components/renouvellement-amm/renouvellement-amm.component";
import { DplcomptesComponent } from "./features/dplcomptes/dplcomptes.component";

import { UtilisateurComponent } from "./views/pages/mauricarb-parametrage/utilisateur/utilisateur.component";
import { GroupesComponent } from "./views/pages/mauricarb-parametrage/groupes/groupes.component";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      import("./views/pages/auth/auth.module").then((m) => m.AuthModule),
  },
  { path: "", redirectTo: "auth", pathMatch: "full" },
  {
    path: "",
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./views/pages/mauricarb-dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
        data: { label: "Dashboard" },
      },
      // {
      //   path: 'parametrage',
      //   loadChildren: () => import('./views/pages/mauricarb-parametrage/cncmp-parametrage.module').then(m => m.CncmpParametrageModule)
      // },
      {
        path: "enregistrement",
        loadChildren: () =>
          import(
            "./views/pages/mauricarb-enregistrement/cncmp-enregistrement.module"
          ).then((m) => m.CncmpEnregistrementModule),
        data: { label: "Enregistrement" },
      },
      {
        path: "ammprocess",
        component: DmmCreateComponent,
        data: { label: "AMM Process" },
      },

      {
        path: "amm-renouvellement",
        component: RenouvellementAmmComponent,
        data: { label: "Renouvellement AMM" },
      },

      {
        path: "dpl-comptes",
        component: DplcomptesComponent,
        data: { label: "Laboratoire Activation" },
      },
      {
        path: "parametrage/utilisateur",
        component: UtilisateurComponent,
        data: { label: "AMM Process" },
      },

      {
        path: "parametrage/profils",
        component: GroupesComponent,
        data: { label: "AMM Process" },
      },

      {
        path: "referentiels/Dcis",
        component: DcisComponent,

        data: { label: "Dcis" },
      },

      {
        path: "Laboratoires",
        component: LaboratoiresComponent,

        data: { label: "Laboratoires" },
      },

      {
        path: "referentiels/Atcs",
        component: AtcsComponent,

        data: { label: "Atcs" },
      },
      {
        path: "demamm",
        component: DemammComponent,
        data: { label: "Demamm" },
      },

      {
        path: "dpldemandes",
        component: DpldemandesComponent,
        data: { label: "dpldemandes" },
      },

      {
        path: "lncq-demandes",
        component: IncqdemandesComponent,
        data: { label: "lncq-demandes" },
      },
      {
        path: "recherchedemandes",
        component: RechercheDossiersComponent,
        canActivate: [AuthGuard],
        data: { label: "Demamm" },
      },

      {
        path: "rechercherDocuments",
        component: RechercherDocumentsComponent,
        data: { label: "rechercherDocuments" },
      },

      {
        path: "dossier-details/:id/:mode", // Route with both ID and mode
        component: DossierDetailsComponent,
        data: { label: "Dossier Details" },
      },

      {
        path: "complete-dossier/:id/step/:currentStep",
        component: CompletsavemedicamentComponent,
        data: { label: "Dossier Details" },
      },
      {
        path: "demandes-dossier-details/:id/:mode", // Route with both ID and mode
        component: DemandesDossierDetailsComponent,
        data: { label: "Demande Dossier Details" },
      },
      {
        path: "superviseur-demandes",
        component: SuperviseurDemandesComponent,
        data: { label: "superviseur-demandes" },
      },

      {
        path: "commissions",
        component: CommissionComponent,
        data: { label: "commissions" },
      },
      {
        path: "examinateur-demandes",
        component: ExaminateurDemandesComponent,
        data: { label: "examinateur-demandes" },
      },
      {
        path: "commission-demandes",
        component: CommissionDemandesComponent,
        data: { label: "commission-demandes" },
      },

      { path: "**", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },
  {
    path: "error",
    component: ErrorPageComponent,
    data: {
      type: 404,
      title: "Page Not Found",
      desc: "Oopps!! The page you were looking for doesn't exist.",
    },
  },
  {
    path: "error/:type",
    component: ErrorPageComponent,
  },
  { path: "**", redirectTo: "error", pathMatch: "full" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "top",
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
