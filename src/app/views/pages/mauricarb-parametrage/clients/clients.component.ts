import {Component, Input, OnInit} from '@angular/core';
import {Clients, TypeClient} from "../modele/clients";
import {BeanRecherche} from "../modele/beanRecherche";
import {ResultVO} from "../../../../modele/commun/ResultVO";
import {Groupe} from "../modele/groupe";
import {EntiteSante} from "../modele/referentiels";
import {Roles} from "../../../layout/navbar/roles";
import {MenuItem} from "../../../layout/navbar/menu.model";
import {AuthenticationService} from "../../../../service/authenticationService";
import {CncmpParametrageService} from "../cncmp-parametrage.service";
import {ListesService} from "../listes/listes.service";
import {PagerService} from "../../../../service/pager.service";
import {UtilService} from "../../../../util/util.service";
//import {ToastrService} from "ngx-toastr";
import {NgxPermissionsService} from "ngx-permissions";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  @Input() newClient: Clients = new Clients();
  @Input() beanRecherche: BeanRecherche = new BeanRecherche();
  listClients: Clients[];
  listTypeClients: TypeClient[];
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
              public utilService: UtilService,
             // private toastr: ToastrService,
              private permissionsService: NgxPermissionsService,
              private modalService: NgbModal) {
    const perm = JSON.parse(localStorage.getItem('roles'));
    console.log(perm)
    // this.permissionsService.loadPermissions(perm);
  }

  ngOnInit(): void {
    this.getTypeClients();
    this.rechercherClient();
  }

  getTypeClients() {
    this.listesService.getTypeClients().then(resultat => {
      this.listTypeClients = resultat.data as TypeClient[];
      if(!this.listTypeClients){
        this.listTypeClients=[]
      }
      console.log(this.listTypeClients);
    }, (error => {
      this.resultVO = error;
      console.log(this.resultVO);
      this.initializeResultVO();
    }));
  }
  
  deleteClient() {
    console.log(this.newClient);
    this.adminService.deleteClient(this.newClient).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
       // this.toastr.success('Client supprimé avec succés!');
        this.rechercherClient();
      }else{
       // this.toastr.error(this.resultVO.messagesErrors[0])
      }
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }
  
  saveClient() {
    console.log(this.newClient);
    this.adminService.ajouterClient(this.newClient).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
        //this.toastr.success('Client ajouté avec succés!');
        this.rechercherClient();
      }else {
       // this.toastr.error(this.resultVO.messagesErrors[0]);
      }
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }

  updateClient() {
    console.log(this.newClient);
    this.adminService.modifierClient(this.newClient).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
       // this.toastr.success('Client modifié avec succés!');
        this.rechercherClient();
      }
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }

  rechercherClient() {
    this.showSpin = true;
    this.pager = {};
    this.pagedItems = [];
    console.log(this.beanRecherche);
    this.adminService.getListClients(this.beanRecherche).then(resultat => {
      console.log(resultat);
      if (resultat) {
        this.resultVO = resultat;
        this.listClients = resultat.data as Clients[];
        console.log(this.listClients);
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

  openModalEditClient(content, client: Clients, add: boolean) {
    if(!add){
      this.modeAjout = false;
      this.newClient = new Clients();
    }else{
      this.newClient = client;
      this.modeAjout = true;
      console.log(client)
    }
    if(!this.showSpin){
      this.modalService.open(content, {scrollable: true, size: 'xl',}).result.then((result) => {
        console.log('Modal closed' + result);
      }).catch((res) => {});
    }
  }

  openModalDeleteClient(content, client: Clients) {
    this.newClient = client;
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


  activerClient() {
    console.log(this.newClient);
    this.adminService.activerClient(this.newClient).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
       // this.toastr.success('Client est activé avec succés!');
        this.rechercherClient();
      }
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }

  desactiverClient() {
    console.log(this.newClient);
    this.adminService.desactiverClient(this.newClient).then(resultat => {
      this.resultVO = resultat;
      this.initializeResultVO ();
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
        //this.toastr.success('Utilisateur supprimé avec succés!');
        this.rechercherClient();
      }
    }, (error => {
      this.resultVO = error;
      this.initializeResultVO();
    }));
  }
}
