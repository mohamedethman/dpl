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
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
//import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-groupes',
  templateUrl: './groupes.component.html',
  styleUrls: ['./groupes.component.scss']
})
export class GroupesComponent implements OnInit {

  @Input() newGroupe: Groupe = new Groupe();
  @Input() beanRecherche: BeanRecherche = new BeanRecherche();
  @Input() resultVO: ResultVO;
  groupes: Groupe[];
  pager: any = {};
  page = 1;
  pageSize = 15;
  // pagedItems: any[];
  showSpin = false;
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
    listAllMenuOrig : MenuItem[];
    listMenuProfil: MenuItem[];
    menuSelected:MenuItem;

  constructor(private authServiceApp: AuthenticationService,
              public adminService: CncmpParametrageService,
              private pagerService: PagerService,
              public designService: DesignService,
              private router:Router,
             // private toastr:ToastrService,
              private route:ActivatedRoute,
              private permissionsService: NgxPermissionsService,
              private modalService: NgbModal,
              private utilService: UtilService) {
      const perm = JSON.parse(localStorage.getItem('roles'));
      console.log(perm)
    //   this.permissionsService.loadPermissions(perm);
  }

  ngOnInit(): void {
    this.rechercherGroupe();
      this.designService.getAllMenu().then(resultat =>{
          this.resultVO = resultat;
          this.initializeResultVO();
          this.listAllMenuOrig = resultat.data as MenuItem[];
      }, (error => {
          this.resultVO = error;
          this.initializeResultVO();
      }));
  }

  saveGroupe() {
    console.log(this.newGroupe);
    this.adminService.ajouterGroupe(this.newGroupe).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
        //this.toastr.success('Opération Effectuée avec succés!');
        this.rechercherGroupe();
      }else{
         // this.toastr.error(this.resultVO.messagesErrors[0])
      }
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
            this.showSpin = false;
            this.rechercherGroupe();
        }, (error => {
            this.resultVO = error;
            this.initializeResultVO();
            this.showSpin = false;
        }));
    }

    deleteGroupe() {
        console.log(this.newGroupe);
        this.adminService.deleteGroupe(this.newGroupe).then(resultat => {
            this.resultVO = resultat;
            this.initializeResultVO ();
            if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
                //this.toastr.success('Opération Effectuée avec succés!');
                this.rechercherGroupe();
            }else{
                //this.toastr.error(this.resultVO.messagesErrors[0])
            }
        }, (error => {
            this.resultVO = error;
            this.initializeResultVO();
        }));
    }

  rechercherGroupe() {
    this.showSpin = true;
    this.pager = {};
    // this.pagedItems = [];
    console.log(this.beanRecherche);
    this.adminService.rechercherGroupe(this.beanRecherche).then(resultat => {
      console.log(resultat);
      if (resultat) {
        this.resultVO = resultat;
        this.groupes = resultat.data as Groupe[];
        console.log(this.groupes);
        // if (this.groupes) {
        //   this.setPage(1);
        // }
        this.showSpin = false;
      }
    }, (error => {
      if (error) {
        this.showSpin = false;
        this.resultVO.data = error.data;
        this.resultVO.messagesErrors = error.messagesErrors;
        this.resultVO.messagesInfo = error.messagesInfo;
      }
    }));
  }

  // setPage(page: number) {
  //   if (page < 1 || page > this.pager.totalPages) {
  //     return;
  //   }
  //
  //   // get pager object from service
  //   this.pager = this.pagerService.getPager(this.groupes.length, page);
  //
  //   // get current page of items
  //   this.pagedItems = this.groupes.slice(this.pager.startIndex, this.pager.endIndex + 1);
  // }

    openModalEditGroupe(content, groupe: Groupe, add: boolean) {
        if(!add){
            this.newGroupe = new Groupe();
        }else{
            this.newGroupe = groupe;
        }

        this.modalService.open(content, {scrollable: true, size:"lg"}).result.then((result) => {
            console.log('Modal closed' + result);
        }).catch((res) => {});
    }

    openModalDeleteGroupe(content, groupe: Groupe) {
        this.newGroupe = groupe;
        this.modalService.open(content, {scrollable: true}).result.then((result) => {
            console.log('Modal closed' + result);
        }).catch((res) => {});
    }

    initAjouter(){
        this.listAllMenu = [];
        this.listMenuProfil = [];
        this.newGroupe = new Groupe();
        this.estModeAjout = true;
        this.initListDrag(null);
    }

    initModifier(profilSelected:Groupe){
        this.listAllMenu = [];
        this.listMenuProfil = [];
        this.initListDrag(profilSelected);
        this.newGroupe = profilSelected;
        this.estModeAjout = false;
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "code": profilSelected.code
            }
        };
        this.router.navigate(['/parametrage/modifierprofils'], navigationExtras);
    }

    onChoisirModule(menuParent:MenuItem){
        this.menuSelected = menuParent;
    }

    private initListDrag(profilSelected:Groupe){

        if(profilSelected){
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

    activerProfil(prof:Groupe){
        if(confirm("Etês vous sûr de bien vouloir activer le profil ?")){
            this.showSpin = true;
            this.adminService.activerProfil(prof).then(resultat => {
                this.resultVO = resultat;
                this.showSpin = false;
                this.rechercherGroupe();
            }, (error => {
                this.resultVO = error;
                this.initializeResultVO();
                this.showSpin = false;
            }));
        }
    }

    desactiverProfil(prof:Groupe){
        if(confirm("Etês vous sûr de bien vouloir désactiver le profil ?")){
            this.showSpin = true;
            this.adminService.desactiverProfil(prof).then(resultat => {
                this.resultVO = resultat;
                this.showSpin = false;
                this.rechercherGroupe();
            }, (error => {
                this.resultVO = error;
                this.initializeResultVO();
                this.showSpin = false;
            }));
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
