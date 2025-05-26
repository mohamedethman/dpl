import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { environment } from "../../../../environments/environment";
import { AuthenticationService } from "../../../service/authenticationService";
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
  getDossiersByStatut(statut: string, params?: any): Observable<ApiResponse> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Initialize HttpParams with statut parameter
    let queryParams = new HttpParams().set("statut", statut);

    // Add pagination parameters if they exist
    if (params) {
      if (params.page !== undefined) {
        queryParams = queryParams.set("page", params.page.toString());
      }
      if (params.size !== undefined) {
        queryParams = queryParams.set("size", params.size.toString());
      }
      if (params.sort) {
        queryParams = queryParams.set("sort", params.sort);
      }
    }

    return this.http.get<ApiResponse>(
      `${this.apiUrl}/allDossierByStatut/${statut}`,
      {
        headers,
        params: queryParams, // Include the query parameters in the request
      }
    );
  }

  getDossiersBySuperviseur(params?: any): Observable<ApiResponse> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Initialize HttpParams
    let queryParams = new HttpParams();

    // Add pagination parameters if they exist
    if (params) {
      if (params.page !== undefined) {
        queryParams = queryParams.set("page", params.page.toString());
      }
      if (params.size !== undefined) {
        queryParams = queryParams.set("size", params.size.toString());
      }
    }

    return this.http.get<ApiResponse>(
      `${this.apiUrl}/allDossierBySuperviseur`,
      {
        headers,
        params: queryParams, // Include the query parameters in the request
      }
    );
  }
  allDossierByLaboNational(): Observable<ApiResponse> {
    // Renamed method and to French
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .get<ApiResponse>(`${this.apiUrl}/allDossierByLaboNational`, { headers })
      .pipe(
        map((response) => response) // You can remove the map(response => response), it's redundant
      );
  }

  getDossiersByExaminateur(params?: any): Observable<ApiResponse> {
    const token = this.authService.getJwtToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Initialize HttpParams
    let queryParams = new HttpParams();

    // Add pagination parameters if they exist
    if (params) {
      if (params.page !== undefined) {
        queryParams = queryParams.set("page", params.page.toString());
      }
      if (params.size !== undefined) {
        queryParams = queryParams.set("size", params.size.toString());
      }
    }

    return this.http.get<ApiResponse>(
      `${this.apiUrl}/allDossierByExaminateur`,
      {
        headers,
        params: queryParams, // Include the query parameters in the request
      }
    );
  }
}
