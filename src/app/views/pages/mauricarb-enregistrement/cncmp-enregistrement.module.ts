import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CncmpEnregistrementRoutingModule } from './cncmp-enregistrement-routing.module';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {AuthModule} from "../auth/auth.module";
import {NgxPermissionsModule} from "ngx-permissions";
import {NgSelectModule} from "@ng-select/ng-select";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {QuillModule} from "ngx-quill";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {SharedModule} from "../shared-module/shared-module.module";
import {NgWizardModule} from "ng-wizard";
//import {NgxPrintModule} from "ngx-print";

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
      AuthModule,
      NgSelectModule,
      AngularEditorModule,
      QuillModule.forRoot({
              modules: {
                  //  syntax: true,
                  toolbar: [
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                      ['bold', 'italic', 'underline', 'strike'],
                  ]
              }
          }
      ),
      NgxPermissionsModule,
    //  NgxPrintModule,
      PdfViewerModule,
      NgWizardModule,
      SharedModule,
    CncmpEnregistrementRoutingModule
  ],
    providers: [
        NgbActiveModal
    ],
    exports: [

    ]
})
export class CncmpEnregistrementModule { }
