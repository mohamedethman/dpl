<<<<<<< HEAD
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CncmpParametrageRoutingModule } from "./cncmp-parametrage-routing.module";
import { UtilisateurComponent } from "./utilisateur/utilisateur.component";
import { GroupesComponent } from "./groupes/groupes.component";
import { TracesComponent } from "./traces/traces.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ListesModule } from "./listes/listes.module";
import { DragulaModule } from "ng2-dragula";
//import {SortablejsModule, SortablejsOptions} from "ngx-sortablejs";
import { NgxPermissionsModule } from "ngx-permissions";
import { AdduserComponent } from "./utilisateur/adduser/adduser.component";
import { ModifierGroupeComponent } from "./modifier-groupe/modifier-groupe.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { QuillModule } from "ngx-quill";
import { ClientsComponent } from "./clients/clients.component";
import { ReportingComponent } from "./reporting/reporting.component";
import { PushSmsComponent } from "./push-sms/push-sms.component";
import { ProduitsComponent } from "./produits/produits.component";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { CadeauxComponent } from "./cadeaux/cadeaux.component";
=======
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CncmpParametrageRoutingModule } from './cncmp-parametrage-routing.module';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { GroupesComponent } from './groupes/groupes.component';
import { TracesComponent } from './traces/traces.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ListesModule} from './listes/listes.module';
import {DragulaModule} from "ng2-dragula";
import {NgxPermissionsModule} from "ngx-permissions";
import { AdduserComponent } from './utilisateur/adduser/adduser.component';
import { ModifierGroupeComponent } from './modifier-groupe/modifier-groupe.component';
import {QuillModule} from "ngx-quill";
import { ClientsComponent } from './clients/clients.component';
import { ReportingComponent } from './reporting/reporting.component';
import { PushSmsComponent } from './push-sms/push-sms.component';
import { ProduitsComponent } from './produits/produits.component';
import { CadeauxComponent } from './cadeaux/cadeaux.component';
import {AngularEditorModule} from '@kolkov/angular-editor';
>>>>>>> 5b24fe8a1f54419bc545f899808690b660217a9a

/**
 * @author Med.Mansour
 */
@NgModule({
<<<<<<< HEAD
  declarations: [
    UtilisateurComponent,
    GroupesComponent,
    TracesComponent,
    AdduserComponent,
    ModifierGroupeComponent,
    ClientsComponent,
    ReportingComponent,
    PushSmsComponent,
    ProduitsComponent,
    CadeauxComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ListesModule,
    DragulaModule.forRoot(),
    QuillModule.forRoot({
      modules: {
        toolbar: [
          [{ list: "ordered" }, { list: "bullet" }],
          ["bold", "italic", "underline", "strike"],
        ],
      },
    }),
    // SortablejsModule,
    NgSelectModule,
    NgxPermissionsModule,
    CncmpParametrageRoutingModule,
    ReactiveFormsModule,
    AngularEditorModule,
  ],
=======
  declarations: [UtilisateurComponent, GroupesComponent, TracesComponent, AdduserComponent, ModifierGroupeComponent, ClientsComponent, ReportingComponent, PushSmsComponent, ProduitsComponent, CadeauxComponent],
    imports: [
        CommonModule,
        FormsModule,
    //    NgbModule,
        ListesModule,
        DragulaModule.forRoot(),
        QuillModule.forRoot({
                modules: {
                    toolbar: [
                        [{'list': 'ordered'}, {'list': 'bullet'}],
                        ['bold', 'italic', 'underline', 'strike'],
                    ]
                }
            }
        ),
       // SortablejsModule,
   //     NgSelectModule,
        NgxPermissionsModule,
        CncmpParametrageRoutingModule,
        ReactiveFormsModule,
        AngularEditorModule
    ]
>>>>>>> 5b24fe8a1f54419bc545f899808690b660217a9a
})
export class CncmpParametrageModule {}
