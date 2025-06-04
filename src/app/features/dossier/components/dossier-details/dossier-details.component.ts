import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Examinateur,
  RecapDossierApiResponse,
  Recommendation,
  DossierModuleElement,
  Medicament,
  Laboratoire,
  Decision,
} from "../../models/dossier-details";
import { DossierService } from "../../services/dossier.details.service";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Utilisateur } from "../../../../views/pages/mauricarb-parametrage/modele/Utilisateur";

@Component({
  selector: "app-dossier-details",
  templateUrl: "./dossier-details.component.html",
  styleUrls: ["./dossier-details.component.scss"],
})
export class DossierDetailsComponent implements OnInit {
  dossierId: number | null = null;
  isUploading = false;
  uploadProgress = 0;
  showPreviewModal = false;
  previewFileUrl: string | null = null;
  previewFileName = "";
  dragOver = false;
  recapDossier: RecapDossierApiResponse | null = null;
  dossierModuleElements: DossierModuleElement[] = [];
  loading = true;
  error: string | null = null;
  mode: "list" | "recherche" = "recherche";
  userConnected: Utilisateur;
  userProfile: any;
  examinateurs: Examinateur[] = [];
  selectedExaminateurId: number | null = null;
  recommendations: Recommendation[] = [];
  selectedRecommendation: string | null = null;
  evaluationCommentaire: string = "";
  evaluationId: number | null = null;
  selectedFiles: File[] = [];
  medicamentDetails: Medicament | null = null;
  laboratoireDetails: Laboratoire | null = null;
  evaluations: Evaluation[] | null = null;
  isSubmitting: boolean = false; // This fixes the error
  conformeEchantillons: boolean;
  conformeEchantillons2: boolean = false;
  selectedRapportFiles: File[] = [];
  selectedEvaluationFiles: File[] = [];
  selectedEvaluationAdFiles: File[] = [];
  isLoadingDays: boolean = true;
  // COM Profile properties
  allDecisions: Decision[] = [];
  selectedComDecision: string | null = null;
  comDecisionCommentaire: string = "";
  nbJoursRestants: number | null = null;
  constructor(
    private route: ActivatedRoute,
    private dossierService: DossierService,
    private router: Router,
    private http: HttpClient // Inject HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.dossierId = +params["id"];
      this.mode = params["mode"];
      if (this.dossierId) {
        this.loadRecapDossier(this.dossierId);
      } else {
        this.error = "Invalid dossier ID";
        this.loading = false;
      }
    });
  }
  loadExaminateurs(): void {
    this.dossierService.getExaminateurs().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.examinateurs = response.data;
        } else {
          console.error("Failed to load examinateurs or data is missing.");
        }
      },
      error: (error) => {
        console.error("Error loading examinateurs:", error);
      },
    });
  }

  getDaysColor(days: number | null): string {
    if (days === null) return "black";
    if (days <= 2) return "red";
    if (days <= 5) return "orange";
    return "black";
  }
  // In dossier-details.component.ts
  validerEvaluations(): void {
    if (!this.dossierId) {
      console.error("Dossier ID is null");
      return;
    }

    Swal.fire({
      title: "Confirmation",
      text: "Êtes-vous sûr de vouloir valider ces évaluations?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, valider",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.dossierService.validerEvaluations(this.dossierId!).subscribe({
          next: () => {
            Swal.fire(
              "Validé!",
              "Les évaluations ont été validées avec succès.",
              "success"
            );
            // Optional: Refresh data or navigate
            this.loadRecapDossier(this.dossierId!);
          },
          error: (error) => {
            console.error("Error validating evaluations:", error);
            Swal.fire(
              "Erreur!",
              "Une erreur est survenue lors de la validation des évaluations.",
              "error"
            );
          },
        });
      }
    });
  }
  getConformeEchantillonsText(): string {
    return this.dossierModuleElements?.[0]?.dossier?.conformeEchantillons
      ? "Oui"
      : "Non";
  }

  removeFileFromList(fileList: FileList, index: string): FileList {
    const filesArray = Array.from(fileList);
    filesArray.splice(+index, 1);

    // Convert back to FileList-like object
    const dataTransfer = new DataTransfer();
    filesArray.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  }
  loadRecommendations(): void {
    this.dossierService.getAllRecommendations().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.recommendations = response.data;
        } else {
          console.error("Failed to load recommendations or data is missing.");
        }
      },
      error: (error) => {
        console.error("Error loading recommendations:", error);
        Swal.fire(
          "Erreur!",
          "Une erreur est survenue lors du chargement des recommendations.",
          "error"
        );
      },
    });
  }

  onRapportFilesSelected(event: any): void {
    this.selectedRapportFiles = Array.from(event.target.files);
    console.log("Selected rapport files:", this.selectedRapportFiles);
  }

  onEvaluationFilesSelected(event: any): void {
    this.selectedEvaluationFiles = Array.from(event.target.files);
    console.log("Selected evaluation files:", this.selectedEvaluationFiles);
  }

  onEvaluationAdFilesSelected(event: any): void {
    this.selectedEvaluationAdFiles = Array.from(event.target.files);
    console.log(
      "Selected admin evaluation files:",
      this.selectedEvaluationAdFiles
    );
  }

  downloadEvaluationReport(): void {
    if (!this.dossierId) {
      console.error("Dossier ID is null");
      return;
    }

    this.dossierService.downloadEvaluationReport(this.dossierId).subscribe(
      (response) => {
        if (response.body) {
          const contentDisposition = response.headers.get(
            "content-disposition"
          );
          let fileName = `Rapport_Evaluation_${this.dossierId}.pdf`;

          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch && filenameMatch[1]) {
              fileName = filenameMatch[1];
            }
          }

          // Create blob URL and trigger download
          const blob = new Blob([response.body], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          link.click();

          // Clean up
          window.URL.revokeObjectURL(url);
        }
      },
      (error) => {
        console.error("Error downloading evaluation report:", error);
        Swal.fire(
          "Erreur!",
          "Une erreur est survenue lors du téléchargement du rapport d'évaluation.",
          "error"
        );
      }
    );
  }
  // Load Decisions for COM Profile
  loadAllDecisions(): void {
    this.dossierService.getAllDecisions().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.allDecisions = response.data;
        } else {
          console.error("Failed to load decisions or data is missing.");
        }
      },
      error: (error) => {
        console.error("Error loading decisions:", error);
      },
    });
  }

  loadRecapDossier(dossierId: number): void {
    this.loading = true;
    const userConnectedString = localStorage.getItem("userConnected");
    this.userConnected = JSON.parse(userConnectedString) as Utilisateur;
    this.userProfile = this.userConnected.profil.code;

    // Load dossier details
    this.dossierService.getRecapDossier(dossierId).subscribe({
      next: (data: RecapDossierApiResponse) => {
        console.log("Full API response:", data);
        this.recapDossier = data;
        this.dossierModuleElements = data.data;

        // Find the first item with dossier data
        const dossierItem = data.data.find((item) => item.dossier);

        if (dossierItem) {
          this.medicamentDetails = dossierItem.dossier?.medicament || null;
          this.laboratoireDetails =
            dossierItem.dossier?.medicament?.laboratoire || null;
          this.evaluations = dossierItem.dossier?.evaluations || null;
          this.conformeEchantillons2 =
            dossierItem.dossier?.conformeEchantillons || false;
        }

        // Load remaining days counter
        this.loadRemainingDays(dossierId);

        this.loading = false;

        if (this.userProfile === "SUP") {
          this.loadExaminateurs();
        }
        if (this.userProfile === "EXA") {
          this.loadRecommendations();
        }
        if (this.userProfile === "COM") {
          this.loadAllDecisions();
        }
      },
      error: (error) => {
        console.error("Error loading recap dossier:", error);
        this.error = "Failed to load dossier details.";
        this.loading = false;
      },
    });
  }

  // Add this new method to your component

  debug(value: any) {
    console.log("DEBUG VALUE:", value);
    return true;
  }
  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
    console.log("Selected files:", this.selectedFiles);
    if (this.selectedFiles.length > 0) {
      this.validateAndProcessFile();
    }
  }

  // New helper method for validation and processing
  private validateAndProcessFile(): void {
    const file = this.selectedFiles[0];

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      Swal.fire(
        "Format invalide",
        "Seuls les fichiers PDF et Word sont acceptés",
        "warning"
      );
      this.selectedFiles = [];
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 10 * 20 * 1024 * 1024) {
      Swal.fire(
        "Fichier trop volumineux",
        "La taille maximale est de 5MB",
        "warning"
      );
      this.selectedFiles = [];
      return;
    }

    // Clear previous preview if exists
    if (this.previewFileUrl) {
      URL.revokeObjectURL(this.previewFileUrl);
    }

    // Start upload process
    this.startFileUpload();
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFiles = Array.from(files);
      this.validateAndProcessFile();
    }
  }

  private startFileUpload(): void {
    this.isUploading = true;
    this.uploadProgress = 0;

    // Simulate upload progress (replace with actual upload in production)
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this.isUploading = false;
          this.createPreviewUrl();
        }, 300);
      }
    }, 200);
  }

  private createPreviewUrl(): void {
    if (this.selectedFiles.length > 0) {
      this.previewFileUrl = URL.createObjectURL(this.selectedFiles[0]);
      this.previewFileName = this.selectedFiles[0].name;
    }
  }

  previewFile(): void {
    if (this.previewFileUrl) {
      this.showPreviewModal = true;
    }
  }

  removeFile(): void {
    if (this.previewFileUrl) {
      URL.revokeObjectURL(this.previewFileUrl);
    }
    this.selectedFiles = [];
    this.previewFileUrl = null;
    this.uploadProgress = 0;
    const fileInput = document.getElementById(
      "validationFile"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

  async submitValidation(): Promise<void> {
    if (!this.dossierId) {
      console.error("Dossier ID is null.");
      return;
    }

    if (this.selectedFiles.length === 0) {
      Swal.fire(
        "Attention!",
        "Veuillez sélectionner un fichier de rapport.",
        "warning"
      );
      return;
    }

    this.isSubmitting = true;

    try {
      const file = this.selectedFiles[0];
      const base64String = await this.readFileAsBase64(file);

      const validationData = {
        idDossier: this.dossierId,
        conformeEchantillons: this.conformeEchantillons,
        fileName: file.name,
        fichierBase64: base64String,
      };

      this.dossierService.validerConformite(validationData).subscribe({
        next: () => {
          Swal.fire(
            "Succès!",
            "La validation de conformité a été enregistrée avec succès.",
            "success"
          ).then(() => {
            this.isSubmitting = false;
            this.router.navigate(["/lncq-demandes"]);
          });
        },
        error: (error) => {
          console.error("Erreur lors de la validation:", error);
          Swal.fire(
            "Erreur!",
            "Une erreur est survenue lors de la validation.",
            "error"
          );
          this.isSubmitting = false;
        },
      });
    } catch (error) {
      console.error("Error reading file:", error);
      this.isSubmitting = false;
    }
  }

  ngOnDestroy(): void {
    if (this.previewFileUrl) {
      URL.revokeObjectURL(this.previewFileUrl);
    }
  }

  loadRemainingDays(dossierId: number): void {
    this.dossierService.getRemainingDays(dossierId).subscribe({
      next: (response: number) => {
        // Changed to number
        console.log("API Response:", response); // Should log 21
        this.nbJoursRestants = response; // Direct assignment
      },
      error: (error) => {
        console.error("Error loading remaining days:", error);
      },
    });
  }
  downloadFile(dossierId: number, moduleId: number, name: string): void {
    this.dossierService
      .downloadFile(dossierId, moduleId)
      .subscribe((response) => {
        const contentDisposition = response.headers?.get("content-disposition");
        let fileName = `${name}_${dossierId}_${moduleId}`;
        let fileExtension = "";

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+?)"/);
          if (match && match[1]) {
            fileName = match[1];
          }
        }

        saveAs(response.body, fileName);
      });
  }
  downloadFolder(dossierId: number, moduleId: number, name: string): void {
    this.dossierService
      .downloadFolder(dossierId, moduleId)
      .subscribe((response) => {
        const contentDisposition = response.headers?.get("content-disposition");
        let fileName = `${name}_${dossierId}.zip`;

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+?)"/);
          if (match && match[1]) {
            fileName = match[1];
          }
        }

        saveAs(response.body!, fileName);
      });
  }
  downloadAllFiles(dossierId: number): void {
    this.dossierService.downloadAllFiles(dossierId).subscribe((response) => {
      const contentDisposition = response.headers?.get("content-disposition");
      let fileName = `${dossierId}.zip`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+?)"/);
        if (match && match[1]) {
          fileName = match[1];
        }
      }

      saveAs(response.body!, fileName);
    });
  }

  downloadAmmFile(dossierId: number | null): void {
    if (!dossierId) {
      console.error("Dossier ID is null");
      return;
    }

    this.dossierService.downloadAmmFile(dossierId).subscribe(
      (response) => {
        const contentDisposition = response.headers?.get("content-disposition");
        let fileName = `AMM_Dossier_${dossierId}.pdf`; // Default filename

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+?)"/);
          if (match && match[1]) {
            fileName = match[1]; // Use filename from Content-Disposition if available
          }
        }

        saveAs(response.body, fileName);
      },
      (error) => {
        console.error("Error downloading AMM file:", error);
        Swal.fire(
          "Erreur!",
          "Une erreur est survenue lors du téléchargement du fichier AMM.",
          "error"
        );
      }
    );
  }

  assignerDossier(): void {
    if (this.dossierId && this.selectedExaminateurId) {
      Swal.fire({
        title: "Êtes-vous sûr?",
        text: `Voulez-vous vraiment assigner ce dossier à l'évaluateur ?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, assigner!",
        cancelButtonText: "Annuler",
      }).then((result) => {
        if (result.isConfirmed) {
          this.dossierService
            .assignerDossier(this.dossierId!, this.selectedExaminateurId!)
            .subscribe({
              next: () => {
                Swal.fire(
                  "Assigné!",
                  "Le dossier a été assigné avec succès.",
                  "success"
                );
                this.goBackToList();
              },
              error: (error) => {
                console.error(
                  "Erreur lors de l'assignation du dossier:",
                  error
                );
                Swal.fire(
                  "Erreur!",
                  "Une erreur est survenue lors de l'assignation du dossier.",
                  "error"
                );
              },
            });
        }
      });
    } else {
      Swal.fire(
        "Attention!",
        "Veuillez sélectionner un examinateur.",
        "warning"
      );
    }
  }

  recevoirDossier(): void {
    if (this.dossierId) {
      Swal.fire({
        title: "Êtes-vous sûr?",
        text: "Voulez-vous vraiment recevoir ce dossier?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui!",
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
              this.router.navigate(["/dpldemandes"]);
            },
            error: (error) => {
              console.error("Erreur lors de la réception du dossier:", error);

              // Extract the backend 'message' from the error response body
              const backendMessage =
                error?.error?.message ||
                error?.message ||
                "Une erreur est survenue lors de la réception du dossier.";

              Swal.fire("Erreur!", backendMessage, "error");
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
        input: "textarea",
        inputPlaceholder: "Entrez le motif du rejet...",
        inputAttributes: {
          "aria-label": "Motif du rejet",
        },
        showLoaderOnConfirm: true,
        preConfirm: (motifRejet) => {
          if (!motifRejet) {
            Swal.showValidationMessage("Veuillez entrer un motif de rejet.");
          }
          return motifRejet;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const motifRejet = result.value;
          this.rejeterDossierWithMotif(this.dossierId!, motifRejet);
        }
      });
    }
  }

  rejeterDossierWithMotif(dossierId: number, motifRejet: string): void {
    this.dossierService.rejeterDossier(dossierId, motifRejet).subscribe({
      next: () => {
        Swal.fire("Rejeté!", "Le dossier a été rejeté avec succès.", "success");
        this.goBackToList();
      },
      error: (error) => {
        console.error("Erreur lors du rejet du dossier:", error);
        Swal.fire(
          "Erreur!",
          "Une erreur est survenue lors de l'évaluation du dossier.",
          "error"
        );
      },
    });
  }
  goBackToList(): void {
    if (this.userProfile === "DPL" && this.mode === "recherche") {
      this.router.navigate(["/recherchedemandes"]);
    } else if (this.userProfile === "DPL") {
      this.router.navigate(["/dpldemandes"]);
    } else if (this.userProfile === "EXA") {
      this.router.navigate(["/examinateur-demandes"]);
    } else if (this.userProfile === "SUP") {
      this.router.navigate(["/superviseur-demandes"]);
    } else if (this.userProfile === "COM") {
      this.router.navigate(["/commission-demandes"]);
    } else {
      this.router.navigate(["/"]);
    }
  }

  evaluerDossier(): void {
    if (this.dossierId && this.selectedRecommendation) {
      const evaluationData = {
        idDossier: this.dossierId,
        commentaire: this.evaluationCommentaire,
        recommendation: this.selectedRecommendation,
      };

      this.dossierService.evaluerDossier(evaluationData).subscribe({
        next: (response: any) => {
          this.evaluationId = response.data;
          Swal.fire(
            "Évalué!",
            "Le dossier a été évalué avec succès.",
            "success"
          );

          // Upload all files with their types
          if (this.evaluationId) {
            this.uploadAllEvaluationDocuments(this.evaluationId);
          } else {
            this.goBackToList();
          }

          this.evaluationCommentaire = "";
          this.selectedRecommendation = null;
        },
        error: (error) => {
          console.error("Erreur lors de l'évaluation du dossier:", error);
          Swal.fire(
            "Erreur!",
            "Une erreur est survenue lors de l'évaluation du dossier.",
            "error"
          );
        },
      });
    } else {
      Swal.fire(
        "Attention!",
        "Veuillez entrer un commentaire et sélectionner une recommandation.",
        "warning"
      );
    }
  }

  async uploadAllEvaluationDocuments(evaluationId: number): Promise<void> {
    if (!this.dossierId) {
      console.error("Dossier ID is null.");
      return;
    }

    try {
      // Upload rapport files
      for (const file of this.selectedRapportFiles) {
        const base64String = await this.readFileAsBase64(file);
        await this.uploadSingleDocument(
          evaluationId,
          file,
          base64String,
          "RAPPORT_TECHNIQUE"
        );
      }

      // Upload evaluation files
      for (const file of this.selectedEvaluationFiles) {
        const base64String = await this.readFileAsBase64(file);
        await this.uploadSingleDocument(
          evaluationId,
          file,
          base64String,
          "EVALUATION_TECHNIQUE"
        );
      }

      // Upload admin evaluation files
      for (const file of this.selectedEvaluationAdFiles) {
        const base64String = await this.readFileAsBase64(file);
        await this.uploadSingleDocument(
          evaluationId,
          file,
          base64String,
          "EVALUATION_ADMINISTRATIVE"
        );
      }

      Swal.fire(
        "Succès!",
        "Tous les documents ont été téléchargés avec succès.",
        "success"
      );
      this.goBackToList();
    } catch (error) {
      console.error("Error uploading documents:", error);
      Swal.fire(
        "Erreur!",
        "Une erreur est survenue lors du téléchargement des documents.",
        "error"
      );
    }
  }

  uploadSingleDocument(
    evaluationId: number,
    file: File,
    base64String: string,
    documentType: string
  ): Promise<any> {
    const documentData = {
      idDossier: this.dossierId,
      idEvaluation: evaluationId,
      nomFichier: file.name.split(".").slice(0, -1).join("."),
      extension: file.name.split(".").pop(),
      fileBase64: base64String,
      type: documentType, // Add this field to your API if needed
    };

    return this.dossierService
      .uploadEvaluationDocument(documentData)
      .toPromise();
  }
  uploadEvaluationDocuments(evaluationId: number): void {
    if (!this.dossierId) {
      console.error("Dossier ID is null.");
      return;
    }
    if (!evaluationId) {
      console.error("Evaluation ID is null.");
      return;
    }
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      console.warn("No files selected for upload.");
      this.goBackToList();
      return;
    }

    this.selectedFiles.forEach((file) => {
      this.readFileAsBase64(file)
        .then((base64String) => {
          const documentData = {
            idDossier: this.dossierId,
            idEvaluation: evaluationId,
            nomFichier: file.name.split(".").slice(0, -1).join("."),
            extension: file.name.split(".").pop(),
            fileBase64: base64String,
          };

          this.dossierService.uploadEvaluationDocument(documentData).subscribe({
            next: (response) => {
              console.log("Document uploaded successfully:", response);
            },
            error: (error) => {
              console.error("Error uploading document:", error);
            },
            complete: () => {
              if (this.selectedFiles && this.selectedFiles.length === 1) {
                this.goBackToList();
              }
              this.selectedFiles.shift();
            },
          });
        })
        .catch((error) => {
          console.error("Error reading file:", error);
        });
    });
  }

  readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(",")[1]);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
  downloadEvaluationFiles(dossierId: number): void {
    this.dossierService
      .downloadEvaluationFiles(dossierId)
      .subscribe((response) => {
        const contentDisposition = response.headers?.get("content-disposition");
        let fileName = `Evaluation_${dossierId}.zip`;

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+?)"/);
          if (match && match[1]) {
            fileName = match[1];
          }
        }

        saveAs(response.body!, fileName);
      });
  }

  downloadEvaluationTechnique(idEvaluation: number): void {
    this.dossierService
      .downloadEvaluationTechnique(idEvaluation)
      .subscribe((response) => {
        const contentDisposition = response.headers?.get("content-disposition");
        let fileName = `Evaluation_${idEvaluation}.pdf`;

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+?)"/);
          if (match && match[1]) {
            fileName = match[1];
          }
        }

        saveAs(response.body!, fileName);
      });
  }

  downloadZipEvaluation(idEvaluation: number): void {
    this.dossierService
      .downloadZipEvaluation(idEvaluation)
      .subscribe((response) => {
        const contentDisposition = response.headers?.get("content-disposition");
        let fileName = `Evaluation_${idEvaluation}.zip`;

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+?)"/);
          if (match && match[1]) {
            fileName = match[1];
          }
        }

        saveAs(response.body!, fileName);
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

  filterElementsByModule(moduleLibelle: string): DossierModuleElement[] {
    return this.dossierModuleElements.filter(
      (element) => element.moduleElement.module.libelle === moduleLibelle
    );
  }
  // Method to call the validation endpoint for COM profile
  validerDossier(): void {
    if (this.dossierId && this.selectedComDecision) {
      const validationData = {
        idDossier: this.dossierId,
        decision: this.selectedComDecision,
        commentaires: this.comDecisionCommentaire,
      };

      this.dossierService.validerDossier(validationData).subscribe({
        next: () => {
          Swal.fire(
            "Validé!",
            "La décision du dossier a été enregistrée avec succès.",
            "success"
          ).then(() => {
            this.goBackToList(); // Redirect after success
          });
        },
        error: (error) => {
          console.error("Erreur lors de la validation du dossier:", error);

          const errorMessage =
            error.error?.message || error.message || "Erreur inconnue";

          Swal.fire("Erreur!", errorMessage, "error").then(() => {
            this.goBackToList(); // Redirect after error (when user clicks OK)
          });
        },
      });
    } else {
      Swal.fire(
        "Attention!",
        "Veuillez sélectionner une décision et entrer un commentaire.",
        "warning"
      );
    }
  }
}

// Define Evaluation Interface
export interface Evaluation {
  id: number;
  evaluateur: {
    id: number;
    login: string;
    prenom: string;
    nom: string;
  };
  dateEvaluation: string;
  commentaire: string;
  statutEvaluation: string;
  recommendation: string;
}
