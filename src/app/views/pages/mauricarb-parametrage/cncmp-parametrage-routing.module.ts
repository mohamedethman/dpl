import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UtilisateurComponent } from "./utilisateur/utilisateur.component";
import { GroupesComponent } from "./groupes/groupes.component";
import { ListesComponent } from "./listes/listes.component";
import { TracesComponent } from "./traces/traces.component";
import { AdduserComponent } from "./utilisateur/adduser/adduser.component";
import { ModifierGroupeComponent } from "./modifier-groupe/modifier-groupe.component";
import { ClientsComponent } from "./clients/clients.component";
import { ReportingComponent } from "./reporting/reporting.component";
import { PushSmsComponent } from "./push-sms/push-sms.component";
import { ProduitsComponent } from "./produits/produits.component";
import { CadeauxComponent } from "./cadeaux/cadeaux.component";

/**
 * @author Med.Mansour
 */
const routes: Routes = [
  {
    path: "",
    data: {
      title: "Parametrage",
    },
    children: [
      {
        path: "",
        redirectTo: "utilisateur",
      },
      {
        path: "utilisateur",
        component: UtilisateurComponent,
        data: {
          title: "Gestion des utilisateurs",
        },
      },
      {
        path: "adduser",
        component: AdduserComponent,
        data: {
          title: "Ajouter un utilisateur",
        },
      },
      {
        path: "profils",
        component: GroupesComponent,
        data: {
          title: "Gestion des profils",
        },
      },
      {
        path: "modifierprofils",
        component: ModifierGroupeComponent,
        data: {
          title: "Gestion des profils",
        },
      },
      {
        path: "listes",
        component: ListesComponent,
        data: {
          title: "Gestion des listes",
        },
      },
      {
        path: "traces",
        component: TracesComponent,
        data: {
          title: "Gestion des profils",
        },
      },
      {
        path: "clients",
        component: ClientsComponent,
        data: {
          title: "Gestion des clients",
        },
      },
      {
        path: "produits",
        component: ProduitsComponent,
        data: {
          title: "Gestion des produits",
        },
      },
      {
        path: "cadeaux",
        component: CadeauxComponent,
        data: {
          title: "Gestion des cadeaux",
        },
      },
      {
        path: "reporting",
        component: ReportingComponent,
        data: {
          title: "Gestion des statistiques",
        },
      },
      {
        path: "push-sms",
        component: PushSmsComponent,
        data: {
          title: "Gestion des SMS",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CncmpParametrageRoutingModule {}
