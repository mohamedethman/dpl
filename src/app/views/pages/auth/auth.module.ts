import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import {
  RegisterComponent,
  TimeFormatPipe,
} from "./register/register.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AlertmessagesComponent } from "../mauricarb-alertmessages/alertmessages.component";
import { NgbAlertModule, NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

const routes: Routes = [
  {
    path: "",
    component: AuthComponent,
    children: [
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full",
      },
      {
        path: "login",
        component: LoginComponent,
      },
      {
        path: "register",
        component: RegisterComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AuthComponent,
    AlertmessagesComponent,
    TimeFormatPipe,
  ],
  imports: [
    CommonModule,
    NgbAlertModule,
    NgbModalModule, // <-- Add this import
    FormsModule,
    ReactiveFormsModule, // <-- Recommended for forms
    RouterModule.forChild(routes),
  ],
  exports: [AlertmessagesComponent],
})
export class AuthModule {}
