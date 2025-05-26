// src/app/services/dcis.service.ts

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AuthenticationService } from "src/app/service/authenticationService";
import { environment } from "src/environments/environment";
import { Atc } from "../models/atcs";
import { ApiResponse } from "../models/atcs";

@Injectable({
  providedIn: "root",
})
export class AtcsService {
  private apiUrl = `${environment.baseUrl}`;
  atcList: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getJwtToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAllAtcs(): Observable<ApiResponse> {
    // Renamed method and to French
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .get<ApiResponse>(`${this.apiUrl}/allCodeATCs`, { headers })
      .pipe(
        map((response) => response) // You can remove the map(response => response), it's redundant
      );
  }

  saveAtc(
    atc: Atc
  ): Observable<{ success: boolean; message: string; data?: any }> {
    const url = `${this.apiUrl}/saveAtc`;

    // Log the payload being sent to the backend
    console.log("Payload being sent to the backend:", atc);

    return this.http.post<any>(url, atc, { headers: this.getHeaders() }).pipe(
      map((response) => {
        // Handle successful response
        return {
          success: true,
          message: "Atc enregistré avec succès.",
          data: response, // Include the API response data if needed
        };
      }),
      catchError((error) => {
        // Handle error response
        console.error("Erreur lors de l'ajout du Atc:", error);
        return of({
          success: false,
          message: error.message || "Erreur lors de l'ajout du Atc.",
        });
      })
    );
  }

  updateAtc(
    atc: Atc
  ): Observable<{ success: boolean; message: string; data?: any }> {
    const url = `${this.apiUrl}/updateAtc`;

    // Log the payload being sent to the backend
    console.log("Payload being sent to the backend for update:", atc);

    return this.http.post<any>(url, atc, { headers: this.getHeaders() }).pipe(
      map((response) => {
        // Handle successful response
        return {
          success: true,
          message: "Atc mis à jour avec succès.",
          data: response, // Include the API response data if needed
        };
      }),
      catchError((error) => {
        // Handle error response
        console.error("Erreur lors de la mise à jour du Atc:", error);
        return of({
          success: false,
          message: error.message || "Erreur lors de la mise à jour du Atc.",
        });
      })
    );
  }

  deleteAtc(id: number): Observable<any> {
    const url = `${this.apiUrl}/deleteAtc/${id}`;
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
