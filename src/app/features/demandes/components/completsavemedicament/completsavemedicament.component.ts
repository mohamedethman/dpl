import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { DmmService } from "../../services/dmm.service";
import { Step, ApiResponse } from "../../models/step.model"; // Import ApiResponse interface
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { DossierService } from "../../services/dossier.details.service";
import { saveAs } from "file-saver";
import {
  DossierModuleElement,
  RecapDossierApiResponse,
} from "../../models/dossier-details";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router"; // ✅ Import Router
import Swal from "sweetalert2"; // Import SweetAlert2
import { first } from "rxjs/operators"; // ✅ Add this line
import {
  HttpClient,
  HttpEventType,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";

@Component({
  selector: "app-completsavemedicament",
  templateUrl: "./completsavemedicament.component.html",
  styleUrls: ["./completsavemedicament.component.scss"],
})
export class CompletsavemedicamentComponent implements OnInit {
  // Array to hold the steps
  selectedIndex: number = 0; // Current selected step index
  steps: Step[] = [];
  formGroups: UntypedFormGroup[] = []; // Array to hold the FormGroups for each step
  medicamentForm: UntypedFormGroup; // FormGroup for Medicament
  isMedicamentSubmitted: boolean = false; // Flag to toggle between medicament form and wizard steps
  isOtherDCISelected: boolean = false; // Ajout de la propriété
  isOtherATCSelected: boolean = false;
  idDossier: string | null = null;
  recapData: any = {}; // To store the recap data from the API
  stepSaved: boolean[] = [];
  currentStep: number | null = null;
  stepsLoaded: boolean = false;
  loading = true;
  error: string | null = null;
  dossierId: number | null = null;
  recapDossier: RecapDossierApiResponse | null = null;
  dossierModuleElements: DossierModuleElement[] = [];
  uploadStatus: {
    [key: string]:
      | "pending"
      | "reading"
      | "uploading"
      | "success"
      | "error"
      | null;
  } = {};
  uploadProgress: {
    [key: string]: {
      percent: number;
      loaded: number;
      total: number;
    };
  } = {};

  currentUploads: { [key: string]: File } = {};
  isConverting: boolean = false;
  currentUploadElement: any = null;
  // Dropdown data
  atcCodes: string[] = [];
  conditionnements: string[] = [];
  voiesAdministration: string[] = [];
  dosages: string[] = [];
  formesPharmaceutiques: string[] = [];
  // dcis: string[] = [];
  dcis$: Observable<any[]> = of([]); // ✅ Observable for DCI suggestions

  constructor(
    private fb: UntypedFormBuilder,
    private dossierService: DossierService,
    private toastr: ToastrService,
    private http: HttpClient,
    // private toastr: ToastrService,
    private router: Router, // ✅ Inject Router
    private route: ActivatedRoute,

    private dmmService: DmmService
  ) {
    this.medicamentForm = this.fb.group({
      nom_medicament: ["", Validators.required],
      dosage: ["", Validators.required],
      forme_pharmaceutique: ["", Validators.required],
      voie_administration: ["", Validators.required],
      code_atc: [""],
      autreAtc: [""],
      dci: [""],
      autreDci: [""],
      conditionnement: ["", Validators.required],
    });
  }

  // Add a flag to track if steps are loaded

  // Call getRecapData() when navigating to the recap step
  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.idDossier = params.get("id");
          const newCurrentStep = +params.get("currentStep");
          this.currentStep = newCurrentStep;
          this.selectedIndex = this.currentStep - 1;

          if (this.idDossier) {
            return this.dmmService.getSteps().pipe(
              tap((stepsResponse: ApiResponse) => {
                if (stepsResponse?.data) {
                  this.steps = stepsResponse.data.map((step) => ({
                    ...step,
                    elements: step.moduleElements || [],
                  }));
                  this.initializeForms();
                  this.fetchCurrentStepData(); // Fetch data for all steps up to the current step

                  // // Fetch recap data if on the recap step
                  // if (this.selectedIndex === this.steps.length) {
                  //   this.getRecapData();
                  // }
                }
              })
            );
          } else {
            return of(null);
          }
        })
      )
      .subscribe();
  }

  fetchAllStepsData() {
    if (!this.idDossier) {
      console.error("❌ idDossier is null or undefined");
      return;
    }

    console.log("✅ Fetching data for all steps...");

    this.steps.forEach((step, index) => {
      console.log(`✅ Fetching data for step ${index + 1}:`, step);
      this.dmmService
        .getElementsAndElementsData(this.idDossier, step.id)
        .subscribe((response: ApiResponse) => {
          console.log(`✅ Step ${index + 1} API Response:`, response);
          if (response?.data) {
            const stepFormGroup = this.formGroups[index];
            const formValues: { [key: string]: any } = {};

            response.data.forEach((item: any) => {
              const elementName = item.moduleElement.nomElement;
              const value =
                item.moduleElement.typeElement === "FICHIER"
                  ? item.fichier
                  : item.contenuTexte;

              formValues[elementName] = value;
            });

            console.log(
              `✅ Populating form for step ${index + 1}:`,
              formValues
            );
            stepFormGroup.patchValue(formValues, { emitEvent: false }); // Populate form data for this step
          } else {
            console.error(`❌ No data found for step ${index + 1}`);
          }
        });
    });
  }

  initializeForms() {
    if (this.formGroups.length > 0) {
      console.log("✅ Forms already initialized.");
      return; // Avoid re-initializing forms
    }

    this.steps.forEach((step) => {
      const group = this.fb.group({});

      step.moduleElements.forEach((element) => {
        if (
          element.typeElement === "TEXTAREA" ||
          element.typeElement === "TEXTE"
        ) {
          group.addControl(
            element.nomElement,
            this.fb.control("", Validators.required)
          );
        } else if (element.typeElement === "FICHIER") {
          group.addControl(element.nomElement, this.fb.control(null));
        }
      });

      this.formGroups.push(group);
    });

    console.log("✅ Form Groups Initialized:", this.formGroups);
  }

  fetchCurrentStepData() {
    if (!this.idDossier || !this.currentStep || !this.steps?.length) return;

    console.log(
      "🔍 Starting fetchCurrentStepData with step:",
      this.currentStep
    );

    this.dossierService.getRecapDossier(Number(this.idDossier)).subscribe({
      next: (recapResponse: RecapDossierApiResponse) => {
        const dossier = recapResponse?.data?.[0]?.dossier;
        const isRenouvellement = dossier?.renouvellement === true;

        console.log("🔁 Renouvellement status:", isRenouvellement);

        // Étapes à traiter selon le renouvellement
        const stepsToProcess = isRenouvellement
          ? this.steps.slice(0, 2)
          : this.steps;

        // Trouver l'étape actuelle dans stepsToProcess
        const currentStep = stepsToProcess.find(
          (_, i) => i === this.currentStep - 1
        );

        if (!currentStep) {
          console.warn(
            `⚠️ Step ${this.currentStep} is not in the allowed steps (renouvellement = ${isRenouvellement})`
          );
          return;
        }

        console.log("📦 Fetching elements for currentStep ID:", currentStep.id);

        this.dmmService
          .getElementsAndElementsData(this.idDossier, currentStep.id)
          .subscribe((response: ApiResponse) => {
            if (response?.data) {
              response.data.forEach((item: any) => {
                const elementName = item.moduleElement.nomElement;
                const value =
                  item.moduleElement.typeElement === "FICHIER"
                    ? item.fichier
                    : item.contenuTexte;

                // Toujours utiliser this.steps pour retrouver le bon index du formGroup
                const stepIndex = this.steps.findIndex(
                  (s) => s.id === item.moduleElement.module.id
                );

                if (stepIndex !== -1) {
                  const stepFormGroup = this.formGroups[stepIndex];
                  if (stepFormGroup) {
                    stepFormGroup
                      .get(elementName)
                      ?.setValue(value, { emitEvent: false });
                  }
                }
              });
            }
          });
      },
      error: (error) => {
        console.error(
          "❌ Error checking renouvellement in fetchCurrentStepData:",
          error
        );
      },
    });
  }

  loadRecapDossier(dossierId: number): void {
    this.loading = true;
    this.dossierService.getRecapDossier(dossierId).subscribe({
      next: (data: RecapDossierApiResponse) => {
        console.log("API Response:", data); // Debugging log
        this.recapDossier = data;
        this.dossierModuleElements = data.data;
        console.log("Dossier Module Elements:", this.dossierModuleElements); // Debugging log
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading recap dossier:", error);
        this.error = "Failed to load dossier details.";
        this.loading = false;
      },
    });
  }
  // Update goForward() to use correct step ID when navigating
  goBack() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--; // Move to the previous step
      this.currentStep = this.selectedIndex + 1;
      this.router.navigate([
        "/complete-dossier",
        this.idDossier,
        "step",
        this.currentStep,
      ]);
    }
  }

  goForward() {
    if (this.selectedIndex < this.steps.length - 1) {
      const currentStepIndex = this.selectedIndex;
      if (this.formGroups[currentStepIndex].valid) {
        const stepData = this.prepareStepData(currentStepIndex);
        this.dmmService.saveStepData(stepData).subscribe(
          (response) => {
            console.log("✅ Step data saved successfully:", response);
            this.selectedIndex++; // Move to the next step
            this.currentStep = this.selectedIndex + 1;
            this.router.navigate([
              "/complete-dossier",
              this.idDossier,
              "step",
              this.currentStep,
            ]);
          },
          (error) => {
            console.error("❌ Error saving step:", error);
            this.toastr.error("Erreur lors de l'enregistrement de l'étape.");
          }
        );
      } else {
        this.toastr.error("Veuillez remplir tous les champs obligatoires.");
      }
    } else if (this.selectedIndex === this.steps.length - 1) {
      // Handle the last step's data submission
      if (this.formGroups[this.selectedIndex].valid) {
        const stepData = this.prepareStepData(this.selectedIndex); // Prepare the data for the last step
        this.dmmService.saveStepData(stepData).subscribe(
          (response) => {
            console.log("✅ Last step data saved successfully:", response);

            // Assign dossierId if not already assigned
            if (!this.dossierId && this.idDossier) {
              this.dossierId = parseInt(this.idDossier, 10); // Convert string to number
            }

            if (this.dossierId) {
              // Fetch recap data after saving the last step
              this.loadRecapDossier(this.dossierId);
            } else {
              console.error("❌ dossierId is null, cannot fetch recap.");
            }

            this.selectedIndex++; // Move to the recap step
            this.currentStep = this.selectedIndex + 1;
            this.router.navigate([
              "/complete-dossier",
              this.idDossier,
              "step",
              this.currentStep,
            ]);
          },
          (error) => {
            console.error("❌ Error saving last step data:", error);
            this.toastr.error(
              "Erreur lors de l'enregistrement de la dernière étape."
            );
          }
        );
      } else {
        this.toastr.error("Veuillez remplir tous les champs obligatoires.");
      }
    }
  }
  submitMedicament() {
    if (this.medicamentForm.invalid) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    this.dmmService.submitMedicament(this.medicamentForm.value).subscribe(
      (response) => {
        console.log("✅ Medicament Submission Response:", response);

        // Access idDossier inside the "data" object
        if (response?.data?.idDossier) {
          this.idDossier = response.data.idDossier;
        }

        this.toastr.success(`Médicament enregistré avec succès. `);
        this.isMedicamentSubmitted = true;
      },
      (error) => {
        console.error("❌ Error submitting medicament:", error);
        alert("Erreur lors de l'enregistrement du médicament.");
      }
    );
  }

  async onFileSelected(event: any, element: any) {
    const file = event.target.files[0];
    if (!file) return;

    const elementId = element.id;
    this.currentUploads[elementId] = file;
    this.uploadStatus[elementId] = "reading";
    this.uploadProgress[elementId] = {
      percent: 0,
      loaded: 0,
      total: file.size,
    };

    try {
      // Step 1: Read file as base64 (with progress)
      const base64String = await this.readFileWithProgress(file, elementId);

      // Step 2: Upload with progress tracking
      this.uploadStatus[elementId] = "uploading";
      await this.uploadWithProgress(base64String, element, elementId);
    } catch (error) {
      this.uploadStatus[elementId] = "error";
      this.toastr.error("File processing failed");
      console.error("Upload error:", error);
    }
  }

  private readFileWithProgress(file: File, elementId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 50);
          this.uploadProgress[elementId] = {
            percent,
            loaded: event.loaded,
            total: event.total,
          };
        }
      };

      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsDataURL(file);
    });
  }

  private uploadWithProgress(
    base64String: string,
    element: any,
    elementId: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const filePayload = {
        idDossier: this.idDossier,
        idModuleElement: element.id,
        fileBase64: base64String,
        extension:
          this.currentUploads[elementId].name.split(".").pop()?.toLowerCase() ||
          "",
      };

      // Create a request with progress reporting
      const req = new HttpRequest(
        "POST",
        "/api/upload", // Your upload endpoint
        filePayload,
        { reportProgress: true }
      );

      this.http.request(req).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            // Calculate overall progress (50% from reading + 50% from uploading)
            const uploadPercent = Math.round((event.loaded / event.total) * 50);
            const totalPercent = 50 + uploadPercent;

            this.uploadProgress[elementId] = {
              percent: totalPercent,
              loaded: event.loaded,
              total: event.total,
            };
          } else if (event instanceof HttpResponse) {
            this.uploadStatus[elementId] = "success";
            this.toastr.success("File uploaded successfully!");
            resolve();
          }
        },
        error: (err) => {
          this.uploadStatus[elementId] = "error";
          reject(err);
        },
      });
    });
  }

  getUploadProgress(elementId: string): number {
    return this.uploadProgress[elementId]?.percent || 0;
  }

  getUploadStatus(elementId: string): string {
    return this.uploadStatus[elementId] || "pending";
  }

  downloadFile(dossierId: number, moduleId: number, name: string): void {
    this.dossierService.downloadFile(dossierId, moduleId).subscribe((blob) => {
      saveAs(blob, `${name}_${dossierId}_${moduleId}.pdf`); // Example file name
    });
  }
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1]; // Extract Base64 data
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  uploadFileToBackend(
    base64File: string,
    idModuleElement: number,
    fileExtension: string
  ) {
    if (!this.idDossier) {
      console.error("❌ No idDossier found, cannot upload file.");
      return;
    }

    const filePayload = {
      idDossier: this.idDossier,
      idModuleElement: idModuleElement,
      fileBase64: base64File,
      extension: fileExtension, // Include file extension
    };

    this.dmmService.uploadFile(filePayload).subscribe({
      next: (response) => {
        console.log("✅ File uploaded successfully:", response);
        this.toastr.success("Fichier téléchargé avec succès!");
      },
      error: (error) => {
        console.error("❌ Error uploading file:", error);
        this.toastr.error("Erreur lors du téléchargement du fichier.");
      },
    });
  }

  // Fetch steps from the API
  fetchSteps() {
    this.dmmService.getSteps().subscribe(
      (response: ApiResponse) => {
        if (response?.data) {
          this.steps = response.data.map((step) => ({
            ...step,
            elements: step.moduleElements || [],
          }));

          // ✅ Initialize forms AFTER steps are loaded
          this.initializeForms();

          // Now fetch data for the current step
          this.fetchCurrentStepData();
        }
      },
      (error) => console.error("Error fetching steps:", error)
    );
  }

  CompleterPlusTard(): void {
    console.log("CompleterPlusTard method called");
    console.log("Dossier ID avant assignation:", this.dossierId); // Debugging line

    // Convertir idDossier en number et l'assigner à dossierId s'il est null
    if (!this.dossierId) {
      this.dossierId = Number(this.idDossier);
      console.log(
        "Nouvelle valeur de dossierId après conversion:",
        this.dossierId
      );
    }

    if (!this.dossierId) {
      console.error("Erreur: dossierId est toujours null après conversion.");
      return;
    }

    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Voulez-vous vraiment completer plus Tard?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, accepter!",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        // Save the current step data (like goForward) but don't move to next step
        const stepData = this.prepareStepData(this.selectedIndex);
        this.dmmService.saveStepData(stepData).subscribe(
          (response) => {
            console.log("✅ Step data saved successfully:", response);

            // Proceed with the existing completerPlusTard logic
            this.dossierService
              .completerPlusTard(this.dossierId, this.selectedIndex + 1)
              .subscribe({
                next: () => {
                  this.loadRecapDossier(this.dossierId);

                  // Optional: Set timeout before navigating
                  setTimeout(() => {
                    this.router.navigate(["/demamm"]);
                  }, 2000); // 2 seconds delay for better UX
                },
                error: (error) => {
                  console.error(
                    "Erreur lors de la réception du dossier:",
                    error
                  );
                  Swal.fire(
                    "Erreur!",
                    "Une erreur est survenue lors de la réception du dossier.",
                    "error"
                  );
                },
              });
          },
          (error) => {
            console.error("❌ Error saving step data:", error);
            Swal.fire(
              "Erreur!",
              "Une erreur est survenue lors de l'enregistrement.",
              "error"
            );
          }
        );
      }
    });
  }
  prepareStepData(stepIndex: number): any[] {
    const stepData = [];
    const stepFormGroup = this.formGroups[stepIndex];
    const stepElements = this.steps[stepIndex].moduleElements;

    // Loop through each element to extract the necessary data
    stepElements.forEach((element) => {
      // Skip elements of type 'FICHIER' since files are already uploaded
      if (element.typeElement === "FICHIER") {
        return; // Skip this iteration
      }

      const formControlValue = stepFormGroup.get(element.nomElement)?.value;

      // Only add the data if there is a value
      if (formControlValue) {
        stepData.push({
          contenuTexte: formControlValue, // Send text data
          idModuleElement: element.id, // Include the module element ID
          idDossier: this.idDossier, // Include the dossier ID
        });
      }
    });

    console.log("Prepared step data (excluding files):", stepData); // Debugging log
    return stepData;
  }

  // Navigate to the previous step
  // Modified goBack()

  // Prepare recap data for the final step
  getRecapData() {
    if (this.idDossier) {
      this.dmmService.getRecapData(this.idDossier).subscribe(
        (response: ApiResponse) => {
          console.log("Recap API Response:", response);
          if (response?.data) {
            this.recapData = response.data; // Assign the fetched recap data to the recapData property
          }
        },
        (error) => {
          console.error("Error fetching recap data:", error);
        }
      );
    }
  }

  // Handle the form submission at the final step
  onSubmit() {
    if (this.selectedIndex === this.steps.length - 1) {
      console.log("Final Recap:", this.getRecapData());
      alert("Form Submitted Successfully!");
    }
  }
  submitDossier() {
    if (this.idDossier) {
      this.dmmService.submitDossier(this.idDossier).subscribe({
        next: (response: ApiResponse) => {
          console.log("✅ Dossier submitted successfully:", response);
          //  this.toastr.success('Dossier soumis avec succès!');
        },
        error: (error) => {
          console.error("❌ Error submitting dossier:", error);
          // this.toastr.error('Erreur lors de la soumission du dossier.');
        },
        complete: () => {
          // ✅ Redirect to home after either success or failure
          setTimeout(() => {
            this.router.navigate(["/ammprocess"]);
          }, 2000); // Optional delay for better UX
        },
      });
    } else {
      console.error("❌ No idDossier found");
      //this.toastr.error('Aucun idDossier trouvé.');
    }
  }

  isPanelVisible: boolean = false;

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

  // Toggle visibility of the user panel
  toggleUserPanel(): void {
    this.isPanelVisible = !this.isPanelVisible;
  }

  // Handle logout
  logout(): void {
    console.log("Logging out...");
  }
}
