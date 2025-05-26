// recherche-documents.component.ts
import { Component, OnInit } from "@angular/core";
import { RechercheDocumentService } from "src/app/features/dossier/services/recherche-document.service";
import { AuthenticationService } from "src/app/service/authenticationService";
import { Observable, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { Utilisateur } from "src/app/views/pages/mauricarb-parametrage/modele/Utilisateur";
import { saveAs } from "file-saver";
import { Laboratoire } from "../../models/dossier-details";
import {
  Document,
  RechercheDocumentRequest,
} from "../../models/recherche-document";

@Component({
  selector: "app-rechercher-documents",
  templateUrl: "./rechercher-documents.component.html",
  styleUrl: "./rechercher-documents.component.scss",
})
export class RechercherDocumentsComponent implements OnInit {
  documents: Document[] = [];
  loading = false;
  error: string | null = null;
  userProfile: string;
  userConnected: Utilisateur;
  hasSearched = false; // Track if search has been performed
  sortColumn: string = "nomMedicament"; // Default sort column
  sortDirection: "asc" | "desc" = "asc"; // Default sort direction
  allDocuments: Document[] = []; // Store all fetched documents for client-side sorting

  // Filters
  selectedLaboratoire: number | null = null;
  selectedDocumentType: string | null = null; // Initialize as null
  laboratoires: Laboratoire[] = [];

  documentTypes = [
    { code: "AMM", libelle: "AMM" },
    { code: "DECISION", libelle: "Décision" },
    { code: "ACCUSE", libelle: "Accusé" },
  ];

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  pageSizeOptions = [5, 10, 25, 50];

  constructor(
    private documentService: RechercheDocumentService,
    private authService: AuthenticationService
  ) {
    const userConnectedString = localStorage.getItem("userConnected");
    this.userConnected = JSON.parse(userConnectedString) as Utilisateur;
    this.userProfile = this.userConnected.profil.code;
  }

  ngOnInit(): void {
    if (this.userProfile === "DPL") {
      this.loadLaboratoires();
    }
  }

  loadLaboratoires(): void {
    this.documentService
      .getAllLaboratoires(
        this.currentPage - 1, // Spring uses 0-based index
        this.pageSize
      )
      .subscribe({
        next: (laboratoires) => {
          this.laboratoires = laboratoires;
        },
        error: (error) => {
          console.error("Error loading laboratoires:", error);
        },
      });
  }

  searchDocuments(): void {
    if (!this.selectedDocumentType) {
      this.error = "Veuillez sélectionner un type de document";
      return;
    }

    this.loading = true;
    this.hasSearched = true;
    this.error = null;

    const request: RechercheDocumentRequest = {
      typeDocument: this.selectedDocumentType,
      page: this.currentPage - 1, // Send page to backend
      size: this.pageSize, // Send page size to backend
      ...(this.userProfile === "DPL" &&
        this.selectedLaboratoire && {
          id: this.selectedLaboratoire,
        }),
    };

    this.documentService.searchDocuments(request).subscribe({
      next: (response) => {
        // Store ONLY the current page's data
        this.documents = response.data || [];
        this.totalItems = response.totalElements || 0; // Use server's total count
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      },
    });
  }

  applyClientSideSort(): void {
    this.allDocuments.sort((a, b) => {
      // Get values for sorting
      const valueA = this.getSortValue(a, this.sortColumn);
      const valueB = this.getSortValue(b, this.sortColumn);

      // Handle null/undefined values
      if (valueA == null) return 1;
      if (valueB == null) return -1;

      // Special handling for dates
      if (this.sortColumn === "dateAutorisation") {
        const dateA = new Date(valueA).getTime();
        const dateB = new Date(valueB).getTime();
        return this.sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      // Default string comparison
      if (typeof valueA === "string" && typeof valueB === "string") {
        return this.sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      // Numeric comparison
      return this.sortDirection === "asc"
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number);
    });
  }

  private getSortValue(document: Document, column: string): any {
    switch (column) {
      case "nomMedicament":
        return document.nomMedicament;
      case "entiteEmetrice":
        return document.entiteEmetrice;
      case "dateAutorisation":
        return document.dateAutorisation;
      default:
        return null;
    }
  }

  private updateDisplayedDocuments(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.documents = this.allDocuments.slice(startIndex, endIndex);
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }
    this.applyClientSideSort();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.searchDocuments(); // Fetch new page from server
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.searchDocuments(); // Fetch first page with new size
  }

  downloadDocument(document: Document): void {
    this.loading = true;
    let download$: Observable<Blob>;
    let filenamePrefix: string;

    switch (this.selectedDocumentType) {
      case "AMM":
        download$ = this.documentService.downloadAMM(document.idDossier);
        filenamePrefix = "amm";
        break;
      case "DECISION":
        download$ = this.documentService.downloadDecision(document.idDossier);
        filenamePrefix = "decision";
        break;
      case "ACCUSE":
        download$ = this.documentService.downloadAccuse(document.idDossier);
        filenamePrefix = "accuse";
        break;
      default:
        console.error("Type de document non supporté");
        this.loading = false;
        return;
    }

    download$.subscribe({
      next: (blob) => {
        // Create a safer download implementation
        this.safeDownload(
          blob,
          `${filenamePrefix}-${document.nomMedicament}-${document.idDossier}.pdf`
        );
        this.loading = false;
      },
      error: (err) => {
        console.error("Download error:", err);
        this.error =
          err.message ||
          "Échec du téléchargement. Veuillez réessayer plus tard.";
        this.loading = false;
      },
    });
  }

  // Add this helper method to your component
  private safeDownload(blob: Blob, filename: string): void {
    try {
      // Create a temporary anchor element
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";

      // Add to DOM, trigger click, then remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      this.error = "Erreur technique lors du téléchargement";
    }
  }

  getDocumentTypeLabel(typeCode: string | null): string {
    if (!typeCode) return "-";
    const type = this.documentTypes.find((t) => t.code === typeCode);
    return type ? type.libelle : typeCode;
  }

  onDocumentTypeChange(): void {
    this.currentPage = 1;
    this.searchDocuments();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.searchDocuments();
  }

  formatDate(date: string | null): string {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  }
}
