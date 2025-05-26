import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListesRoutingModule } from './listes-routing.module';
import {NgbModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {ListesComponent} from './listes.component';
import {FormsModule} from '@angular/forms';
import {NgxPermissionsModule} from "ngx-permissions";
import {NgSelectModule} from "@ng-select/ng-select";
import {SharedModule} from "../../shared-module/shared-module.module";
import {AuthModule} from "../../auth/auth.module";
import {QuillModule} from "ngx-quill";
import { EntiteSanteComponent } from './entite-sante/entite-sante.component';
import { ServiceMedicalComponent } from './service-medical/service-medical.component';
import { AppareilsComponent } from './appareils/appareils.component';


@NgModule({
  declarations: [ListesComponent, EntiteSanteComponent, ServiceMedicalComponent, AppareilsComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgbNavModule,
      SharedModule,
    //  NgSelectModule,
      NgxPermissionsModule,
    ListesRoutingModule,
      AuthModule,
    QuillModule.forRoot({
          modules: {
              syntax: true,
            toolbar: [
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['bold', 'italic', 'underline', 'strike'],
            ]
          }
        }
    ),
  ],
  exports: [ListesComponent]
})
export class ListesModule { }
