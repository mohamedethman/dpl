import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

import { AuthenticationService } from "../../../service/authenticationService";
import { RecapDossierApiResponse } from "../models/dossier-details";
import { ApiResponse } from "../models/dossier";
import { AppConfigService } from "src/app/app-config.service";
@Injectable({
  providedIn: "root",
})
export class DossierService {
  // Renamed to a service name

  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private appConfig: AppConfigService
  ) {
    this.apiUrl = this.appConfig.getConfig().baseUrl; // or whatever your key is in parameters.json
  }

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

  allDossierByLabConnected(): Observable<ApiResponse> {
    // Renamed method and to French
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .get<ApiResponse>(`${this.apiUrl}/allDossierByLabConnected`, { headers })
      .pipe(
        map((response) => response) // You can remove the map(response => response), it's redundant
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

  downloadFile(dossierId: number, moduleId: number): Observable<Blob> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/open-file?idDossier=${dossierId}&idModuleElement=${moduleId}`;
    return this.http.get(url, { headers: headers, responseType: "blob" }).pipe(
      catchError((error) => {
        console.error("Error during download", error);
        return throwError(
          () => new Error("Erreur lors du téléchargement du fichier.")
        );
      })
    );
  }
  getRecapDossier(dossierId: number): Observable<RecapDossierApiResponse> {
    const token = this.authService.getJwtToken();
    console.log("ici");
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/recapDossier/${dossierId}`;
    // +"/${dossierId}`;

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
  recevoirDossier(dossierId: number): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/recevoirDossier/${dossierId}`;

    return this.http.post(url, {}, { headers }).pipe(
      // Use POST, even if the backend doesn't require a body, it's a better practice than GET for this
      catchError((error) => {
        console.error(
          `Erreur lors de la réception du dossier avec l'ID ${dossierId}:`,
          error
        );
        return throwError(
          () =>
            new Error(
              "Une erreur est survenue lors de la réception du dossier."
            )
        );
      })
    );
  }

  completerPlusTard(dossierId: number, moduleId: number): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/completerPlusTard`;

    return this.http
      .post(url, { currentStep: moduleId, id: dossierId }, { headers })
      .pipe(
        // Use POST, even if the backend doesn't require a body, it's a better practice than GET for this
        catchError((error) => {
          console.error(
            `Erreur lors de la réception du dossier avec l'ID ${dossierId}:`,
            error
          );
          return throwError(
            () =>
              new Error(
                "Une erreur est survenue lors de la réception du dossier."
              )
          );
        })
      );
  }

  rejeterDossier(dossierId: number): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.apiUrl}/rejeterDossier/${dossierId}`;

    return this.http.post(url, {}, { headers }).pipe(
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
}
