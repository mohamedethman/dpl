import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GrdFilterPipePipe} from "../grd-filter-pipe.pipe";
import {FormsModule} from "@angular/forms";
import {SortDirective} from "../directive/sort.directive";

@NgModule({
  declarations: [
      GrdFilterPipePipe,
      SortDirective
  ],
  imports: [
    CommonModule,
    //  NgSelectModule,
      FormsModule
  ],
    exports: [
        GrdFilterPipePipe,
        SortDirective
    ]
})
export class SharedModule { }
