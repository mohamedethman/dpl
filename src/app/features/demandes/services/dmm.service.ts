import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { AuthenticationService } from "../../../service/authenticationService";
import { map, catchError, tap } from "rxjs/operators";
import { ApiResponse } from "../models/step.model";
import { AppConfigService } from "src/app/app-config.service";
@Injectable({
  providedIn: "root",
})
export class DmmService {
  steps: any[] = []; // Define steps as an array to store the response

  private readonly apiUrl: string;
  private endpoints: any;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private appConfig: AppConfigService
  ) {
    this.apiUrl = this.appConfig.getConfig().baseUrl;

    this.endpoints = {
      allModules: `${this.apiUrl}/allModules`,
      allCodeATCs: `${this.apiUrl}/allCodeATCs`,
      allConditionnements: `${this.apiUrl}/allConditionnements`,
      allVoieAdministrations: `${this.apiUrl}/allVoieAdministrations`,
      allDosages: `${this.apiUrl}/allDosages`,
      allFormePharmaceutiques: `${this.apiUrl}/allFormePharmaceutiques`,
      recapDossier: `${this.apiUrl}/recapDossier/dossierId`,
      saveMedicament: `${this.apiUrl}/saveMedicament`,
      saveAllModuleElementData: `${this.apiUrl}/saveAllModuleElementData`,
      autocompleteDCIs: `${this.apiUrl}/autocompleteDCIs/`,
      autocompleteATCs: `${this.apiUrl}/autocompleteATCs/`,
      soumettreDossier: `${this.apiUrl}/soumettreDossier`,
      stockerFichier: `${this.apiUrl}/stockerFichier`,
      getElementsAndElementsData: `${this.apiUrl}/getElementsAndElementsData/`,
    };
  }
  private createHeaders(): HttpHeaders {
    const token = this.authService.getJwtToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
  }

  getATCs(query: string): Observable<any[]> {
    const url = `${this.endpoints.autocompleteATCs}${query}`;
    return this.http.get<any>(url, { headers: this.createHeaders() }).pipe(
      map((response) => response.data), // Extracting the 'data' array from the response
      tap((data) => console.log("Fetched DCIs:", data))
    );
  }
  // getATCs(query: string): Observable<any[]> {
  //   const url = `${this.apiUrl}/autocompleteATCs/${query}`;
  //   const headers = this.createHeaders();

  //   console.log('Fetching ATCs with query:', query); // Add this for debugging

  //   return this.http.get<any>(url, { headers }).pipe(
  //     tap(response => console.log('ATC API Response:', response)), // Log full response
  //     map((response) => {
  //       if (response && response.data) {
  //         console.log('ATC Data:', response.data); // Log the data
  //         return response.data;
  //       }
  //       return [];
  //     }),
  //     catchError((error) => {
  //       console.error("❌ Error fetching ATC codes:", error);
  //       return throwError(() => new Error("Failed to fetch ATC codes"));
  //     })
  //   );
  // }
  // Fetch wizard steps dynamically from API
  getSteps(): Observable<ApiResponse> {
    return this.http
      .get<ApiResponse>(this.endpoints.allModules, {
        headers: this.createHeaders(),
      })
      .pipe(
        map((response) => {
          console.log("API response:", response);

          if (response && response.data) {
            // Populate `steps` with `moduleElements` and their `idModuleElement`
            this.steps = response.data.map((module) => ({
              idModule: module.id,
              moduleElements: module.moduleElements.map((element) => ({
                idModuleElement: element.id, // Store id as idModuleElement
              })),
            }));

            console.log("✅ Steps populated successfully:", this.steps);
          } else {
            console.error(
              "❌ Response does not have expected structure:",
              response
            );
          }
          return response;
        }),
        catchError((error) => {
          console.error("❌ Error fetching steps:", error);
          return throwError(error);
        })
      );
  }

  // Submit medicament data
  submitMedicament(data: any): Observable<any> {
    // Format substances
    const formattedSubstances = data.substances.map((substance: any) => ({
      nomSubstance: substance.nomSubstance,
      dosage: substance.dosage,
      typeSubstance: substance.typeSubstance || "DCI",
      id: substance.id || null,
    }));

    // Prepare base payload
    const payload: any = {
      nomMedicament: data.nom_medicament,
      formePharmaceutique: data.forme_pharmaceutique,
      voieAdministration: data.voie_administration,
      // dosage: data.dosage,
      autreConditionnement: data.conditionnement,
      prixGrossisteHorsTaxe: data.prixGrossisteHorsTaxe,
      labFabriquant: !data.labFabriquant, // Directly use the checkbox value
      ...(data.labFabriquant && {
        // Only include if checkbox is checked (true)
        nomFabricant: data.nomFabricant,
        adresseFabricant: data.adresseFabricant,
      }),
      devise: data.devise,
      substances: formattedSubstances,
      codeATC: data.code_atc || null,
      autreAtc: data.autreAtc || null,

      // autreDci: data.autreDci || null,
      // dci: data.dci || null,
    };

    console.log("📤 Sending Medicament Data:", payload);

    return this.http
      .post<any>(this.endpoints.saveMedicament, payload, {
        headers: this.createHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error("❌ Request failed:", error);
          return throwError(() => new Error("Failed to submit medicament."));
        })
      );
  }

  submitRenouvellement(data: any): Observable<any> {
    // Format substances
    const formattedSubstances = data.substances.map((substance: any) => ({
      nomSubstance: substance.nomSubstance,
      dosage: substance.dosage,
      typeSubstance: substance.typeSubstance || "DCI",
      id: substance.id || null,
    }));

    // Prepare base payload
    const payload: any = {
      nomMedicament: data.nom_medicament,
      formePharmaceutique: data.forme_pharmaceutique,
      voieAdministration: data.voie_administration,
      // dosage: data.dosage,
      autreConditionnement: data.conditionnement,
      prixGrossisteHorsTaxe: data.prixGrossisteHorsTaxe,
      labFabriquant: !data.labFabriquant, // Directly use the checkbox value
      ...(data.labFabriquant && {
        // Only include if checkbox is checked (true)
        nomFabricant: data.nomFabricant,
        adresseFabricant: data.adresseFabricant,
      }),
      devise: data.devise,
      substances: formattedSubstances,
      codeATC: data.code_atc || null,
      autreAtc: data.autreAtc || null,
      renouvellement: true,

      // autreDci: data.autreDci || null,
      // dci: data.dci || null,
    };

    console.log("📤 Sending Medicament Data:", payload);

    return this.http
      .post<any>(this.endpoints.saveMedicament, payload, {
        headers: this.createHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error("❌ Request failed:", error);
          return throwError(() => new Error("Failed to submit medicament."));
        })
      );
  }
  getAllDcis(): Observable<ApiResponse> {
    // Renamed method and to French
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .get<ApiResponse>(`${this.apiUrl}/allDcis`, { headers })
      .pipe(
        map((response) => response) // You can remove the map(response => response), it's redundant
      );
  }

  uploadFile(fileData: {
    idDossier: string | null;
    idModuleElement: number;
    fileBase64: string;
    extension: string;
  }): Observable<any> {
    const url = `${this.endpoints.stockerFichier}`;
    console.log("🚀 Uploading File:", fileData);

    return this.http
      .post<any>(url, fileData, { headers: this.createHeaders() })
      .pipe(
        catchError((error) => {
          console.error("❌ Error uploading file:", error);
          return throwError(() => new Error("File upload failed."));
        })
      );
  }

  // Fetch ATC codes from API
  getATCCodes(): Observable<any> {
    return this.http
      .get<any>(this.endpoints.allCodeATCs, { headers: this.createHeaders() })
      .pipe(map((response) => response.data));
  }

  getElementsAndElementsData(
    dossierId: string,
    currentStep: number
  ): Observable<ApiResponse> {
    const url = `${this.endpoints.getElementsAndElementsData.replace(
      "dossierId",
      dossierId
    )}${dossierId}/step/${currentStep}`;

    return this.http
      .get<ApiResponse>(url, { headers: this.createHeaders() })
      .pipe(
        map((response) => {
          if (response && response.data) {
            console.log(
              "✅ Fetched Elements and Elements Data successfully:",
              response.data
            );
            return response;
          } else {
            console.error(
              "❌ Response does not have expected structure:",
              response
            );
            throw new Error("Invalid response structure");
          }
        }),
        catchError((error) => {
          console.error("❌ Error fetching elements and elements data:", error);
          return throwError(
            () => new Error("Failed to fetch elements and elements data.")
          );
        })
      );
  }
  submitDossier(idDossier: string): Observable<any> {
    const url = `${this.endpoints.soumettreDossier}/${idDossier}`;
    const headers = this.createHeaders();

    console.log("🚀 Sending request to:", url);
    console.log("📡 Headers:", headers);

    return this.http.post<any>(url, {}, { headers }).pipe(
      catchError((error) => {
        console.error("❌ Error in API call:", error);
        return throwError(() => new Error("Failed to submit dossier."));
      })
    );
  }

  // Fetch Conditionnements from API
  getConditionnements(): Observable<any> {
    return this.http
      .get<any>(this.endpoints.allConditionnements, {
        headers: this.createHeaders(),
      })
      .pipe(map((response) => response.data));
  }

  // Fetch Voie Administrations from API
  getVoieAdministrations(): Observable<any> {
    return this.http
      .get<any>(this.endpoints.allVoieAdministrations, {
        headers: this.createHeaders(),
      })
      .pipe(map((response) => response.data));
  }

  // Fetch Recap Data from API
  getRecapData(idDossier: string): Observable<any> {
    const url = this.endpoints.recapDossier.replace("dossierId", idDossier);
    return this.http
      .get<any>(url, { headers: this.createHeaders() })
      .pipe(map((response) => response.data));
  }

  // Fetch Dosages from API
  getDosages(): Observable<any> {
    return this.http
      .get<any>(this.endpoints.allDosages, { headers: this.createHeaders() })
      .pipe(map((response) => response.data));
  }

  // Fetch Formes Pharmaceutiques from API
  getFormesPharmaceutiques(): Observable<any> {
    return this.http
      .get<any>(this.endpoints.allFormePharmaceutiques, {
        headers: this.createHeaders(),
      })
      .pipe(map((response) => response.data));
  }

  // Save Step Data
  saveStepData(stepData: any[]): Observable<any> {
    // Use dynamic URL from the endpoints object
    return this.http
      .post<any>(this.endpoints.saveAllModuleElementData, stepData, {
        headers: this.createHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error("❌ Error saving step data:", error);
          return throwError(() => new Error("Failed to save step data."));
        })
      );
  }

  // Fetch DCIs from API
  getDCIs(query: string): Observable<any[]> {
    const url = `${this.endpoints.autocompleteDCIs}${query}`;
    return this.http.get<any>(url, { headers: this.createHeaders() }).pipe(
      map((response) => response.data), // Extracting the 'data' array from the response
      tap((data) => console.log("Fetched DCIs:", data))
    );
  }
}
