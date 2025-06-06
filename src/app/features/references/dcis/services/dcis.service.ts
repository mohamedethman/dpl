// src/app/services/dcis.service.ts

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AuthenticationService } from "src/app/service/authenticationService";

import { AppConfigService } from "src/app/app-config.service";
import { Dci } from "../models/dcis";
import { ApiResponse } from "../models/dcis";

@Injectable({
  providedIn: "root",
})
export class DcisService {
  private apiUrl: string;

  dciList: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private appConfig: AppConfigService
  ) {
    this.apiUrl = this.appConfig.getConfig().baseUrl;
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getJwtToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getDciById(id: number): Observable<Dci> {
    const url = `${this.apiUrl}/getDci?id=${id}`;
    return this.http.get<Dci>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error("Erreur lors de la récupération du DCI:", error);
        return throwError(
          () => new Error("Erreur lors de la récupération du DCI.")
        );
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

  getAllTypeDcis(): Observable<{ code: string; libelle: string }[]> {
    const url = `${this.apiUrl}/allTypeDcis`;
    return this.http
      .get<{ data: { code: string; libelle: string }[] }>(url, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => response.data), // Extract the 'data' array
        catchError((error) => {
          console.error(
            "Erreur lors de la récupération des types de DCI:",
            error
          );
          return throwError(
            () => new Error("Erreur lors de la récupération des types de DCI.")
          );
        })
      );
  }

  saveDci(
    dci: Dci
  ): Observable<{ success: boolean; message: string; data?: any }> {
    const url = `${this.apiUrl}/saveDci`;

    // Log the payload being sent to the backend
    console.log("Payload being sent to the backend:", dci);

    return this.http.post<any>(url, dci, { headers: this.getHeaders() }).pipe(
      map((response) => {
        // Handle successful response
        return {
          success: true,
          message: "DCI enregistré avec succès.",
          data: response, // Include the API response data if needed
        };
      }),
      catchError((error) => {
        // Handle error response
        console.error("Erreur lors de l'ajout du DCI:", error);
        return of({
          success: false,
          message: error.message || "Erreur lors de l'ajout du DCI.",
        });
      })
    );
  }

  deleteDci(id: number): Observable<any> {
    const url = `${this.apiUrl}/deleteDci/${id}`;
    return this.http.delete(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error("Erreur lors de la suppression du DCI:", error);
        return throwError(
          () => new Error("Erreur lors de la suppression du DCI.")
        );
      })
    );
  }
}
