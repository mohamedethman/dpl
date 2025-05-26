import { Component, OnInit } from "@angular/core";
import { LaboratoiresService } from "../references/laboratoires/services/laboratoires.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-dplcomptes",
  templateUrl: "./dplcomptes.component.html",
  styleUrls: ["./dplcomptes.component.scss"],
})
export class DplcomptesComponent implements OnInit {
  displayedLaboratoires: any[] = [];
  currentPage = 1;
  pageSize = 10;
  loading = true;
  sortColumn: string = "dateEnregistrement";
  sortDirection: "asc" | "desc" = "desc";
  searchText: string = "";

  constructor(private laboratoireService: LaboratoiresService) {}

  ngOnInit(): void {
    this.loadLaboratoires();
  }

  loadLaboratoires(): void {
    this.loading = true;

    const params = {
      page: this.currentPage - 1,
      size: this.pageSize,
      sort: `${this.sortColumn},${this.sortDirection}`,
      search: this.searchText,
    };

    this.laboratoireService
      .getAllLaboratoiresNonValides(
        params.page,
        params.size,
        params.sort,
        params.search
      )
      .subscribe({
        next: (response) => {
          this.displayedLaboratoires = response.data || [];
          this.loading = false;
        },
        error: (error) => {
          console.error("Error loading laboratoires:", error);
          this.displayedLaboratoires = [];
          this.loading = false;
        },
      });
  }

  onPageChange(): void {
    this.loadLaboratoires();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadLaboratoires();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }
    this.loadLaboratoires();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadLaboratoires();
  }

  activateLaboratoire(laboratoireId: number): void {
    Swal.fire({
      title: "Confirmation",
      text: "Êtes-vous sûr de vouloir activer ce compte?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, activer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;

        this.laboratoireService.validerLaboratoire(laboratoireId).subscribe({
          next: (response) => {
            Swal.fire({
              title: "Succès!",
              text: "Compte validé avec succès",
              icon: "success",
              confirmButtonText: "OK",
            });
            this.loadLaboratoires();
          },
          error: (error) => {
            console.error("Erreur lors de la validation:", error);
            Swal.fire({
              title: "Erreur!",
              text: "Une erreur est survenue lors de la validation",
              icon: "error",
              confirmButtonText: "OK",
            });
          },
          complete: () => {
            this.loading = false;
          },
        });
      }
    });
  }

  hasData(): boolean {
    return this.displayedLaboratoires.length > 0;
  }
}
