import {Component, Input, OnInit} from '@angular/core';
import {BeanRecherche} from "../../modele/beanRecherche";
import {ResultVO} from "../../../../../modele/commun/ResultVO";
import {EntiteSante} from "../../modele/referentiels";
import {AuthenticationService} from "../../../../../service/authenticationService";
import {UtilService} from "../../../../../util/util.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ListesService} from "../listes.service";

@Component({
  selector: 'app-entite-sante',
  templateUrl: './entite-sante.component.html',
  styleUrls: ['./entite-sante.component.scss']
})
export class EntiteSanteComponent implements OnInit {
  @Input() newEntiteSante: EntiteSante = new EntiteSante();
  @Input() entiteSelected: EntiteSante;
  entites: EntiteSante[] = [];
  beanRecherche: BeanRecherche = new BeanRecherche();
  @Input() resultVO: ResultVO;
  pager: any = {};
  page = 1;
  pageSize = 15;
  searchText: string;

  constructor(private authServiceApp: AuthenticationService,
              public listeService: ListesService,
              private utilService: UtilService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    if(this.newEntiteSante == null){
      this.newEntiteSante = new EntiteSante();
    }
    this.getListEntiteSantes();
  }

  openModalEditEntiteSante(content, entite: EntiteSante, add: boolean) {
    if(!add){
      this.newEntiteSante = new EntiteSante();
    }else{
      this.newEntiteSante = entite;
    }

    this.modalService.open(content, {scrollable: true, size: 'lg'}).result.then((result) => {
      console.log('Modal closed' + result);
    }).catch((res) => {});
  }

  openModalDeleteEntiteSante(content, entite: EntiteSante) {
    this.newEntiteSante = entite;
    this.modalService.open(content, {scrollable: true}).result.then((result) => {
      console.log('Modal closed' + result);
    }).catch((res) => {});
  }

  getListEntiteSantes() {
    this.listeService.getListEntiteSantes().then(resultat => {
      this.entites = resultat.data as EntiteSante[];
      if(!this.entites){
        this.entites=[]
      }
      console.log(this.entites);
    }, (error => {
      this.resultVO = error;
      console.log(this.resultVO);
      this.initializeResultVO();
    }));
  }

  saveEntiteSante() {
    console.log(this.newEntiteSante);
    this.listeService.addNewEntiteSante(this.newEntiteSante).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
        this.resultVO.messagesInfo.push('Opération Effectuée avec succés!');
        this.getListEntiteSantes();
      }
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }

  deleteEntiteSante() {
    console.log(this.newEntiteSante);
    this.listeService.deleteEntiteSante(this.newEntiteSante).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
        this.resultVO.messagesInfo.push('Opération Effectuée avec succés!');
        this.getListEntiteSantes();
      }
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
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
