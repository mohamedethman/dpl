import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LaboratoiresService } from "../../services/laboratoires.service";
import { Laboratoire } from "../../models/laboratoires";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-laboratoires",
  templateUrl: "./laboratoires.component.html",
  styleUrls: ["./laboratoires.component.scss"],
})
export class LaboratoiresComponent implements OnInit {
  LaboratoireList: Laboratoire[] = []; // Ajout d'un tableau vide par défaut

  LaboratoireForm: FormGroup;
  selectedLaboratoire: Laboratoire | null = null;
  typeLaboratoireList: { code: string; libelle: string }[] = [];
  loading = true;
  isEditMode = false;
  searchTerm: string = "";

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;

  constructor(
    private laboratoiresService: LaboratoiresService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.LaboratoireForm = this.fb.group({
      nom: ["", Validators.required],
      code: ["", Validators.required],
      type: ["", Validators.required],
      adresse: ["", Validators.required],
      pays: ["", Validators.required],
      telephone: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      siteWeb: [""],
      contactPrincipal: [""],
      documentsAgrement: [""],
      dateEnregistrement: [""],
      statut: [""],
    });
  }

  ngOnInit(): void {
    this.loadLaboratoires();
  }

  loadLaboratoires(): void {
    this.loading = true;
    this.laboratoiresService.getAllLaboratoires().subscribe({
      next: (laboratoires: Laboratoire[]) => {
        this.LaboratoireList = laboratoires || []; // Assure que ce n'est jamais undefined
        this.totalItems = this.LaboratoireList.length;
        this.loading = false;
        console.log("Laboratoires chargés:", this.LaboratoireList);
      },
      error: (error) => {
        console.error("Erreur lors du chargement des laboratoires:", error);
        this.loading = false;
      },
    });
  }

  openModal(laboratoire?: Laboratoire): void {
    if (laboratoire) {
      this.selectedLaboratoire = laboratoire;
      this.LaboratoireForm.patchValue(laboratoire);
      this.isEditMode = true;
    } else {
      this.selectedLaboratoire = null;
      this.LaboratoireForm.reset();
      this.isEditMode = false;
    }
    const modal = document.getElementById("laboratoireModal");
    if (modal) {
      modal.style.display = "block";
    }
  }

  closeModal(): void {
    const modal = document.getElementById("laboratoireModal");
    if (modal) {
      modal.style.display = "none";
    }
  }

  saveLaboratoire(): void {
    if (this.LaboratoireForm.valid) {
      const laboratoire: Laboratoire = { ...this.LaboratoireForm.value };

      if (this.selectedLaboratoire && this.selectedLaboratoire.id) {
        // Update existing laboratoire
        laboratoire.id = this.selectedLaboratoire.id;
        this.laboratoiresService.updateLaboratoire(laboratoire).subscribe({
          next: (response) => {
            if (response.success) {
              this.loadLaboratoires();
              this.closeModal();
              this.toastr.success(response.message);
            } else {
              console.error(response.message);
              this.toastr.error(response.message);
            }
          },
          error: (error) => {
            console.error(
              "Erreur lors de la mise à jour du Laboratoire:",
              error
            );
            this.toastr.error("Erreur lors de la mise à jour du Laboratoire.");
          },
        });
      } else {
        // Add new laboratoire
        this.laboratoiresService.saveLaboratoire(laboratoire).subscribe({
          next: (response) => {
            if (response.success) {
              this.loadLaboratoires();
              this.closeModal();
              this.toastr.success(response.message);
            } else {
              console.error(response.message);
              this.toastr.error(response.message);
            }
          },
          error: (error) => {
            console.error("Erreur lors de l'ajout du Laboratoire:", error);
            this.toastr.error("Erreur lors de l'ajout du Laboratoire.");
          },
        });
      }
    } else {
      this.toastr.error("Veuillez remplir tous les champs obligatoires.");
    }
  }

  deleteLaboratoire(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer ce Laboratoire ?")) {
      this.laboratoiresService.deleteLaboratoire(id).subscribe({
        next: () => this.loadLaboratoires(),
        error: (error) => {
          console.error("Erreur lors de la suppression du Laboratoire", error);
        },
      });
    }
  }

  get filteredLaboratoireList(): Laboratoire[] {
    if (!this.searchTerm) {
      return this.LaboratoireList;
    }
    return this.LaboratoireList.filter((laboratoire) =>
      laboratoire.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedLaboratoireList(): Laboratoire[] {
    const filteredList = this.filteredLaboratoireList; // Apply filtering first
    if (!filteredList || filteredList.length === 0) {
      return [];
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filteredList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
