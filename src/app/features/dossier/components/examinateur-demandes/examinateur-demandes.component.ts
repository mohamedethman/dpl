import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DossierService } from "../../services/dossier.service";
import { Dossier, ApiResponse } from "../../models/dossier";

@Component({
  selector: "app-examinateur-demandes",
  templateUrl: "./examinateur-demandes.component.html",
  styleUrls: ["examinateur-demandes.component.scss"],
})
export class ExaminateurDemandesComponent implements OnInit {
  allDossiers: Dossier[] = []; // Store all dossiers
  filteredDossiers: Dossier[] = []; // Store filtered dossiers
  displayedDossiers: Dossier[] = []; // Dossiers to display
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  loading = true;
  sortColumn: string = "dateSoumission";
  sortDirection: "asc" | "desc" = "desc";
  searchText: string = "";

  constructor(private dossierService: DossierService, private router: Router) {}

  ngOnInit(): void {
    this.loadDossiers();
  }

  loadDossiers(): void {
    this.loading = true;

    // Add pagination parameters to the request
    const params = {
      page: this.currentPage - 1, // Spring uses 0-based page index
      size: this.pageSize,
    };

    this.dossierService.getDossiersByExaminateur(params).subscribe({
      next: (response: ApiResponse) => {
        this.allDossiers = response.data;
        this.totalItems = response.totalElements || 0;
        this.applyFilterAndSort();
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading dossiers:", error);
        this.loading = false;
      },
    });
  }

  applyFilterAndSort(): void {
    // Apply filter
    let filtered = this.allDossiers;
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = this.allDossiers.filter(
        (dossier) =>
          dossier.medicament?.nomMedicament
            ?.toLowerCase()
            ?.includes(searchLower) ||
          dossier.typeDossier?.toLowerCase()?.includes(searchLower) ||
          dossier.medicament?.codeATC?.description
            ?.toLowerCase()
            ?.includes(searchLower) ||
          dossier.medicament?.dosage?.toLowerCase()?.includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const getValue = (obj: any, path: string) =>
        path.split(".").reduce((o, p) => o?.[p], obj);

      let valueA = getValue(a, this.sortColumn);
      let valueB = getValue(b, this.sortColumn);

      if (this.sortColumn === "dateSoumission") {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      valueA = valueA ?? "";
      valueB = valueB ?? "";

      if (typeof valueA !== "number" && typeof valueB !== "number") {
        valueA = String(valueA).toLowerCase();
        valueB = String(valueB).toLowerCase();
      }

      return valueA < valueB
        ? this.sortDirection === "asc"
          ? -1
          : 1
        : valueA > valueB
        ? this.sortDirection === "asc"
          ? 1
          : -1
        : 0;
    });

    this.filteredDossiers = filtered;
    this.refreshDisplayedDossiers();
  }

  refreshDisplayedDossiers(): void {
    // Since we're getting paginated data from server, just display what we received
    this.displayedDossiers = this.filteredDossiers;
  }

  onPageChange(): void {
    this.loadDossiers(); // Load new page from server
  }

  onPageSizeChange(): void {
    this.currentPage = 1; // Reset to first page when changing page size
    this.loadDossiers();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }
    this.applyFilterAndSort(); // Client-side sorting only
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadDossiers(); // Reload from server with first page
  }

  viewDetails(dossierId: number): void {
    this.router.navigate(["/dossier-details", dossierId, "list"]);
  }
}
