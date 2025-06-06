import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AuthenticationService } from "../../../service/authenticationService";
import {
  DossierApiResponse,
  StatutResponse,
} from "../models/recherche.dossier";

import { ApiResponse } from "../models/dossier-details";
import { AppConfigService } from "src/app/app-config.service";
interface AutocompleteResponse {
  data: any[]; // Adjust the type if necessary
  estModeConnecte: boolean;
  messagesErrors: null | string[];
  messagesInfo: null | string[];
  langueCourante: string;
  totalElements: number;
}

@Injectable({
  providedIn: "root",
})
export class RechercheDossierService {
  private apiUrl: string;
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private appConfig: AppConfigService
  ) {
    this.apiUrl = this.appConfig.getConfig().baseUrl;
  }
  searchDossiers(
    idLaboratoire: number | null,
    idMedicament: number | null,
    statut: string | null,
    dateSoumissionDebut: string | null = null,
    dateSoumissionFin: string | null = null,
    page: number, // 0-indexed page number
    size: number // Number of items per page
  ): Observable<DossierApiResponse> {
    const token = this.authService.getJwtToken();
    if (!token) {
      return throwError(() => new Error("Authentication token not found."));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    let urlWithParams = `${this.apiUrl}/dossiers?page=${page}&size=${size}`;

    const requestBody: any = {
      idLaboratoire: idLaboratoire,
      idMedicament: idMedicament,
      statut: statut,
      dateSoumissionDebut: dateSoumissionDebut,
      dateSoumissionFin: dateSoumissionFin,
    };

    const cleanedRequestBody: any = {};
    for (const key in requestBody) {
      if (
        requestBody[key] !== null &&
        requestBody[key] !== undefined &&
        requestBody[key] !== ""
      ) {
        cleanedRequestBody[key] = requestBody[key];
      }
    }

    return this.http
      .post<DossierApiResponse>(urlWithParams, cleanedRequestBody, { headers }) // Expect DossierApiResponse directly
      .pipe(
        map((response: DossierApiResponse): DossierApiResponse => {
          // The response from the backend already matches DossierApiResponse closely.
          // We just ensure that if messagesErrors or messagesInfo are null,
          // they are passed as null, or an empty array if your component prefers that.
          // The current interface `Message[] | null` handles null directly.

          // If `response.data` is guaranteed by the backend for successful responses with dossiers.
          // If `response.totalElements` is guaranteed.
          return {
            ...response, // Spread all properties from the backend response
            data: response.data || [], // Ensure data is an array, even if backend sends null/undefined (though unlikely for 'data')
            messagesErrors: response.messagesErrors, // Pass through, could be null
            messagesInfo: response.messagesInfo, // Pass through, could be null
          };
        }),
        catchError((error) => {
          console.error(
            "Erreur lors de la recherche des dossiers (POST):",
            error
          );
          let errorMessage =
            "Une erreur est survenue lors de la recherche des dossiers.";
          if (error.error && typeof error.error.message === "string") {
            errorMessage = error.error.message;
          } else if (typeof error.message === "string") {
            errorMessage = error.message;
          }
          // For errors, you might want to return an Observable of a DossierApiResponse
          // that represents an error state, or rethrow an error to be caught by the component.
          // The component currently expects an Error object.
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  autocompleteLaboratoires(term: string): Observable<AutocompleteResponse> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/autocompleteLaboratoires/${term}`;

    return this.http.get<AutocompleteResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error("Error during laboratoire autocomplete:", error);
        return throwError(
          () => new Error("Error during laboratoire autocomplete.")
        );
      })
    );
  }

  autocompleteMedicaments(term: string): Observable<AutocompleteResponse> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/autocompleteMedicamentss/${term}`;

    return this.http.get<AutocompleteResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error("Error during medicament autocomplete:", error);
        return throwError(
          () => new Error("Error during medicament autocomplete.")
        );
      })
    );
  }
  getAllStatut(): Observable<StatutResponse> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/allStatut`;

    return this.http.get<StatutResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error("Error during fetch all Statut:", error);
        return throwError(() => new Error("Error during fetch all Statut."));
      })
    );
  }

  getDossiersByStatut(): Observable<ApiResponse> {
    // Renamed method and to French
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .get<ApiResponse>(`${this.apiUrl}/allDossierByStatut/DRAFT`, { headers })
      .pipe(
        map((response) => response) // You can remove the map(response => response), it's redundant
      );
  }

  getDossierByCommission(): Observable<StatutResponse> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const url = `${this.apiUrl}/allDossierByStatut/DRAFT`;

    return this.http.get<StatutResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error("Error during fetch all Statut:", error);
        return throwError(() => new Error("Error during fetch all Statut."));
      })
    );
  }
}
