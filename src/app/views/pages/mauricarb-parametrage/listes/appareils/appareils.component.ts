import {Component, Input, OnInit} from '@angular/core';
import {Appareil, EntiteSante} from "../../modele/referentiels";
import {BeanRecherche} from "../../modele/beanRecherche";
import {ResultVO} from "../../../../../modele/commun/ResultVO";
import {AuthenticationService} from "../../../../../service/authenticationService";
import {ListesService} from "../listes.service";
import {UtilService} from "../../../../../util/util.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-appareils',
  templateUrl: './appareils.component.html',
  styleUrls: ['./appareils.component.scss']
})
export class AppareilsComponent implements OnInit {
  @Input() newAppareil: Appareil = new Appareil();
  @Input() appareilSelected: Appareil;
  appareils: Appareil[] = [];
  beanRecherche: BeanRecherche = new BeanRecherche();
  @Input() resultVO: ResultVO;
  entiteSantes: EntiteSante[] = [];
  pager: any = {};
  page = 1;
  pageSize = 15;
  searchText: string;

  constructor(private authServiceApp: AuthenticationService,
              public listeService: ListesService,
              private utilService: UtilService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    if(this.newAppareil == null){
      this.newAppareil = new Appareil();
    }
    if(this.newAppareil.structure == null){
      this.newAppareil.structure = new EntiteSante();
    }
    this.getListAppareils();
  }

  formatDate(date): string {
   // console.log(date)
    let valeurs = date;
    const day = valeurs[2]; // date.getDate();
    const month = valeurs[1]; //date.getMonth() + 1; // Months are zero-based in JavaScript
    const year = valeurs[0]; //date.getFullYear();

    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }

  formatDateTime(date): string {
   // console.log(date)
    let valeurs = date;
    const sec = valeurs[5]; // date.getDate();
    const min = valeurs[4]; //date.getMonth() + 1; // Months are zero-based in JavaScript
    const heu = valeurs[3]; //date.getFullYear();
    const day = valeurs[2]; // date.getDate();
    const month = valeurs[1]; //date.getMonth() + 1; // Months are zero-based in JavaScript
    const year = valeurs[0]; //date.getFullYear();

    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} ${heu.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  getListmarques() {
    this.listeService.getListEntiteSantes().then(resultat => {
      this.entiteSantes = resultat.data as EntiteSante[];
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }

  openModalEditAppareil(content, appareil: Appareil, add: boolean) {
    if(!add){
      this.newAppareil = new Appareil();
      this.newAppareil.structure = new EntiteSante();
    }else{
      this.newAppareil = appareil;
    }
    this.getListmarques()

    this.modalService.open(content, {scrollable: true, size: 'lg'}).result.then((result) => {
      console.log('Modal closed' + result);
    }).catch((res) => {});
  }

  openModalDeleteAppareil(content, appareil: Appareil) {
    this.newAppareil = appareil;
    this.modalService.open(content, {scrollable: true}).result.then((result) => {
      console.log('Modal closed' + result);
    }).catch((res) => {});
  }

  getListAppareils() {
    this.listeService.getListAppareils().then(resultat => {
      this.appareils = resultat.data as Appareil[];
      if(!this.appareils){
        this.appareils=[]
      }
      console.log(this.appareils);
    }, (error => {
      this.resultVO = error;
      console.log(this.resultVO);
      this.initializeResultVO();
    }));
  }

  saveAppareil() {
    console.log(this.newAppareil);
    this.listeService.addNewAppareil(this.newAppareil).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
        this.resultVO.messagesInfo.push('Opération Effectuée avec succés!');
        this.getListAppareils();
      }
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }

  deleteAppareil() {
    console.log(this.newAppareil);
    this.listeService.deleteAppareil(this.newAppareil).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
        this.resultVO.messagesInfo.push('Opération Effectuée avec succés!');
        this.getListAppareils();
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
