import {Component, Input, OnInit} from '@angular/core';
import {Utilisateur} from "../../modele/Utilisateur";
import {ActivatedRoute, Router} from "@angular/router";
import {Groupe} from "../../modele/groupe";
import {ListesService} from "../../listes/listes.service";
import {ResultVO} from "../../../../../modele/commun/ResultVO";
import {Roles} from "../../../../layout/navbar/roles";
import {NgxPermissionsService} from "ngx-permissions";
import {CncmpParametrageService} from "../../cncmp-parametrage.service";
//import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent implements OnInit {
    newUser = new Utilisateur();
    @Input() resultVO: ResultVO = new ResultVO();
    successOperation: boolean = false;
    roles: Roles = new Roles();
    profils: Groupe[];
    userConnected: Utilisateur;
    modeAjout: boolean;

  constructor(private route:ActivatedRoute,
              private permissionsService: NgxPermissionsService,
              public adminService: CncmpParametrageService,
             // private toastr: ToastrService,
              private router: Router,
              public listeService: ListesService) {
      const perm = JSON.parse(localStorage.getItem('roles'));
      // this.permissionsService.loadPermissions(perm);
  }

  ngOnInit(): void {
      this.newUser.profil = new Groupe();
      this.getListProfils();
  }

    getListProfils() {
        this.adminService.getListProfils().then(resultat => {
            this.profils = resultat.data as Groupe[];
            console.log(this.profils);
        }, (error => {
            this.resultVO = error;
            this.initializeResultVO();
        }));
    }

    saveUser() {
        console.log(this.newUser);
        this.adminService.ajouterNouveauUtilisateur(this.newUser).then(resultat => {
            this.resultVO = resultat;
            this.initializeResultVO ();
            if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
                this.router.navigate(['/parametrage/utilisateur']);
               // this.toastr.success('Compte créé avec succés!');
            }
        }, (error => {
            this.resultVO = error;
            this.initializeResultVO();
        }));
    }

    initializeResultVO () {
        if (this.resultVO == null) {
            this.resultVO = new ResultVO();
        }
        if (this.resultVO.messagesErrors == null) {
            this.resultVO.messagesErrors = [];
        }
        if (this.resultVO.messagesInfo == null) {
            this.resultVO.messagesInfo = [];
        }
        if (this.resultVO.messagesInfo.length > 0 || this.resultVO.messagesErrors.length > 0) {
            window.scroll(0,0);
        }
    }


}
