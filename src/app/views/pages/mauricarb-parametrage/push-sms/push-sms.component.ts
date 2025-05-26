import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {Produit} from "../modele/Produit";
import {BeanRecherche} from "../modele/beanRecherche";
import {ResultVO} from "../../../../modele/commun/ResultVO";
import {Sms} from "../modele/sms";
import {Clients} from "../modele/clients";
import {AuthenticationService} from "../../../../service/authenticationService";
import {CncmpParametrageService} from "../cncmp-parametrage.service";
import {ListesService} from "../listes/listes.service";
import {PagerService} from "../../../../service/pager.service";
import {UtilService} from "../../../../util/util.service";
//import {ToastrService} from "ngx-toastr";
import {NgxPermissionsService} from "ngx-permissions";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-push-sms',
  templateUrl: './push-sms.component.html',
  styleUrls: ['./push-sms.component.scss']
})
export class PushSmsComponent implements OnInit {

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '300',
    maxHeight: '600',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: true,
    toolbarPosition: 'top',
    // toolbarHiddenButtons: [
    //     ['bold', 'italic'],
    //     ['fontSize']
    // ]
  };
  @Input() newSms: Sms = new Sms();
  @Input() beanRecherche: BeanRecherche = new BeanRecherche();
  @Input() resultVO: ResultVO;
  clients: Clients[]=[];
  telephonesSelected: any[]=[];
  private showSpin: boolean=false;

  ngOnInit(): void {
    this.rechercherClient();
  }

  constructor(private authServiceApp: AuthenticationService,
              public adminService: CncmpParametrageService,
              public listesService: ListesService,
              private pagerService: PagerService,
              public utilService: UtilService,
             // private toastr: ToastrService,
              private permissionsService: NgxPermissionsService,
              private modalService: NgbModal) {

  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.telephonesSelected = this.clients.map(client => client.telephone);
    } else {
      this.telephonesSelected = [];
    }
  }

  isAllSelected(): boolean {
    return this.telephonesSelected.length === this.clients.length;
  }

  rechercherClient() {
    this.showSpin = true;
    this.adminService.getListClients(this.beanRecherche).then(resultat => {
      console.log(resultat);
      if (resultat) {
        this.resultVO = resultat;
        this.clients = resultat.data as Clients[];
        if(this.clients!=null)
          this.clients.forEach(value => {
            value.nomComplet = value.nom+" ("+value.telephone+")";
          })
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

  checkSms() {
    if(this.telephonesSelected==null || this.telephonesSelected.length==0){
     // this.toastr.error("Choisir les clients!");
      return false;
    }else{
      this.newSms.destinataires = this.telephonesSelected.join(';');
    }
    if(this.newSms.destinataires==null || this.newSms.destinataires.trim()==''){
     // this.toastr.error("Choisir les clients!");
      return false;
    }
    if((this.newSms.text==null || this.newSms.text.trim()=='')
        && (this.newSms.textAr==null || this.newSms.textAr.trim()=='')){
     // this.toastr.error("Saisir le texte!");
      return false;
    }
    return true;
  }

  sendMessage() {
    if(!this.checkSms()){
      return;
    }
    this.showSpin = false
    if(this.newSms.text!=null && this.newSms.text.trim()!=='')
      this.newSms.text = this.newSms.prefixe+": "+this.newSms.text
    if(this.newSms.textAr!=null && this.newSms.textAr.trim()!=='')
      this.newSms.textAr = this.newSms.prefixe+": "+this.newSms.textAr
    console.log(this.newSms);
    this.adminService.sendMessage(this.newSms).then(resultat => {
       // this.toastr.success('SMS envoyé avec succés!');
        this.showSpin=false
        this.rechercherClient();
        this.newSms = new Sms();
    }, (error => {
      this.resultVO = error;
      this.showSpin=false
    }));
  }
}
