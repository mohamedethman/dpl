import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { environment } from "../../../../environments/environment";
import { AuthenticationService } from "../../../service/authenticationService";
import { RecapDossierApiResponse } from "../models/dossier-details";
import { ApiResponse } from "../models/dossier";

@Injectable({
  providedIn: "root",
})
export class DossierService {
  // Renamed to a service name

  private apiUrl = `${environment.baseUrl}`;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  getDossiersBrouillon(): Observable<ApiResponse> {
    // Renamed method and to French
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .get<ApiResponse>(`${this.apiUrl}/allDossierByStatut/DRAFT`, { headers })
      .pipe(
        map((response) => response) // You can remove the map(response => response), it's redundant
      );
  }

  getAllCommissions(page: number, size: number) {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(
      `${this.apiUrl}/allCommissions?page=${page}&size=${size}`,
      { headers }
    );
  }

  ouvrirCommission(data: any) {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}/ouvrirCommission`, data, { headers });
  }

  cloturerCommission(id: number) {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(
      `${this.apiUrl}/cloturerCommission/${id}`,
      {},
      { headers }
    );
  }

  // In dossier.details.service.ts
  validerEvaluations(dossierId: number): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    return this.http.post(
      `${this.apiUrl}/validerEvaluation?idDossier=${dossierId}`,
      {}, // Empty body since you're just passing the query parameter
      { headers } // Headers as part of the options object
    );
  }

  getRemainingDays(dossierId: number): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    return this.http.get<any>(
      `${this.apiUrl}/compteur-labo-national/${dossierId}`,
      { headers }
    );
  }
  validerConformite(data: any): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    return this.http.post(`${this.apiUrl}/valider-conformite-rapport`, data, {
      headers,
    });
  }

  downloadEvaluationReport(dossierId: number): Observable<HttpResponse<Blob>> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: "application/pdf", // Specify the expected response type
    });

    const url = `${this.apiUrl}/open-rapport-evaluation?idDossier=${dossierId}`;

    return this.http
      .get(url, {
        headers,
        responseType: "blob",
        observe: "response",
      })
      .pipe(
        catchError((error) => {
          console.error("Error during evaluation report download:", error);
          return throwError(
            () =>
              new Error(
                "Erreur lors du téléchargement du rapport d'évaluation."
              )
          );
        })
      );
  }
  allDossierByLabConnected(
    page?: number,
    size?: number,
    sort?: string
  ): Observable<ApiResponse> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    let params = new HttpParams();
    if (page !== undefined) params = params.set("page", page.toString());
    if (size !== undefined) params = params.set("size", size.toString());
    if (sort !== undefined) params = params.set("sort", sort);

    return this.http.get<ApiResponse>(
      `${this.apiUrl}/allDossierByLabConnected`,
      {
        headers,
        params,
      }
    );
  }
  getRecapDossier(dossierId: number): Observable<RecapDossierApiResponse> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/recapDossier/${dossierId}`;

    return this.http.get<RecapDossierApiResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error(
          `Erreur lors de la récupération du récapitulatif du dossier avec l'ID ${dossierId}:`,
          error
        );
        return throwError(
          () =>
            new Error(
              "Une erreur est survenue lors de la récupération du récapitulatif du dossier."
            )
        );
      })
    );
  }
  downloadFile(
    dossierId: number,
    moduleId: number
  ): Observable<HttpResponse<Blob>> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/open-file?idDossier=${dossierId}&idModuleElement=${moduleId}`;

    return this.http
      .get(url, { headers, responseType: "blob", observe: "response" })
      .pipe(
        catchError((error) => {
          console.error("Error during file download:", error);
          return throwError(
            () => new Error("Erreur lors du téléchargement du fichier.")
          );
        })
      );
  }

  downloadFolder(
    dossierId: number,
    moduleId: number
  ): Observable<HttpResponse<Blob>> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/download-zip-module?idDossier=${dossierId}&idModule=${moduleId}`;

    return this.http
      .get(url, { headers, responseType: "blob", observe: "response" })
      .pipe(
        catchError((error) => {
          console.error("Error during download:", error);
          return throwError(
            () => new Error("Erreur lors du téléchargement du fichier.")
          );
        })
      );
  }
  downloadAllFiles(dossierId: number): Observable<HttpResponse<Blob>> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/download-zip-dossier?idDossier=${dossierId}`;

    return this.http
      .get(url, { headers, responseType: "blob", observe: "response" })
      .pipe(
        catchError((error) => {
          console.error("Error during download:", error);
          return throwError(
            () => new Error("Erreur lors du téléchargement du fichier.")
          );
        })
      );
  }

  recevoirDossier(dossierId: number): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/recevoirDossier/${dossierId}`;

    return this.http.post(url, {}, { headers }).pipe(
      catchError((error) => {
        console.error(
          `Erreur lors de la réception du dossier avec l'ID ${dossierId}:`,
          error
        );
        return throwError(error); // forward the full error response object
      })
    );
  }

  rejeterDossier(dossierId: number, motifRejet: string): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/rejeterDossier`;
    const body = { id: dossierId, motifRejet: motifRejet }; // Create the request body

    return this.http.post(url, body, { headers }).pipe(
      // Use POST, even if the backend doesn't require a body, it's a better practice than GET for this
      catchError((error) => {
        console.error(
          `Erreur lors du rejet du dossier avec l'ID ${dossierId}:`,
          error
        );
        return throwError(
          () => new Error("Une erreur est survenue lors du rejet du dossier.")
        );
      })
    );
  }
  getExaminateurs(): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get(`${this.apiUrl}/getExaminateurs`, { headers });
  }

  assignerDossier(dossierId: number, idExaminateur: number): Observable<any> {
    const body = { idDossier: dossierId, idExaminateur: idExaminateur };
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.post(`${this.apiUrl}/assignerDossier`, body, { headers });
  }
  getAllRecommendations(): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get(`${this.apiUrl}/allRecommendations`, { headers });
  }

  evaluerDossier(evaluationData: any): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.post(`${this.apiUrl}/evaluerDossier`, evaluationData, {
      headers,
    });
  }
  uploadEvaluationDocument(documentData: any): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/documentEvaluation`, documentData, {
      headers,
    });
  }
  downloadEvaluationFiles(dossierId: number): Observable<HttpResponse<Blob>> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/download-zip-evaluations?idDossier=${dossierId}`;

    return this.http
      .get(url, { headers, responseType: "blob", observe: "response" })
      .pipe(
        catchError((error) => {
          console.error("Error during download:", error);
          return throwError(
            () => new Error("Erreur lors du téléchargement du fichier.")
          );
        })
      );
  }
  getAllDecisions(): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/allDecisions`, { headers });
  }
  validerDossier(validationData: any): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.post(`${this.apiUrl}/validerDossier`, validationData, {
      headers,
    });
  }
  downloadAmmFile(dossierId: number): Observable<HttpResponse<Blob>> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/download-file-amm?idDossier=${dossierId}`;

    return this.http
      .get(url, { headers, responseType: "blob", observe: "response" })
      .pipe(
        catchError((error) => {
          console.error("Error during download:", error);
          return throwError(
            () => new Error("Erreur lors du téléchargement du fichier.")
          );
        })
      );
  }

  downloadEvaluationTechnique(
    idEvaluation: number
  ): Observable<HttpResponse<Blob>> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: "application/pdf",
    });

    const url = `${this.apiUrl}/download-rapport-technique-evaluation?idEvaluation=${idEvaluation}`;

    return this.http
      .get(url, {
        headers: headers,
        responseType: "blob",
        observe: "response",
      })
      .pipe(
        catchError((error) => {
          console.error("Error during download:", error);
          return throwError(
            () =>
              new Error(
                "Erreur lors du téléchargement du fichier d'évaluation."
              )
          );
        })
      );
  }

  downloadZipEvaluation(idEvaluation: number): Observable<HttpResponse<Blob>> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: "application/pdf",
    });

    const url = `${this.apiUrl}/download-zip-evaluation/${idEvaluation}`;

    return this.http
      .get(url, {
        headers: headers,
        responseType: "blob",
        observe: "response",
      })
      .pipe(
        catchError((error) => {
          console.error("Error during download:", error);
          return throwError(
            () =>
              new Error(
                "Erreur lors du téléchargement du fichier d'évaluation."
              )
          );
        })
      );
  }
}
