import { Component, OnInit } from "@angular/core";
import { DossierService } from "../../../dossier/services/dossier.details.service";
// import { Dossier, ApiResponse } from "../../../dossier/models/dossier-details";
import { Router } from "@angular/router";
import { Dossier, ApiResponse } from "../../models/dossier-details";

@Component({
  selector: "app-demamm",
  templateUrl: "./demamm.component.html",
  styleUrls: ["./demamm.component.scss"],
})
export class DemammComponent implements OnInit {
  dossiers: Dossier[] = [];
  currentPage = 1;
  loading = true;
  filteredDossiers: Dossier[] = [];
  allDossiers: Dossier[] = [];
  displayedDossiers: Dossier[] = [];
  pageSize = 10;
  totalItems = 0;
  searchText = "";
  sortColumn: string = "dateSoumission";
  sortDirection: "asc" | "desc" = "desc";

  constructor(private dossierService: DossierService, private router: Router) {}

  ngOnInit(): void {
    this.loadDossiers();
  }

  loadDossiers(): void {
    this.loading = true;
    this.dossierService
      .allDossierByLabConnected(
        this.currentPage - 1, // Spring uses 0-based index
        this.pageSize
      )
      .subscribe({
        next: (response: ApiResponse) => {
          this.allDossiers = response.data || [];
          this.displayedDossiers = [...this.allDossiers];
          this.totalItems = response.totalElements || 0;
          this.applyClientSideSort(); // Apply only sorting on the current page
          this.loading = false;
        },
        error: (error) => {
          console.error("Error loading dossiers:", error);
          this.loading = false;
          this.allDossiers = [];
          this.displayedDossiers = [];
          this.totalItems = 0;
        },
      });
  }

  applyClientSideSort(): void {
    this.displayedDossiers.sort((a, b) => {
      const getValue = (obj: any, path: string) =>
        path.split(".").reduce((o, p) => o?.[p], obj);

      let valueA = getValue(a, this.sortColumn);
      let valueB = getValue(b, this.sortColumn);

      if (this.sortColumn === "dateSoumission") {
        valueA = valueA ? new Date(valueA).getTime() : 0;
        valueB = valueB ? new Date(valueB).getTime() : 0;
      }

      valueA = valueA ?? "";
      valueB = valueB ?? "";

      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
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
  }

  onPageChange(): void {
    this.loadDossiers(); // Reload data from server with new page
  }

  onPageSizeChange(): void {
    this.currentPage = 1; // Reset to first page
    this.loadDossiers(); // Reload data with new page size
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }
    this.applyClientSideSort(); // Only sort the current page data
  }

  viewDetails(dossierId: number): void {
    this.router.navigate(["/demandes-dossier-details", dossierId, "list"]);
  }

  completeDossier(dossier): void {
    this.router.navigate([
      `/complete-dossier/${dossier.id}/step/${dossier.currentStep ?? 1}`,
    ]);
  }
}
