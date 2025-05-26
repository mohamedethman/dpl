import { Component, OnInit } from '@angular/core';
import {Roles} from "../../../layout/navbar/roles";
import {NgxPermissionsService} from "ngx-permissions";

@Component({
  selector: 'app-listes',
  templateUrl: './listes.component.html',
  styleUrls: ['./listes.component.scss']
})
export class ListesComponent implements OnInit {
    roles: Roles = new Roles();
  constructor( private permissionsService: NgxPermissionsService) {
      const perm = JSON.parse(localStorage.getItem('roles'));
      console.log(perm)
      // this.permissionsService.loadPermissions(perm);
  }

  ngOnInit(): void {
  }

}
