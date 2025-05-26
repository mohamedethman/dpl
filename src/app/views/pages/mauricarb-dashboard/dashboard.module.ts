import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import {NgbDropdownModule, NgbDatepickerModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';

// Ng2-charts
//import { ChartsModule } from 'ng2-charts';
import { DashboardComponent } from './dashboard.component';
//import {NgxPermissionsModule} from 'ngx-permissions';
//import {QuillModule} from "ngx-quill";
import { WizardComponent } from './wizard/wizard.component';
import {NgWizardModule} from "ng-wizard";
import {SharedModule} from "../shared-module/shared-module.module";
import {HIGHLIGHT_OPTIONS} from "ngx-highlightjs";
//import {HighchartsChartModule} from "highcharts-angular";
//import {NgApexchartsModule} from "ng-apexcharts";
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
]

@NgModule({
  declarations: [DashboardComponent, WizardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    FeahterIconModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbModule,
      // QuillModule.forRoot({
      //         modules: {
      //             toolbar: [
      //                 [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      //                 ['bold', 'italic', 'underline', 'strike'],
      //             ]
      //         }
      //     }
      // ),
     // NgxPermissionsModule,
   // ChartsModule,
      NgWizardModule,
      SharedModule,
    //  HighchartsChartModule,
      //  NgApexchartsModule
  ],
    providers:[
        {
            provide: HIGHLIGHT_OPTIONS, // https://www.npmjs.com/package/ngx-highlightjs
            useValue: {
                coreLibraryLoader: () => import('highlight.js/lib/core'),
                languages: {
                    xml: () => import('highlight.js/lib/languages/xml'),
                    typescript: () => import('highlight.js/lib/languages/typescript'),
                    scss: () => import('highlight.js/lib/languages/scss'),
                }
            }
        }
    ]
})
export class DashboardModule { }
