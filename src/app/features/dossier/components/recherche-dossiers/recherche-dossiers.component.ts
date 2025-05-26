import { Component, Inject, LOCALE_ID, OnInit } from "@angular/core";
import { RechercheDossierService } from "../../services/recherche.dossier.service";
import { Dossier, DossierApiResponse } from "../../models/recherche.dossier";
import { Router } from "@angular/router";
import localeFr from "@angular/common/locales/fr";
import { DatePipe, registerLocaleData } from "@angular/common";
import { Subject, of } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  catchError,
} from "rxjs/operators";
import {
  NgbDateStruct,
  NgbCalendar,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";

registerLocaleData(localeFr, "fr");

@Component({
  selector: "app-recherche-dossiers",
  templateUrl: "./recherche-dossiers.component.html",
  styleUrls: ["./recherche-dossiers.component.scss"],
  providers: [DatePipe],
})
export class RechercheDossiersComponent implements OnInit {
  idLaboratoire: number | null = null;
  idMedicament: number | null = null;
  selectedStatut: string | null = null;
  dateSoumissionDebut: NgbDateStruct | null = null;
  dateSoumissionFin: NgbDateStruct | null = null;
  dossiers: Dossier[] = [];
  loading = false;
  error: string | null = null;

  laboratoireSuggestions: any[] = [];
  medicamentSuggestions: any[] = [];
  statutOptions: any[] = [];

  laboratoireSearchTerm: string = "";
  medicamentSearchTerm: string = "";

  selectedLaboratoireName: string = "";
  selectedMedicamentName: string = "";

  laboratoireSearchTerm$ = new Subject<string>();
  medicamentSearchTerm$ = new Subject<string>();
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  pageSizeOptions: number[] = [1, 5, 10, 20, 25];

  constructor(
    private dossierService: RechercheDossierService,
    private router: Router,
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) public locale: string,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {}

  ngOnInit(): void {
    this.loadStatutOptions();

    this.laboratoireSearchTerm$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => (this.laboratoireSuggestions = [])),
        switchMap((term: string) =>
          this.dossierService.autocompleteLaboratoires(term).pipe(
            catchError((error) => {
              console.error("Autocomplete Labs error:", error);
              return of({ data: [] });
            })
          )
        )
      )
      .subscribe((response) => (this.laboratoireSuggestions = response.data));

    this.medicamentSearchTerm$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => (this.medicamentSuggestions = [])),
        switchMap((term: string) =>
          this.dossierService.autocompleteMedicaments(term).pipe(
            catchError((error) => {
              console.error("Autocomplete Medicaments error:", error);
              return of({ data: [] });
            })
          )
        )
      )
      .subscribe((response) => (this.medicamentSuggestions = response.data));

    this.searchDossiers();
  }

  loadStatutOptions(): void {
    this.dossierService.getAllStatut().subscribe({
      next: (data) => {
        this.statutOptions = data.data.filter(
          (statut) => statut.code !== "DRAFT"
        );
      },
      error: (error) => {
        console.error("Error loading statut options:", error);
      },
    });
  }

  searchDossiers(): void {
    this.loading = true;
    this.error = null;

    const dateDebutFormatted = this.dateSoumissionDebut
      ? this.formatter.format(this.dateSoumissionDebut)
      : null;
    const dateFinFormatted = this.dateSoumissionFin
      ? this.formatter.format(this.dateSoumissionFin)
      : null;

    const pageIndex = this.currentPage - 1;

    this.dossierService
      .searchDossiers(
        this.idLaboratoire,
        this.idMedicament,
        this.selectedStatut,
        dateDebutFormatted,
        dateFinFormatted,
        pageIndex,
        this.pageSize
      )
      .subscribe({
        next: (response: DossierApiResponse) => {
          this.loading = false;
          this.dossiers = response.data || [];
          this.totalItems = response.totalElements ?? 0;

          if (response.messagesErrors?.length > 0) {
            this.error = response.messagesErrors
              .map((e) => e.libelle || "Erreur non spécifiée")
              .join(", ");
          }
        },
        error: (err: Error) => {
          this.loading = false;
          this.dossiers = [];
          this.totalItems = 0;
          this.error =
            err.message ||
            "Une erreur technique est survenue lors de la recherche.";
        },
      });
  }

  onSearch(): void {
    // Check for invalid laboratoire
    if (this.laboratoireSearchTerm && !this.idLaboratoire) {
      this.dossiers = [];
      this.totalItems = 0;
      this.loading = false;
      return;
    }

    // Check for invalid medicament
    if (this.medicamentSearchTerm && !this.idMedicament) {
      this.dossiers = [];
      this.totalItems = 0;
      this.loading = false;
      return;
    }

    this.currentPage = 1;
    this.searchDossiers();
  }

  viewDetails(dossierId: number): void {
    this.router.navigate(["/dossier-details", dossierId, "recherche"]);
  }

  onLaboratoireSearch(term: string): void {
    this.laboratoireSearchTerm = term;
    this.laboratoireSearchTerm$.next(term);
    if (this.idLaboratoire && this.selectedLaboratoireName !== term) {
      this.idLaboratoire = null;
    }
  }

  onMedicamentSearch(term: string): void {
    this.medicamentSearchTerm = term;
    this.medicamentSearchTerm$.next(term);
    if (this.idMedicament && this.selectedMedicamentName !== term) {
      this.idMedicament = null;
    }
  }

  selectLaboratoire(laboratoire: any): void {
    this.idLaboratoire = laboratoire.id;
    this.selectedLaboratoireName = laboratoire.nom;
    this.laboratoireSearchTerm = laboratoire.nom;
    this.laboratoireSuggestions = [];
    this.searchDossiers();
  }

  selectMedicament(medicament: any): void {
    this.idMedicament = medicament.id;
    this.selectedMedicamentName = medicament.nomMedicament;
    this.medicamentSearchTerm = medicament.nomMedicament;
    this.medicamentSuggestions = [];
    this.searchDossiers();
  }

  clearLaboratoire(): void {
    this.idLaboratoire = null;
    this.selectedLaboratoireName = "";
    this.laboratoireSearchTerm = "";
    this.laboratoireSuggestions = [];
    this.searchDossiers();
  }
  resetSearch(): void {
    this.idLaboratoire = null;
    this.idMedicament = null;
    this.selectedStatut = null;
    this.dateSoumissionDebut = null;
    this.dateSoumissionFin = null;
    this.laboratoireSearchTerm = "";
    this.medicamentSearchTerm = "";
    this.selectedLaboratoireName = "";
    this.selectedMedicamentName = "";
    this.currentPage = 1;
    this.searchDossiers();
  }
  clearMedicament(): void {
    this.idMedicament = null;
    this.selectedMedicamentName = "";
    this.medicamentSearchTerm = "";
    this.medicamentSuggestions = [];
    this.searchDossiers();
  }

  onStatutChange(event: any): void {
    this.selectedStatut = event.target.value === "" ? null : event.target.value;
    this.searchDossiers();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.searchDossiers();
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.searchDossiers();
  }
}
