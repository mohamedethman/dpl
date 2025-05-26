import {Component, Input, OnInit} from '@angular/core';
import { BeanRecherche } from '../modele/beanRecherche';
import {Trace} from "../modele/Trace";
import {ResultVO} from "../../../../modele/commun/ResultVO";
import {Utilisateur} from "../modele/Utilisateur";
import {AuthenticationService} from "../../../../service/authenticationService";
import {ListesService} from "../listes/listes.service";
import {UtilService} from "../../../../util/util.service";
//import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {CncmpEnregistrementService} from "../../mauricarb-enregistrement/cncmp-enregistrement.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import HC_exporting from "highcharts/modules/exporting";
import HC_Data from "highcharts/modules/export-data";
import {CncmpParametrageService} from "../cncmp-parametrage.service";

@Component({
  selector: 'app-traces',
  templateUrl: './traces.component.html',
  styleUrls: ['./traces.component.scss']
})
export class TracesComponent implements OnInit {

  @Input() traceSelected: Trace;
  traces: Trace[] = [];
  allTraces: Trace[] = [];
  @Input() beanRecherche: BeanRecherche = new BeanRecherche();
  @Input() resultVO: ResultVO;
  userConnected: Utilisateur;
  pager: any = {};
  page = 1;
  pageSize = 30;
  showSpin = false;
  checkSearhc = false;
  currentPage: number = 0;
  totalElements: number = 0;
  totalPages: number = 0;

  constructor(private authServiceApp: AuthenticationService,
              public listeService: ListesService,
              private utilService: UtilService,
             // private toastrService: ToastrService,
              private router: Router,
              private parametrageService: CncmpParametrageService,
              private modalService: NgbModal) {
    this.userConnected = JSON.parse(localStorage.getItem('userConnected'));
    console.log(this.userConnected)
  }

  ngOnInit(): void {
    this.beanRecherche.annee = (new Date()).getFullYear();
    this.rechercherTrace();
  }

  rechercherTrace() {
    this.pager = {};
    this.traces = [];
    console.log(this.beanRecherche);
    this.showSpin = true;
    this.checkSearhc = true;

    this.parametrageService.getListeTraces(this.beanRecherche, this.currentPage, this.pageSize)
        .then(resultat => {
          console.log(resultat);
          if (resultat) {
            this.resultVO = resultat;
            this.traces = resultat.data as Trace[];
            this.totalElements = resultat.totalElements; // Assurez-vous que cela existe dans ResultVO
            this.totalPages = Math.ceil(this.totalElements / this.pageSize);
            console.log(this.traces);
          }
          this.showSpin = false;
        }, (error => {
          this.router.navigateByUrl("/auth/login");
          if (error) {
            this.showSpin = false;
            this.resultVO = error;
          }
        }));
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.rechercherTrace(); // Recharge les traces
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.rechercherTrace(); // Recharge les traces
    }
  }

  // Méthode pour changer de page
  onPageChange(page: number) {
    this.currentPage = page - 1; // ngb-pagination utilise 1-indexing
    this.rechercherTrace();
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

  exportExcel(): void{
    var options = {
      filename: './streamed-workbook.xlsx',
      useStyles: true,
      useSharedStrings: true
    };
    let workbook = new Excel.Workbook(options);


    var worksheet0 = workbook.addWorksheet('Traces');
    worksheet0.columns = [
      { header: 'Date Operation', key: 'date', width: 50 },
      { header: 'Nom Utilisateur', key: 'login', width: 10 },
      { header: 'Opération', key: 'operation', width: 40 },
      { header: 'Entité', key: 'objet', width: 40 },
      { header: 'Ref. Objet', key: 'ref', width: 40 }
    ];
    let  total0 = 0;
    this.allTraces.forEach(value => {
      worksheet0.addRow({
        date: this.utilService.formatDateT(value.dateOperation),
        login: value.login ,
        operation: value.description,
        objet: value.entite,
        ref: value.refObjet
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
    let fileName="Actions_Tracees_"+formattedDate+ ".xlsx";
    const excelBuffer: any = workbook.xlsx.writeBuffer();
    workbook.xlsx.writeBuffer()
        .then(function(buffer) {
          // done buffering
          const data: Blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          FileSaver.saveAs(data, fileName);
        });
  }

  private searchExport() {
    this.allTraces = [];
    this.showSpin = true;
    this.parametrageService.getListeTraces(this.beanRecherche, this.currentPage, 0)
        .then(resultat => {
          console.log(resultat);
          if (resultat) {
            this.resultVO = resultat;
            this.allTraces = resultat.data as Trace[];
            //  this.totalElements = resultat.totalElements; // Assurez-vous que cela existe dans ResultVO
            //  this.totalPages = Math.ceil(this.totalElements / this.pageSize);
            console.log(this.allTraces);
          }
          this.exportExcel();
          this.showSpin = false;
        }, (error => {
          this.router.navigateByUrl("/auth/login");
          if (error) {
            this.showSpin = false;
            this.resultVO = error;
          }
        }));
  }
}
