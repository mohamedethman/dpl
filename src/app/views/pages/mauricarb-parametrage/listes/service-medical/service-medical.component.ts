import {Component, Input, OnInit} from '@angular/core';
import {BeanRecherche} from "../../modele/beanRecherche";
import {ResultVO} from "../../../../../modele/commun/ResultVO";
import {AuthenticationService} from "../../../../../service/authenticationService";
import {ListesService} from "../listes.service";
import {UtilService} from "../../../../../util/util.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EntiteSante, ServiceMedical} from "../../modele/referentiels";

@Component({
  selector: 'app-service-medical',
  templateUrl: './service-medical.component.html',
  styleUrls: ['./service-medical.component.scss']
})
export class ServiceMedicalComponent implements OnInit {
  @Input() newServiceMedical: ServiceMedical = new ServiceMedical();
  @Input() serviceSelected: ServiceMedical;
  services: ServiceMedical[] = [];
  entiteSantes: EntiteSante[] = [];
  beanRecherche: BeanRecherche = new BeanRecherche();
  @Input() resultVO: ResultVO;
  modeConsultation=false;
  pager: any = {};
  page = 1;
  pageSize = 15;
  searchText: string;

  constructor(private authServiceApp: AuthenticationService,
              public listeService: ListesService,
              private utilService: UtilService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    if(this.newServiceMedical == null){
      this.newServiceMedical = new ServiceMedical();
    }
    if(this.newServiceMedical.entiteSante==null){
      this.newServiceMedical.entiteSante=new EntiteSante();
    }
    this.getListServiceMedicals();
    // this.getListmarques();
  }

  getListmarques() {
    this.listeService.getListEntiteSantes().then(resultat => {
      this.entiteSantes = resultat.data as EntiteSante[];
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }

  openModalEditServiceMedical(content, service: ServiceMedical, add: boolean) {
    if(!add){
      this.newServiceMedical = new ServiceMedical();
      this.newServiceMedical.entiteSante = new EntiteSante();
    }else{
      this.newServiceMedical = service;
    }
    this.getListmarques()

    this.modalService.open(content, {scrollable: true, size: 'lg'}).result.then((result) => {
      console.log('Modal closed' + result);
    }).catch((res) => {});
  }

  openModalDeleteServiceMedical(content, md: ServiceMedical) {
    this.newServiceMedical = md;
    this.modalService.open(content, {scrollable: true}).result.then((result) => {
      console.log('Modal closed' + result);
    }).catch((res) => {});
  }

  getListServiceMedicals() {
    this.listeService.getListServiceMedicals().then(resultat => {
      this.services = resultat.data as ServiceMedical[];
      console.log(this.services);
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }

  saveServiceMedical() {
    console.log(this.newServiceMedical);
    this.listeService.addNewServiceMedical(this.newServiceMedical).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
        this.resultVO.messagesInfo.push('Opération Effectuée avec succés!');
        this.getListServiceMedicals();
      }
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }

  deleteServiceMedical() {
    console.log(this.newServiceMedical);
    this.listeService.deleteServiceMedical(this.newServiceMedical).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
        this.resultVO.messagesInfo.push('Opération Effectuée avec succés!');
        this.getListServiceMedicals();
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
