import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AtcsService } from "../../services/atcs.service";
import { ApiResponse, Atc } from "../../models/atcs";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-atcs",
  templateUrl: "./atcs.component.html",
  styleUrls: ["./atcs.component.scss"],
})
export class AtcsComponent implements OnInit {
  atcList: Atc[] = []; // Initialize as an empty array
  atcForm: FormGroup;
  selectedAtc: Atc | null = null;
  typeSubstanceList: { code: string; libelle: string }[] = []; // Update the type
  loading = true; // Add a loading flag
  isEditMode = false;
  searchTerm: string = "";

  // Pagination properties
  currentPage = 1; // Current page number
  itemsPerPage = 5; // Number of items per page
  totalItems = 0; // Total number of items

  constructor(
    private atcsService: AtcsService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.atcForm = this.fb.group({
      codeATC: ["", Validators.required],
      description: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAtcs();

    console.log("Total Pages:", this.totalPages); // Debugging
  }

  loadAtcs(): void {
    this.loading = true;
    this.atcsService.getAllAtcs().subscribe({
      next: (response: ApiResponse) => {
        if (response.data) {
          this.atcList = response.data; // Assurez-vous que les données sont bien stockées
          this.totalItems = this.atcList.length; // Corrigez la valeur totale des éléments
        } else {
          this.atcList = [];
          this.totalItems = 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error("Erreur lors du chargement des ATC:", error);
        this.loading = false;
      },
    });
  }
  openModal(atc?: Atc): void {
    this.isEditMode = !!atc;
    this.selectedAtc = atc || null;

    if (atc) {
      this.atcForm.patchValue(atc);
    } else {
      this.atcForm.reset();
    }

    const modal = document.getElementById("atcModal");
    if (modal) {
      modal.style.display = "block";
    }
  }

  closeModal(): void {
    const modal = document.getElementById("atcModal");
    if (modal) {
      modal.style.display = "none";
    }
  }

  saveAtc(): void {
    if (this.atcForm.valid) {
      const atc: Atc = this.atcForm.value;

      if (this.isEditMode && this.selectedAtc) {
        atc.id = this.selectedAtc.id;
        this.updateAtc(atc);
      } else {
        this.atcsService.saveAtc(atc).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success("ATC ajouté avec succès !");
              this.loadAtcs();
              this.closeModal();
            } else {
              this.toastr.error("Erreur: " + response.message);
            }
          },
          error: (error) => {
            console.error("Erreur lors de l'ajout du ATC:", error);
            this.toastr.error("Échec de l'ajout du ATC.");
          },
        });
      }
    }
  }

  updateAtc(atc: Atc): void {
    this.atcsService.updateAtc(atc).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success("ATC mis à jour avec succès !");
          this.loadAtcs();
          this.closeModal();
        } else {
          this.toastr.error("Erreur: " + response.message);
        }
      },
      error: (error) => {
        console.error("Erreur lors de la mise à jour du ATC:", error);
        this.toastr.error("Échec de la mise à jour.");
      },
    });
  }

  deleteAtc(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer cet ATC ?")) {
      this.atcsService.deleteAtc(id).subscribe({
        next: () => {
          this.toastr.success("ATC supprimé avec succès !");
          this.loadAtcs();
        },
        error: (error) => {
          console.error("Erreur lors de la suppression du ATC", error);
          this.toastr.error("Échec de la suppression.");
        },
      });
    }
  }

  get filteredAtcList(): Atc[] {
    if (!this.searchTerm) {
      return this.atcList;
    }
    return this.atcList.filter((atc) =>
      atc.codeATC.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  // Pagination
  get paginatedAtcList(): Atc[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAtcList.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return this.totalItems > 0
      ? Math.ceil(this.totalItems / this.itemsPerPage)
      : 1;
  }
}
