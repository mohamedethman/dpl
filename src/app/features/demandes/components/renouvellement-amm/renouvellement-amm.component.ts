import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Subject } from "rxjs";

import { DmmService } from "../../services/dmm.service";
import { ApiResponse } from "../../models/step.model"; // Import ApiResponse interface
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router"; // ✅ Import Router
import { saveAs } from "file-saver";
import { DossierService } from "../../services/dossier.details.service";
import {
  DossierModuleElement,
  RecapDossierApiResponse,
} from "../../models/dossier-details";
import Swal from "sweetalert2"; // Import SweetAlert2
@Component({
  selector: "app-renouvellement-amm.component",
  templateUrl: "./renouvellement-amm.component.html",
  styleUrls: ["./renouvellement-amm.component.scss"],
})
export class RenouvellementAmmComponent implements OnInit {
  title = "amm-frontend";
  steps: any[] = []; // Array to hold the steps
  selectedIndex: number = 0; // Current selected step index
  formGroups: UntypedFormGroup[] = []; // Array to hold the FormGroups for each step
  medicamentForm: UntypedFormGroup; // FormGroup for Medicament
  isMedicamentSubmitted: boolean = false; // Flag to toggle between medicament form and wizard steps
  isOtherDCISelected: boolean = false; // Ajout de la propriété
  isOtherATCSelected: boolean = false;
  idDossier: string | null = null;
  recapData: any = {}; // To store the recap data from the API
  stepSaved: boolean[] = [];
  dossierId: number | null = null;
  labFabriquantValue: boolean = false;
  atcSearchTerm = new Subject<string>();
  atcOptions: any[] = [];
  selectedATCCode: any = null;
  atcInputValue: string = "";
  recapDossier: RecapDossierApiResponse | null = null;
  dossierModuleElements: DossierModuleElement[] = [];
  loading = true;
  availableSubstances: any = { content: [] }; // Initialize with empty content
  substancesList: any[] = [];
  selectedSubstance: any = null;
  substanceDosage: string = "";
  error: string | null = null;
  dosages: string[] = [];
  isFabricantLab: boolean = false;
  // Dropdown data
  atcCodes: string[] = [];
  conditionnements: string[] = [];
  voiesAdministration: string[] = [];
  // dosages: string[] = [];
  formesPharmaceutiques: string[] = [];
  // dcis: string[] = [];
  dcis$: Observable<any[]> = of([]); // ✅ Observable for DCI suggestions

  dcisList: any[] = [];

  dciSearchText: string = "";
  selectedDci: any = null;
  customDci: string = "";
  dciDosage: string = "";
  useCustomDci: boolean = false;

  dciSearchTerm = new Subject<string>();
  dciOptions: any[] = [];
  selectedMainDci: any = null;
  mainDciInputValue: string = "";

  // Substances autocomplete properties
  substanceSearchTerm = new Subject<string>();
  substanceOptions: any[] = [];
  selectedSubstanceDci: any = null;
  substanceDciInputValue: string = "";

  constructor(
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private router: Router, // ✅ Inject RouterDCI
    private dossierService: DossierService,
    private dmmService: DmmService
  ) {
    this.medicamentForm = this.fb.group({
      nom_medicament: ["", Validators.required],
      // dosage: ["", Validators.required],
      forme_pharmaceutique: ["", Validators.required],
      voie_administration: ["", Validators.required],
      code_atc: [""],
      autreAtc: [""],
      dci: [""],
      autreDci: [""],
      // dosage: ["", Validators.required],
      conditionnement: ["", Validators.required],
      labFabriquant: [false],
      nomFabricant: [""],
      adresseFabricant: [""],
      prixGrossisteHorsTaxe: ["", [Validators.required, Validators.min(0)]],
      devise: ["$", Validators.required],
    });
  }

  atcDciValidator(formGroup: UntypedFormGroup) {
    const codeATC = formGroup.get("code_atc")?.value;
    const autreAtc = formGroup.get("autreAtc")?.value;
    const dci = formGroup.get("dci")?.value;
    const autreDci = formGroup.get("autreDci")?.value;

    let errors: any = {};

    if (!dci && !autreDci) {
      errors.missingDci = "Veuillez remplir soit DCI, soit Autre DCI.";
    }

    // Return errors only if there are missing required fields
    return Object.keys(errors).length ? errors : null;
  }

  ngOnInit() {
    this.fetchFormData(); // Fetch dropdown data on component initialization
    this.fetchSteps(); // Fetch steps from the backend
    this.setupAutocomplete(); // ✅ Initialize autocomplete for DCI
    this.loadSubstances();
    this.medicamentForm
      .get("labFabriquant")
      ?.valueChanges.subscribe((value) => {
        this.labFabriquantValue = value;
      });
    this.labFabriquantValue = this.medicamentForm.get("labFabriquant")?.value;

    this.dciSearchTerm
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => (term ? this.dmmService.getDCIs(term) : of([])))
      )
      .subscribe((data) => {
        this.dciOptions = data;
      });

    // Setup substances DCI autocomplete
    this.substanceSearchTerm
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => (term ? this.dmmService.getDCIs(term) : of([])))
      )
      .subscribe((data) => {
        this.substanceOptions = data;
      });
    this.atcSearchTerm
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          console.log("Searching ATC with term:", term); // Add this
          return term ? this.dmmService.getATCs(term) : of([]);
        })
      )
      .subscribe((data) => {
        console.log("Received ATC options:", data); // Add this
        this.atcOptions = data;
      });
  }

  // Main DCI methods
  onMainDciSearch(term: string) {
    this.dciSearchTerm.next(term);
  }

  onMainDciSelect(dci: any) {
    this.selectedMainDci = dci;
    this.mainDciInputValue = dci.nomSubstance;
    this.medicamentForm.patchValue({
      dci: dci.nomSubstance,
    });
  }
  onATCSearch(term: string) {
    this.atcSearchTerm.next(term);
  }

  onATCSelect(atc: any) {
    console.log("Selected ATC:", atc);
    this.selectedATCCode = atc;
    this.atcInputValue = atc.codeATC;
    this.medicamentForm.patchValue({
      code_atc: atc.codeATC,
    });

    // Clear the dropdown list
    this.atcOptions = [];
    this.atcSearchTerm.next(""); // Reset the search term

    // Clear manual ATC input if needed
    this.medicamentForm.get("autreAtc")?.setValue("");
  }

  clearATCSelection() {
    this.selectedATCCode = null;
    this.atcInputValue = "";
    this.atcOptions = [];
    this.medicamentForm.patchValue({
      code_atc: null,
    });
  }
  clearMainDciSelection() {
    this.selectedMainDci = null;
    this.mainDciInputValue = "";
    this.dciOptions = [];
    this.medicamentForm.patchValue({
      dci: null,
    });
  }

  // Substances DCI methods
  onSubstanceDciSearch(term: string) {
    this.substanceSearchTerm.next(term);
  }

  onSubstanceDciSelect(dci: any) {
    this.selectedSubstanceDci = dci;
    this.substanceDciInputValue = dci.nomSubstance;
    this.dciSearchText = dci.nomSubstance;
  }

  clearSubstanceDciSelection() {
    this.selectedSubstanceDci = null;
    this.substanceDciInputValue = "";
    this.substanceOptions = [];
    this.dciSearchText = "";
  }
  setupAutocomplete() {
    this.dcis$ = this.medicamentForm.controls["dci"].valueChanges.pipe(
      debounceTime(300), // Wait before sending request
      distinctUntilChanged(), // Avoid duplicate queries
      switchMap((value) => (value ? this.dmmService.getDCIs(value) : of([]))), // Fetch DCIs
      tap((data) => console.log("DCI API Response:", data)) // Log the API response
    );
  }
  loadSubstances() {
    this.dmmService.getAllDcis().subscribe({
      next: (response) => {
        this.availableSubstances = response;
        console.log("Substances loaded:", this.availableSubstances);
      },
      error: (error) => {
        console.error("Error loading substances:", error);
        this.toastr.error("Erreur lors du chargement des substances");
      },
    });
  }
  async searchDCI(term: string) {
    if (term && term.length >= 2) {
      try {
        this.dciOptions = await this.dmmService.getDCIs(term).toPromise();
      } catch (error) {
        console.error("Error searching DCIs:", error);
        this.dciOptions = [];
      }
    } else {
      this.dciOptions = [];
    }
  }

  // Simple search method for substances DCI
  async searchSubstanceDCI(term: string) {
    if (term && term.length >= 2) {
      try {
        this.substanceOptions = await this.dmmService.getDCIs(term).toPromise();
      } catch (error) {
        console.error("Error searching DCIs:", error);
        this.substanceOptions = [];
      }
    } else {
      this.substanceOptions = [];
    }
  }

  selectMainDci(dci: any) {
    this.selectedMainDci = dci;
    this.medicamentForm.patchValue({ dci: dci.nomSubstance });
    this.dciOptions = [];
  }

  // Select substance DCI
  selectSubstanceDci(dci: any) {
    this.selectedSubstanceDci = dci;
    this.dciSearchText = dci.nomSubstance;
    this.substanceOptions = [];
  }
  // Handle selecting a DCI
  // Update these methods
  selectDCI(dci: any) {
    this.selectedDci = dci;
    this.dciSearchText = dci.nomSubstance; // Display the name instead of [object Object]
    this.dcis$ = of([]); // Clear the autocomplete list
  }

  clearDciSelection() {
    this.selectedDci = null;
    this.dciSearchText = "";
    this.dcis$ = of([]);
  }

  addDci() {
    if (!this.dciDosage) {
      this.toastr.warning("Veuillez spécifier un dosage");
      return;
    }

    if (this.useCustomDci) {
      if (this.customDci.trim()) {
        const exists = this.dcisList.some(
          (dci) =>
            dci.nomSubstance.toLowerCase() ===
            this.customDci.trim().toLowerCase()
        );
        if (exists) {
          this.toastr.warning("Cette substance a déjà été ajoutée");
          return;
        }
        this.dcisList.push({
          id: null,
          nomSubstance: this.customDci.trim(),
          typeSubstance: "DCI",
          dosage: this.dciDosage,
          isCustom: true,
        });
        this.customDci = "";
        this.dciDosage = "";
      }
    } else {
      if (this.selectedSubstanceDci) {
        const exists = this.dcisList.some(
          (dci) =>
            dci.nomSubstance.toLowerCase() ===
            this.selectedSubstanceDci.nomSubstance.toLowerCase()
        );
        if (exists) {
          this.toastr.warning("Cette substance a déjà été ajoutée");
          return;
        }
        this.dcisList.push({
          ...this.selectedSubstanceDci,
          dosage: this.dciDosage,
          isCustom: false,
        });
        this.selectedSubstanceDci = null;
        this.dciSearchText = "";
        this.substanceOptions = [];
        this.dciDosage = "";
      }
    }
  }

  removeDci(index: number) {
    this.dcisList.splice(index, 1);
  }
  // Fetch data for dropdowns from the API
  fetchFormData() {
    this.dmmService.getATCCodes().subscribe(
      (response) => {
        this.atcCodes = response; // Assign API data to the atcCodes property
      },
      (error) => {
        console.error("Error fetching ATC codes:", error);
      }
    );

    this.dmmService.getDosages().subscribe(
      (response) => {
        this.dosages = response; // Assign API data to the dosages property
      },
      (error) => {
        console.error("Error fetching dosages:", error);
      }
    );

    // this.dmmService.getRecapDossier().subscribe(
    //   (response) => {
    //     this.dcis = response; // Assign API data to the dosages property
    //   },
    //   (error) => {
    //     console.error('Error fetching recapdossier:', error);
    //   }
    // );

    this.dmmService.getFormesPharmaceutiques().subscribe(
      (response) => {
        this.formesPharmaceutiques = response; // Assign API data to the formesPharmaceutiques property
      },
      (error) => {
        console.error("Error fetching formes pharmaceutiques:", error);
      }
    );

    this.dmmService.getVoieAdministrations().subscribe(
      (response) => {
        this.voiesAdministration = response; // Assign API data to the voiesAdministration property
      },
      (error) => {
        console.error("Error fetching voies administrations:", error);
      }
    );

    // this.dmmService.getConditionnements().subscribe(
    //   (response) => {
    //     this.conditionnements = response; // Assign API data to the conditionnements property
    //   },
    //   (error) => {
    //     console.error("Error fetching conditionnements:", error);
    //   }
    // );
  }

  onFabriquantChange(event: any) {
    // No need to invert here - checkbox value directly represents labFabriquant
    const isChecked = event.target.checked;
    this.medicamentForm.get("labFabriquant")?.setValue(isChecked);
    this.isFabricantLab = true;

    // Add validation if needed
    if (isChecked) {
      this.medicamentForm
        .get("nomFabricant")
        ?.setValidators([Validators.required]);
      this.medicamentForm
        .get("adresseFabricant")
        ?.setValidators([Validators.required]);
    } else {
      this.medicamentForm.get("nomFabricant")?.clearValidators();
      this.medicamentForm.get("adresseFabricant")?.clearValidators();
    }
    this.medicamentForm.get("nomFabricant")?.updateValueAndValidity();
    this.medicamentForm.get("adresseFabricant")?.updateValueAndValidity();
  }
  // Fetch steps from the API
  fetchSteps(hideContrat: boolean = false) {
    this.dmmService.getSteps().subscribe((response: ApiResponse) => {
      if (response && Array.isArray(response.data)) {
        this.steps = response.data
          .map((step) => ({
            ...step,
            // Process elements
            elements: (step.moduleElements || [])
              .filter(
                (element) =>
                  !hideContrat ||
                  element.nomElement !== "Contrat de sous traitance"
              )
              .map((element) => {
                // Replace the label if it matches
                if (element.nomElement === "AMM pays d'origine") {
                  return {
                    ...element,
                    nomElement: "AMM Mauritanienne",
                  };
                }
                return element;
              }),
          }))
          .slice(0, 2); // ✅ Limit to the first 2 modules only
      }
      this.initializeForms();
    });
  }

  // Initialize the form groups for each step
  initializeForms() {
    this.formGroups = [];
    this.steps.forEach((step) => {
      const group = this.fb.group({});
      // Add form controls for each element in the step
      step.moduleElements.forEach((element) => {
        const validators = [];

        // Add required validator if element is obligatoire
        if (element.obligatoire) {
          validators.push(Validators.required);
        }

        if (
          element.typeElement === "TEXTAREA" ||
          element.typeElement === "TEXTE"
        ) {
          group.addControl(element.nomElement, this.fb.control("", validators));
        } else if (element.typeElement === "FICHIER") {
          group.addControl(
            element.nomElement,
            this.fb.control(null, validators)
          );
        }
        // Add more type checks if needed
      });
      this.formGroups.push(group);
    });
    console.log("Form Groups:", this.formGroups);
  }

  // Handle Medicament Form Submission
  submitMedicament() {
    if (this.medicamentForm.invalid) {
      this.toastr.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (this.dcisList.length === 0) {
      this.toastr.error("Veuillez ajouter au moins une substance");
      return;
    }

    const payload = {
      ...this.medicamentForm.value,
      substances: this.dcisList,
      code_atc: this.medicamentForm.get("code_atc")?.value,
      autreAtc: this.medicamentForm.get("autreAtc")?.value,
      dci: this.medicamentForm.get("dci")?.value,
      autreDci: this.medicamentForm.get("autreDci")?.value,
      dosage: this.medicamentForm.get("dosage")?.value,
    };

    this.dmmService.submitRenouvellement(payload).subscribe({
      next: (response) => {
        console.log("✅ Medicament Submission Response:", response);

        if (response?.data?.idDossier) {
          this.idDossier = response.data.idDossier;

          // ✅ Get labFabriquant from API response
          this.labFabriquantValue = response.data.labFabriquant;
          this.fetchSteps(this.labFabriquantValue);

          console.log("labFabriquantValue from API:", this.labFabriquantValue);

          this.toastr.success(
            `Médicament enregistré avec succès (ID: ${this.idDossier})`
          );
        } else {
          this.toastr.success("Médicament enregistré avec succès");
        }

        this.isMedicamentSubmitted = true;
        this.resetForm();
      },
      error: (error) => {
        console.error("❌ Error submitting medicament:", error);
        this.toastr.error("Erreur lors de l'enregistrement du médicament");
      },
    });
  }

  // Optional: Add this method to reset the form
  resetForm() {
    this.medicamentForm.reset();
    this.substancesList = [];
    this.selectedSubstance = null;
    this.substanceDosage = "";

    // Reset specific controls if needed
    this.medicamentForm.patchValue({
      labFabriquant: false,
      devise: "$",
    });
  }

  onFileSelected(event: any, element: any) {
    const file = event.target.files[0];
    if (file) {
      const fileExtension =
        file.name.split(".").pop()?.toLowerCase() || "unknown"; // Get file extension

      this.convertFileToBase64(file)
        .then((base64File) => {
          this.uploadFileToBackend(base64File, element.id, fileExtension); // Send to backend
        })
        .catch((error) => {
          console.error("❌ Error converting file:", error);
        });
    }
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

  prepareStepData(stepIndex: number): any[] {
    const stepData = [];
    const stepFormGroup = this.formGroups[stepIndex];
    const stepElements = this.steps[stepIndex].moduleElements; // Ensure this is populated correctly.

    // Loop through each element to extract the necessary data
    stepElements.forEach((element) => {
      // Skip elements of type 'FICHIER'
      if (element.typeElement === "FICHIER") {
        return;
      }

      const formControlValue = stepFormGroup.get(element.nomElement)?.value;

      // Only add the data if there is a value
      if (formControlValue) {
        stepData.push({
          contenuTexte: formControlValue,
          idModuleElement: element.id, // Ensure you're using the correct field for `idModuleElement`
          idDossier: this.idDossier,
        });
      }
    });

    console.log("Prepared step data (excluding files):", stepData); // Debugging log
    return stepData;
  }

  // Navigate to the previous step
  goBack() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  // Navigate to the next step, only if the form is valid
  goForward() {
    if (this.selectedIndex < this.steps.length - 1) {
      // Ensure the current form group is valid before proceeding
      if (this.formGroups[this.selectedIndex].valid) {
        const stepData = this.prepareStepData(this.selectedIndex); // Prepare the data for the current step
        this.dmmService.saveStepData(stepData).subscribe(
          (response) => {
            console.log("✅ Step data saved successfully:", response);
            this.selectedIndex++; // Move to the next step
          },
          (error) => {
            console.error("❌ Error saving step data:", error);
            alert("Failed to save step data. Please try again.");
          }
        );
      } else {
        alert(
          "Please fill out all required fields before moving to the next step."
        );
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
          },
          (error) => {
            console.error("❌ Error saving last step data:", error);
            alert("Failed to save last step data. Please try again.");
          }
        );
      } else {
        alert(
          "Please fill out all required fields before moving to the recap."
        );
      }
    }
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
      text: "Voulez-vous vraiment completer plus tard?",
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
  onToggleOtherATC() {
    if (this.medicamentForm.get("autreAtc")?.value) {
      this.medicamentForm.get("code_atc")?.setValue(""); // Clear code_atc when autreAtc is selected
    }
  }

  onToggleCodeATC() {
    if (this.medicamentForm.get("code_atc")?.value) {
      this.medicamentForm.get("autreAtc")?.setValue(""); // Clear autreAtc when code_atc is selected
    }
  }

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
          this.toastr.success("Dossier soumis avec succès!");
        },
        error: (error) => {
          console.error("❌ Error submitting dossier:", error);
          this.toastr.error("Erreur lors de la soumission du dossier.");
        },
        complete: () => {
          // ✅ Redirect to home after either success or failure
          setTimeout(() => {
            this.router.navigate(["/demamm"]);
          }, 2000); // Optional delay for better UX
        },
      });
    } else {
      console.error("❌ No idDossier found");
      this.toastr.error("Aucun idDossier trouvé.");
    }
  }

  isPanelVisible: boolean = false;

  // Toggle visibility of the user panel
  toggleUserPanel(): void {
    this.isPanelVisible = !this.isPanelVisible;
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
  shouldDisplayElement(element: any): boolean {
    if (element.nomElement !== "Contrat de sous traitance") {
      return true;
    }

    // Only show the element if labFabriquant is false
    return this.medicamentForm.get("labFabriquant")?.value === true;
  }

  shouldShowElement(elementName: string): boolean {
    if (elementName !== "Contrat de sous traitance") {
      return true; // Always show non-Contrat elements
    }
    return !this.labFabriquantValue; // Show Contrat ONLY if labFabriquant is false
  }
}
