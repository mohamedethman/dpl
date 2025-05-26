import {Component, Input, OnInit} from '@angular/core';
import {Groupe} from '../modele/groupe';
import {BeanRecherche} from '../modele/beanRecherche';
import {ResultVO} from '../../../../modele/commun/ResultVO';
import {AuthenticationService} from '../../../../service/authenticationService';
import {CncmpParametrageService} from '../cncmp-parametrage.service';
import {PagerService} from '../../../../service/pager.service';
import {UtilService} from '../../../../util/util.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
//import { SortablejsOptions } from 'ngx-sortablejs';
import {MenuItem} from '../../../layout/navbar/menu.model';
import {DesignService} from '../../../../service/design.service';
import {Roles} from "../../../layout/navbar/roles";
import {NgxPermissionsService} from "ngx-permissions";
import {ActivatedRoute, Router} from "@angular/router";
//import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-modifier-groupe',
  templateUrl: './modifier-groupe.component.html',
  styleUrls: ['./modifier-groupe.component.scss']
})
export class ModifierGroupeComponent implements OnInit {

    @Input() newGroupe: Groupe = new Groupe();
    @Input() beanRecherche: BeanRecherche = new BeanRecherche();
    @Input() resultVO: ResultVO;
    groupes: Groupe[];
    codeGroupe: string;
    pager: any = {};
    page = 1;
    pageSize = 15;
    // pagedItems: any[];
    showSpin = false;
    view = false;
    estModeAjout:boolean;
    roles: Roles = new Roles();

    color = {
        "Platinum" : "primary",
        "Gold"     : "success",
        "Silver"   : "warning"
    }
    // groupOptions : SortablejsOptions = {
    //     group			: 'testGroup',
    //     handle		: '.drag-handle',
    //     animation	: 300
    // };

    // simpleOptions : SortablejsOptions = {
    //     animation : 300
    // };
    listAllMenu : MenuItem[];
    listAllMenuOrig : MenuItem[]=[];
    listMenuProfil: MenuItem[];
    menuSelected:MenuItem;

    constructor(private authServiceApp: AuthenticationService,
                public adminService: CncmpParametrageService,
                public designService: DesignService,
                private route:ActivatedRoute,
                //private toastr: ToastrService,
                private router: Router,
                private permissionsService: NgxPermissionsService) {



        const perm = JSON.parse(localStorage.getItem('roles'));
        console.log(perm)
        // this.permissionsService.loadPermissions(perm);

    }

    ngOnInit(): void {

        this.route.queryParams.subscribe(params => {
            this.codeGroupe = params["code"];
            if (this.codeGroupe != null) {
                this.adminService.getGroupeByCode(this.codeGroupe).then(resultat =>{
                    this.resultVO = resultat;
                    this.initializeResultVO();
                    this.newGroupe = resultat.data as Groupe;
                }, (error => {
                    this.resultVO = error;
                    this.initializeResultVO();
                }));
            }
        });
        this.designService.getAllMenu().then(resultat =>{
            this.resultVO = resultat;
            this.initializeResultVO();
            this.listAllMenuOrig = resultat.data as MenuItem[];
            this.initListDrag(this.newGroupe);
        }, (error => {
            this.resultVO = error;
            this.initializeResultVO();
        }));
    }

    enregistrerProfil(){
        this.showSpin = true;
        this.construireNouveauMenu();
        let obj = {profil:this.newGroupe, listfcts:this.listMenuProfil};
        this.adminService.enregistrerProfil(obj).then(resultat => {
            this.resultVO = resultat;
            this.router.navigate(['/parametrage/profils']);
            //this.toastr.success("Opération efféctuée avec succès!")
            this.showSpin = false;
           // this.rechercherGroupe();
        }, (error => {
            this.resultVO = error;
            this.initializeResultVO();
            this.showSpin = false;
        }));
    }


    onChoisirModule(menuParent:MenuItem){
        this.menuSelected = menuParent;
    }

    private initListDrag(profilSelected:Groupe){
        console.log(this.listAllMenuOrig)
        if(profilSelected){
       //     alert(profilSelected.code)
            this.getListMenuDuProfil(profilSelected); // this.listMenuProfil
        }
        this.listAllMenu = JSON.parse(JSON.stringify(this.listAllMenuOrig)) as MenuItem[];
        this.listAllMenu = this.listAllMenu.filter(m => m.subMenus);
        for(let menu of this.listAllMenu){
            menu.childrenInProfil = [];
            menu.childrenOutProfil = [];
            if(menu.subMenus){
                for(let i=0; i< menu.subMenus.length; i++){
                    let j=0;
                    let isfound = false;
                    if(this.listMenuProfil){
                        for(; j<this.listMenuProfil.length; j++){
                            if(menu.subMenus[i].id === this.listMenuProfil[j].id){
                                menu.childrenInProfil.push(menu.subMenus[i]);
                                isfound = true;
                                menu.estParentInProfile = true;
                                break;
                            }
                        }
                        if(!isfound){
                            menu.childrenOutProfil.push(menu.subMenus[i]);
                        }
                    }else{
                        if(this.estModeAjout){
                            menu.childrenOutProfil.push(menu.subMenus[i]);
                        }
                    }
                }
            }
        }
    }

    private getListMenuDuProfil(profilSelected:Groupe){

        this.listMenuProfil = new Array();
        for(let role of profilSelected.fonctionnalites){
      //      this.listMenuProfil.push(role.refFct);
        }
    }

    construireNouveauMenu(){
        this.listMenuProfil = new Array();
        for(let menu of this.listAllMenu){
            for(let children of menu.childrenInProfil){
                this.listMenuProfil.push(children);
            }
        }
    }

    initializeResultVO() {
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
            window.scroll(0, 0);
        }
    }
}
