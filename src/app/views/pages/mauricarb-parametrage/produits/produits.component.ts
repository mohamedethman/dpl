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
import {Produit} from "../modele/Produit";

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.scss']
})
export class ProduitsComponent implements OnInit {

  @Input() newProduit: Produit = new Produit();
  @Input() beanRecherche: BeanRecherche = new BeanRecherche();
  listProduit: Produit[];
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
             // private toastr: ToastrService,
              private permissionsService: NgxPermissionsService,
              private modalService: NgbModal) {
    const perm = JSON.parse(localStorage.getItem('roles'));
    console.log(perm)
    // this.permissionsService.loadPermissions(perm);
  }

  ngOnInit(): void {
    this.rechercherProduit();
  }

  deleteProduit() {
    console.log(this.newProduit);
    this.adminService.deleteProduit(this.newProduit).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
      //  this.toastr.success('Produit supprimé avec succés!');
        this.rechercherProduit();
      }else{
       // this.toastr.error(this.resultVO.messagesErrors[0])
      }
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }

  checkProduit() {
    if(this.newProduit.code==null || this.newProduit.code.trim()==''){
      //this.toastr.error("Saisir le code produit!");
      return true;
    }if(this.newProduit.nom==null || this.newProduit.nom.trim()==''){
     // this.toastr.error("Saisir le nom produit!");
      return true;
    }
    return false;
  }

  saveProduit() {
    console.log(this.newProduit);
    if(this.checkProduit()){
      return;
    }
    this.adminService.ajouterProduit(this.newProduit).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
        this.modalService.dismissAll();
        //this.toastr.success('Produit ajouté avec succés!');
        this.rechercherProduit();
      }else {
        //this.toastr.error(this.resultVO.messagesErrors[0]);
      }
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }

  updateProduit() {
    console.log(this.newProduit);
    if(this.checkProduit()){
      return;
    }
    this.adminService.modifierProduit(this.newProduit).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
        this.modalService.dismissAll();
        //this.toastr.success('Produit modifié avec succés!');
        this.rechercherProduit();
      }
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }

  rechercherProduit() {
    this.showSpin = true;
    this.pager = {};
    this.pagedItems = [];
    console.log(this.beanRecherche);
    this.adminService.getListProduit(this.beanRecherche).then(resultat => {
      console.log(resultat);
      if (resultat) {
        this.resultVO = resultat;
        this.listProduit = resultat.data as Produit[];
        console.log(this.listProduit);
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

  openModalEditProduit(content, produit: Produit, add: boolean) {
    if(!add){
      this.modeAjout = false;
      this.newProduit = new Produit();
    }else{
      this.newProduit = produit;
      this.modeAjout = true;
      console.log(produit)
    }
    if(!this.showSpin){
      this.modalService.open(content, {scrollable: true, size: 'xl',}).result.then((result) => {
        console.log('Modal closed' + result);
      }).catch((res) => {});
    }
  }

  openModalDeleteProduit(content, produit: Produit) {
    this.newProduit = produit;
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
