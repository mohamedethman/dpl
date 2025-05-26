import { Component, OnInit } from "@angular/core";
import { DossierService } from "src/app/features/dossier/services/dossier.details.service";
@Component({
  selector: "app-commission",

  templateUrl: "./commission.component.html",
  styleUrl: "./commission.component.scss",
})
export class CommissionComponent implements OnInit {
  commissions: any[] = [];
  loading = false;
  error: string | null = null;
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  sortColumn: string = "numeroCommission";
  sortDirection: "asc" | "desc" = "asc";

  newCommission = {
    numeroCommission: null,
    dateOuverture: "",
    dateCloture: "",
  };

  constructor(private dossierService: DossierService) {}

  ngOnInit(): void {
    this.loadCommissions();
  }

  loadCommissions(): void {
    this.loading = true;
    this.error = null;

    this.dossierService
      .getAllCommissions(this.currentPage - 1, this.pageSize)
      .subscribe({
        next: (res) => {
          this.commissions = res.data || [];
          this.totalItems = res.totalElements || 0;
          this.applySort();
          this.loading = false;
        },
        error: (err) => {
          this.error = "Erreur lors du chargement des commissions";
          this.loading = false;
          console.error("Erreur lors du chargement des commissions", err);
        },
      });
  }

  applySort(): void {
    this.commissions.sort((a, b) => {
      const valA = a[this.sortColumn];
      const valB = b[this.sortColumn];

      if (this.sortColumn.includes("date")) {
        const dateA = new Date(valA).getTime();
        const dateB = new Date(valB).getTime();
        return this.sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      const result =
        typeof valA === "string"
          ? valA.localeCompare(valB)
          : valA < valB
          ? -1
          : valA > valB
          ? 1
          : 0;

      return this.sortDirection === "asc" ? result : -result;
    });
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }
    this.applySort();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCommissions();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadCommissions();
  }

  ouvrirCommission(): void {
    // Check if commission with same number already exists
    const existingCommission = this.commissions.find(
      (c) => c.numeroCommission === this.newCommission.numeroCommission
    );

    if (existingCommission) {
      this.error = `Une commission avec le numéro ${this.newCommission.numeroCommission} existe déjà`;
      return;
    }

    this.loading = true;
    this.dossierService.ouvrirCommission(this.newCommission).subscribe({
      next: () => {
        this.loadCommissions();
        this.newCommission = {
          numeroCommission: null,
          dateOuverture: "",
          dateCloture: "",
        };
      },
      error: (err) => {
        this.error = "Erreur lors de l'ouverture de la commission";
        this.loading = false;
        console.error("Erreur à l'ouverture", err);
      },
    });
  }

  cloturerCommission(id: number, numeroCommission: number): void {
    // Check if there's an open commission with the same number
    const openCommissionWithSameNumber = this.commissions.find(
      (c) =>
        c.numeroCommission === numeroCommission &&
        c.statut === "OUVERTE" &&
        c.id !== id
    );

    if (openCommissionWithSameNumber) {
      this.error = `Impossible de clôturer: une commission ouverte avec le numéro ${numeroCommission} existe déjà`;
      return;
    }

    this.loading = true;
    this.dossierService.cloturerCommission(id).subscribe({
      next: () => this.loadCommissions(),
      error: (err) => {
        this.error = "Erreur lors de la clôture de la commission";
        this.loading = false;
        console.error("Erreur à la clôture", err);
      },
    });
  }
}
