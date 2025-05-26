// src/app/services/Laboratoires.service.ts

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { AuthenticationService } from "src/app/service/authenticationService";
import { environment } from "src/environments/environment";
import { Laboratoire } from "../models/laboratoires";
import { LaboratoireResponse } from "../models/laboratoire-response";

@Injectable({
  providedIn: "root",
})
export class LaboratoiresService {
  private apiUrl = `${environment.baseUrl}`;
  LaboratoireList: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getJwtToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAllLaboratoires(): Observable<Laboratoire[]> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .get<Laboratoire[]>(`${this.apiUrl}/listLaboratoires`, { headers })
      .pipe(
        catchError((error) => {
          console.error(
            "Erreur lors de la récupération des laboratoires :",
            error
          );
          return of([]); // Retourne un tableau vide en cas d'erreur pour éviter le crash
        })
      );
  }
  getAllLaboratoiresNonValides(
    page: number,
    size: number,
    sort?: string,
    search?: string
  ): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString());

    if (sort) params = params.set("sort", sort);
    if (search) params = params.set("search", search);

    console.log(
      "Making request to:",
      `${this.apiUrl}/allLaboratoiresNonValides`
    );
    console.log("With params:", params.toString());

    return this.http
      .get(`${this.apiUrl}/allLaboratoiresNonValides`, { headers, params })
      .pipe(
        tap((response) => console.log("API Response:", response)),
        catchError((error) => {
          console.error("API Error:", error);
          return of({
            data: [],
            totalElements: 0,
          });
        })
      );
  }

  validerLaboratoire(id: number): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    // POST request to /validerLaboratoire/{id}
    return this.http
      .post(
        `${this.apiUrl}/validerLaboratoire/${id}`,
        {}, // Empty body if not required
        { headers }
      )
      .pipe(
        tap((response) => console.log("Validation successful:", response)),
        catchError((error) => {
          console.error("Error validating laboratoire:", error);
          return throwError(
            () => new Error("Échec de la validation du laboratoire")
          );
        })
      );
  }

  saveLaboratoire(
    laboratoire: Laboratoire
  ): Observable<{ success: boolean; message: string; data?: any }> {
    const url = `${this.apiUrl}/saveLaboratoire`;

    console.log("Payload being sent to the backend:", laboratoire);

    return this.http
      .post<any>(url, laboratoire, { headers: this.getHeaders() })
      .pipe(
        map((response) => {
          return {
            success: true,
            message: "Laboratoire enregistré avec succès.",
            data: response,
          };
        }),
        catchError((error) => {
          console.error("Erreur lors de l'ajout du Laboratoire:", error);
          return of({
            success: false,
            message: error.message || "Erreur lors de l'ajout du Laboratoire.",
          });
        })
      );
  }

  updateLaboratoire(
    laboratoire: Laboratoire
  ): Observable<{ success: boolean; message: string; data?: any }> {
    const url = `${this.apiUrl}/updateLaboratoire`;

    console.log("Payload being sent to the backend for update:", laboratoire);

    return this.http
      .post<any>(url, laboratoire, { headers: this.getHeaders() })
      .pipe(
        map((response) => {
          return {
            success: true,
            message: "Laboratoire mis à jour avec succès.",
            data: response,
          };
        }),
        catchError((error) => {
          console.error("Erreur lors de la mise à jour du Laboratoire:", error);
          return of({
            success: false,
            message:
              error.message || "Erreur lors de la mise à jour du Laboratoire.",
          });
        })
      );
  }

  deleteLaboratoire(id: number): Observable<any> {
    const url = `${this.apiUrl}/deleteLaboratoire/${id}`;
    return this.http.delete(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error("Erreur lors de la suppression du Laboratoire:", error);
        return throwError(
          () => new Error("Erreur lors de la suppression du Laboratoire.")
        );
      })
    );
  }
}
