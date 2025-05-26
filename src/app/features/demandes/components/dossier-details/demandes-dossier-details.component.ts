import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  DossierModuleElement,
  RecapDossierApiResponse,
} from "../../models/dossier-details";
import { DossierService } from "../../services/dossier.details.service";
import Swal from "sweetalert2"; // Import SweetAlert2
import { saveAs } from "file-saver";
@Component({
  selector: "app-demandes-dossier-details",
  templateUrl: "./demandes-dossier-details.component.html",
  styleUrls: ["./demandes-dossier-details.component.scss"],
})
export class DemandesDossierDetailsComponent implements OnInit {
  dossierId: number | null = null;
  recapDossier: RecapDossierApiResponse | null = null;
  dossierModuleElements: DossierModuleElement[] = [];
  loading = true;
  error: string | null = null;
  mode: "list" | "recherche" = "recherche";
  //origin: string = 'dpldemandes';

  constructor(
    private route: ActivatedRoute,
    private dossierService: DossierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.route.queryParams.subscribe(queryParams => {
    //   this.origin = queryParams['origin'] || 'dpldemandes'; // Get origin or set default
    // });
    this.route.params.subscribe((params) => {
      this.dossierId = +params["id"];
      this.mode = params["mode"];
      console.log(this.mode);
      if (this.dossierId) {
        this.loadRecapDossier(this.dossierId);
      } else {
        this.error = "Invalid dossier ID";
        this.loading = false;
      }
    });
  }

  loadRecapDossier(dossierId: number): void {
    this.loading = true;
    this.dossierService.getRecapDossier(dossierId).subscribe({
      next: (data: RecapDossierApiResponse) => {
        this.recapDossier = data;
        this.dossierModuleElements = data.data;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading recap dossier:", error);
        this.error = "Failed to load dossier details.";
        this.loading = false;
      },
    });
  }

  recevoirDossier(): void {
    if (this.dossierId) {
      Swal.fire({
        title: "Êtes-vous sûr?",
        text: "Voulez-vous vraiment accepter ce dossier?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, accepter!",
        cancelButtonText: "Annuler",
      }).then((result) => {
        if (result.isConfirmed) {
          this.dossierService.recevoirDossier(this.dossierId!).subscribe({
            next: () => {
              Swal.fire(
                "Accepté!",
                "Le dossier a été accepté avec succès.",
                "success"
              );
              this.loadRecapDossier(this.dossierId!);
            },
            error: (error) => {
              console.error("Erreur lors de la réception du dossier:", error);
              Swal.fire(
                "Erreur!",
                "Une erreur est survenue lors de la réception du dossier.",
                "error"
              );
            },
          });
        }
      });
    }
  }

  rejeterDossier(): void {
    if (this.dossierId) {
      Swal.fire({
        title: "Êtes-vous sûr?",
        text: "Voulez-vous vraiment rejeter ce dossier?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, rejeter!",
        cancelButtonText: "Annuler",
      }).then((result) => {
        if (result.isConfirmed) {
          this.dossierService.rejeterDossier(this.dossierId!).subscribe({
            next: () => {
              Swal.fire(
                "Rejeté!",
                "Le dossier a été rejeté avec succès.",
                "success"
              );
              this.loadRecapDossier(this.dossierId!);
            },
            error: (error) => {
              console.error("Erreur lors du rejet du dossier:", error);
              Swal.fire(
                "Erreur!",
                "Une erreur est survenue lors du rejet du dossier.",
                "error"
              );
            },
          });
        }
      });
    }
  }

  goBackToList(): void {
    console.log(this.mode);
    if (this.mode === "recherche") {
      this.router.navigate(["/recherchedemandes"]); // Navigate to RechercheDossiersComponent
    } else {
      this.router.navigate(["/demamm"]); // Navigate to DpldemandesComponent
    }
  }

  downloadFile(dossierId: number, moduleId: number, name: string): void {
    this.dossierService.downloadFile(dossierId, moduleId).subscribe((blob) => {
      saveAs(blob, `${name}_${dossierId}_${moduleId}.pdf`); // Example file name
    });
  }
  getUniqueModules(): any[] {
    const uniqueModules = [];
    const moduleMap = new Map();

    for (const element of this.dossierModuleElements) {
      const moduleLibelle = element.moduleElement.module.libelle;
      if (!moduleMap.has(moduleLibelle)) {
        moduleMap.set(moduleLibelle, element);
        uniqueModules.push(element);
      }
    }

    return uniqueModules;
  }
  downloadAllFiles(dossierId: number): void {
    this.dossierService.downloadAllFiles(dossierId).subscribe((response) => {
      // ✅ Extract filename from Content-Disposition header if available
      const contentDisposition = response.headers?.get("content-disposition");
      let fileName = `${dossierId}.zip`; // Default file name

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+?)"/);
        if (match && match[1]) {
          fileName = match[1];
        }
      }

      // ✅ Save the ZIP file
      saveAs(response.body!, fileName);
    });
  }
  filterElementsByModule(moduleLibelle: string): DossierModuleElement[] {
    return this.dossierModuleElements.filter(
      (element) => element.moduleElement.module.libelle === moduleLibelle
    );
  }
}
