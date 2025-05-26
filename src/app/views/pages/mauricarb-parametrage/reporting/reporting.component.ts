import {Component, Input, OnInit} from '@angular/core';
import {CncmpParametrageService} from "../cncmp-parametrage.service";
import {DetailTransaction} from "../modele/DetailTransaction";
import {BeanRecherche} from "../modele/beanRecherche";
import {ResultVO} from "../../../../modele/commun/ResultVO";
//import {ToastrService} from "ngx-toastr";
import {Transaction} from "../modele/Transaction";
import {Produit} from "../modele/Produit";
import {Clients} from "../modele/clients";
import {Utilisateur} from "../modele/Utilisateur";
import {UtilService} from "../../../../util/util.service";
import {DatePipe} from "@angular/common";
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as FileSaver from 'file-saver';

interface Sale {
  product: string;
  agent: string;
  client: string;
  amount: number;
  date: Date;
}

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {

  detailsJour: Transaction[] = [];
  allDetailsJour: Transaction[] = [];
  detailsMois: DetailTransaction[] = [];
  totalSalesDaily: number = 0;
  totalSalesMonthly: number = 0;
  connectionTimeByAgent: { [key: string]: number } = {};
  @Input() beanRecherche: BeanRecherche = new BeanRecherche();
  resultVO: ResultVO = new ResultVO();
  currentPage: number=0;
  pageSize: number=30;
  produits: Produit[]=[];
  clients: Clients[]=[];
  agents: Utilisateur[]=[];
  showSpin: boolean=false;

  constructor(private adminService: CncmpParametrageService,
              private utilService: UtilService,
            //  private toastr: ToastrService
            ) {}

  ngOnInit(): void {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() +1).padStart(2, '0'); // Janvier est0 !
    const year = today.getFullYear();

    this.beanRecherche.dateDebut = `${year}-${month}-${day}`;
    this.beanRecherche.dateFin = `${year}-${month}-${day}`;
    //  this.beanRecherche.dateDebut = new Date();
 //   this.beanRecherche.dateFin = new Date();
    this.getProuits();
    this.getClients();
    this.getAgents();
    this.loadDetailsJour();
  }

  loadDetailsJour(): void {
    this.adminService.getReportingDate(this.beanRecherche,  this.currentPage, this.pageSize).then(resultat => {
      this.resultVO = resultat;
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
        this.detailsJour = resultat.data as Transaction[];
        if(this.detailsJour!=null){
          console.log(this.detailsJour)
          this.detailsJour.forEach(value => {
            this.totalSalesDaily += value.pointsAjoutes;
          })
        }
      }else {
       // this.toastr.error(this.resultVO.messagesErrors[0]);
      }
    }, (error => {
      this.resultVO = error;
    }));
  }


  calculateTotals(): void {
    // Calculer le volume global des ventes journalières et mensuelles
    // et le temps de connexion par agent ici
  }

  getClients() {
    this.showSpin = true;
    this.adminService.getListClients(this.beanRecherche).then(resultat => {
      console.log(resultat);
      if (resultat) {
        this.resultVO = resultat;
        this.clients = resultat.data as Clients[];
        if(this.clients!=null){
          this.clients.forEach(value => {
            value.nomComplet = value.prenom+" "+value.nom+" ("+value.telephone+")"
          })
        }
        console.log(this.clients);
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

  private getProuits() {
    this.showSpin = true;
    this.adminService.getListProduit(this.beanRecherche).then(resultat => {
      console.log(resultat);
      if (resultat) {
        this.resultVO = resultat;
        this.produits = resultat.data as Produit[];
        console.log(this.produits);
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

  private getAgents() {
    this.showSpin = true;
    this.adminService.getListUtilisateurs(this.beanRecherche).then(resultat => {
      console.log(resultat);
      if (resultat) {
        this.resultVO = resultat;
        this.agents = resultat.data as Utilisateur[];
        if(this.agents!=null){
          this.agents.forEach(value => {
            value.nomComplet = value.prenom+" "+value.nom+" ("+value.login+")"
          })
        }
        console.log(this.agents);
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

  recherche() {
    console.log(this.beanRecherche)
    this.totalSalesDaily = 0;
    this.loadDetailsJour();
  }

  searchExport() {
    this.allDetailsJour=[];
    this.adminService.getReportingDate(this.beanRecherche,  this.currentPage, 0).then(resultat => {
      this.resultVO = resultat;
      if (!this.resultVO.messagesErrors || this.resultVO.messagesErrors.length === 0) {
        this.allDetailsJour = resultat.data as Transaction[];
        if(this.allDetailsJour!=null){
          console.log(this.detailsJour)
          this.exportExcel();
        }
      }else {
        //this.toastr.error(this.resultVO.messagesErrors[0]);
      }
    }, (error => {
      this.resultVO = error;
    }));
  }

  exportExcel() {
    var options = {
      filename: './streamed-workbook.xlsx',
      useStyles: true,
      useSharedStrings: true
    };
    let workbook = new Excel.Workbook(options);


    var worksheet0 = workbook.addWorksheet('Traces');
    worksheet0.columns = [
      { header: 'Produit', key: 'prod', width: 50 },
      { header: 'Quantité', key: 'qte', width: 10 },
      { header: 'Agent', key: 'agent', width: 40 },
      { header: 'Client', key: 'client', width: 40 },
      { header: 'Points', key: 'point', width: 40 },
      { header: 'Date operation', key: 'date', width: 40 }
    ];
    let  total0 = 0;
    this.allDetailsJour.forEach(value => {
      worksheet0.addRow({
        prod: value.details[0].produit.nom+" ("+value.details[0].produit.code+")",
        qte: value.details[0].quantite,
        agent: value.agent.prenom+" "+value.agent.nom,
        client: value.client.nom,
        point: value.pointsAjoutes,
        date: this.utilService.convertInputDateToDate(value.dateTransaction)
      });
      //  total0 = total0 + value.montant;
    });

    worksheet0.columns.forEach((sheetColumn) => {
      sheetColumn.font = {
        size: 11,
      };
      sheetColumn.width = 30;
    });

    worksheet0.getRow(1).font = {
      bold: true,
      size: 12,
    };
    worksheet0.eachRow(function (row, _rowNumber) {
      row.eachCell(function (cell, _colNumber) {
        // console.log(cell.address); // <- to see I actullay go into the cells
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    const datepipe: DatePipe = new DatePipe('en-US')
    let formattedDate = datepipe.transform(new Date(), 'dd-MM-YYYY_HH:mm:ss')
    let fileName="ventes_"+formattedDate+ ".xlsx";
    const excelBuffer: any = workbook.xlsx.writeBuffer();
    workbook.xlsx.writeBuffer()
        .then(function(buffer) {
          // done buffering
          const data: Blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          FileSaver.saveAs(data, fileName);
        });
  }
}
