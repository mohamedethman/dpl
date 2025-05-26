import {Component, Input, OnInit} from '@angular/core';
import {BeanRecherche} from "../modele/beanRecherche";
import {ResultVO} from "../../../../modele/commun/ResultVO";
import {Roles} from "../../../layout/navbar/roles";
import {AuthenticationService} from "../../../../service/authenticationService";
import {CncmpParametrageService} from "../cncmp-parametrage.service";
import {ListesService} from "../listes/listes.service";
import {PagerService} from "../../../../service/pager.service";
import {UtilService} from "../../../../util/util.service";
//import {ToastrService} from "ngx-toastr";
import {NgxPermissionsService} from "ngx-permissions";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Cadeau} from "../modele/cadeau";

@Component({
  selector: 'app-cadeaux',
  templateUrl: './cadeaux.component.html',
  styleUrls: ['./cadeaux.component.scss']
})
export class CadeauxComponent implements OnInit {

  @Input() newCadeau: Cadeau = new Cadeau();
  @Input() beanRecherche: BeanRecherche = new BeanRecherche();
  listCadeau: Cadeau[];
  @Input() resultVO: ResultVO;
  pager: any = {};
  page = 1;
  pageSize = 15;
  pagedItems: any[];
  showSpin = false;
  modeAjout: boolean;
  roles: Roles = new Roles();
  estModeAjout: boolean;
  showpin1: boolean = false;

  constructor(private authServiceApp: AuthenticationService,
              public adminService: CncmpParametrageService,
              public listesService: ListesService,
              private pagerService: PagerService,
              private utilService: UtilService,
           //   private toastr: ToastrService,
              private permissionsService: NgxPermissionsService,
              private modalService: NgbModal) {
    const perm = JSON.parse(localStorage.getItem('roles'));
    console.log(perm)
    // this.permissionsService.loadPermissions(perm);
  }

  ngOnInit(): void {
    this.rechercherCadeau();
  }

  deleteCadeau() {
    console.log(this.newCadeau);
    this.adminService.deleteCadeau(this.newCadeau).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
      //  this.toastr.success('Cadeau supprimé avec succés!');
        this.rechercherCadeau();
      }else{
       // this.toastr.error(this.resultVO.messagesErrors[0])
      }
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }

  saveCadeau() {
    console.log(this.newCadeau);
    this.adminService.ajouterCadeau(this.newCadeau).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
       // this.toastr.success('Cadeau ajouté avec succés!');
        this.rechercherCadeau();
      }else {
       // this.toastr.error(this.resultVO.messagesErrors[0]);
      }
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }

  updateCadeau() {
    console.log(this.newCadeau);
    this.adminService.modifierCadeau(this.newCadeau).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
       // this.toastr.success('Cadeau modifié avec succés!');
        this.rechercherCadeau();
      }
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }

  rechercherCadeau() {
    this.showSpin = true;
    this.pager = {};
    this.pagedItems = [];
    console.log(this.beanRecherche);
    this.adminService.getListCadeau(this.beanRecherche).then(resultat => {
      console.log(resultat);
      if (resultat) {
        this.resultVO = resultat;
        this.listCadeau = resultat.data as Cadeau[];
        console.log(this.listCadeau);
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

  openModalEditCadeau(content, cadeau: Cadeau, add: boolean) {
    if(!add){
      this.modeAjout = false;
      this.newCadeau = new Cadeau();
    }else{
      this.newCadeau = cadeau;
      this.modeAjout = true;
      console.log(cadeau)
    }
    if(!this.showSpin){
      this.modalService.open(content, {scrollable: true, size: 'xl',}).result.then((result) => {
        console.log('Modal closed' + result);
      }).catch((res) => {});
    }
  }

  openModalDeleteCadeau(content, cadeau: Cadeau) {
    this.newCadeau = cadeau;
    this.modalService.open(content, {scrollable: true}).result.then((result) => {
      console.log('Modal closed' + result);
    }).catch((res) => {});
  }

  initializeResultVO () {
    if (this.resultVO == null) {
      this.resultVO = new ResultVO ();
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
