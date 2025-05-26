import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DcisService } from "../../services/dcis.service";
import { ApiResponse, Dci } from "../../models/dcis";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-dcis",
  templateUrl: "./dcis.component.html",
  styleUrls: ["./dcis.component.scss"],
})
export class DcisComponent implements OnInit {
  dciList: Dci[] = []; // Initialize as an empty array
  dciForm: FormGroup;
  selectedDci: Dci | null = null;
  typeSubstanceList: { code: string; libelle: string }[] = []; // Update the type
  loading = true; // Add a loading flag
  isEditMode = false;
  searchTerm: string = "";

  // Pagination properties
  currentPage = 1; // Current page number
  itemsPerPage = 5; // Number of items per page
  totalItems = 0; // Total number of items

  constructor(
    private dcisService: DcisService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.dciForm = this.fb.group({
      nomSubstance: ["", Validators.required],
      typeSubstance: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDcis();
    this.loadTypeSubstances();
    console.log("Total Pages:", this.totalPages); // Debugging
  }

  loadDcis(): void {
    this.loading = true;
    this.dcisService.getAllDcis().subscribe({
      next: (response: ApiResponse) => {
        this.dciList = response.content;
        this.totalItems = this.dciList.length; // Ensure this is set
        this.loading = false;
        console.log("Total Items:", this.totalItems); // Debugging
      },
      error: (error) => {
        console.error("Error loading dossiers:", error);
        this.loading = false;
      },
    });
  }

  loadTypeSubstances(): void {
    this.dcisService.getAllTypeDcis().subscribe({
      next: (types: { code: string; libelle: string }[]) => {
        this.typeSubstanceList = types; // Store both code and libelle
        console.log("Type Substances Loaded:", this.typeSubstanceList); // Debugging
      },
      error: (error) => {
        console.error(
          "Erreur lors du chargement des types de substances",
          error
        );
      },
    });
  }

  openModal(dci?: Dci): void {
    if (dci) {
      this.selectedDci = dci;
      this.dciForm.patchValue(dci);
    } else {
      this.selectedDci = null;
      this.dciForm.reset();
    }
    const modal = document.getElementById("dciModal");
    if (modal) {
      modal.style.display = "block";
    }
  }

  closeModal(): void {
    const modal = document.getElementById("dciModal");
    if (modal) {
      modal.style.display = "none";
    }
  }

  saveDci(): void {
    if (this.dciForm.valid) {
      const formValue = this.dciForm.value;
      const dci: Dci = {
        nomSubstance: formValue.nomSubstance,
        typeSubstance: formValue.typeSubstance.code, // Extract the code
      };

      if (this.selectedDci && this.selectedDci.id) {
        dci.id = this.selectedDci.id;
      }

      this.dcisService.saveDci(dci).subscribe({
        next: (response) => {
          if (response.success) {
            console.log(response.message);
            this.loadDcis();
            this.closeModal();
            this.toastr.success(response.message);
          } else {
            console.error(response.message);
            alert(response.message);
          }
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout du DCI:", error);
          alert("Erreur lors de l'ajout du DCI.");
        },
      });
    }
  }

  deleteDci(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer ce DCI ?")) {
      this.dcisService.deleteDci(id).subscribe(
        () => {
          this.loadDcis();
        },
        (error) => {
          console.error("Erreur lors de la suppression du DCI", error);
        }
      );
    }
  }

  fetchDciById(id: number): void {
    this.dcisService.getDciById(id).subscribe({
      next: (dci) => {
        this.selectedDci = dci;
        this.openModal(dci);
      },
      error: (error) => {
        console.error("Erreur lors de la récupération du DCI:", error);
      },
    });
  }

  get filteredDciList(): Dci[] {
    if (!this.searchTerm) {
      return this.dciList;
    }
    return this.dciList.filter((dci) =>
      dci.nomSubstance.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Pagination methods

  get paginatedDciList(): Dci[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredDciList.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
