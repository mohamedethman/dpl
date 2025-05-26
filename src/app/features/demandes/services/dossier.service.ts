import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import { AuthenticationService } from '../../../service/authenticationService';
import { RecapDossierApiResponse,ApiResponse,Dossier } from '../../dossier/models/dossier-details';

import {environment} from '../../../../environments/environment.prod';



@Injectable({
    providedIn: 'root'
})
export class DossierService {  // Renamed to a service name



    private apiUrl = `${environment.baseUrl}`;


    constructor(private http: HttpClient, private authService: AuthenticationService) {}


    getDossiersBrouillon(): Observable<ApiResponse> { // Renamed method and to French
        const token = this.authService.getJwtToken();
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

        return this.http.get<ApiResponse>(`${this.apiUrl}/allDossierByStatut/DRAFT`, { headers }).pipe(
            map(response => response) // You can remove the map(response => response), it's redundant
        );
    }


    allDossierByLabConnected(): Observable<ApiResponse> { // Renamed method and to French
        const token = this.authService.getJwtToken();
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

        return this.http.get<ApiResponse>(`${this.apiUrl}/allDossierByLabConnected`, { headers }).pipe(
            map(response => response) // You can remove the map(response => response), it's redundant
        );
    }
    getRecapDossier(dossierId: number): Observable<RecapDossierApiResponse> {
        const token = this.authService.getJwtToken();
        console.log("ici");
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        const url = `${this.apiUrl}/recapDossier/${dossierId}`;
           // +"/${dossierId}`;

        return this.http.get<RecapDossierApiResponse>(url, { headers }).pipe(
            catchError(error => {
                console.error(`Erreur lors de la récupération du récapitulatif du dossier avec l'ID ${dossierId}:`, error);
                return throwError(() => new Error('Une erreur est survenue lors de la récupération du récapitulatif du dossier.'));
            })
        );
    }
    recevoirDossier(dossierId: number): Observable<any> {
        const token = this.authService.getJwtToken();
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        const url =`${this.apiUrl}/recevoirDossier/${dossierId}`;

        return this.http.post(url, {}, { headers }).pipe(  // Use POST, even if the backend doesn't require a body, it's a better practice than GET for this
            catchError(error => {
                console.error(`Erreur lors de la réception du dossier avec l'ID ${dossierId}:`, error);
                return throwError(() => new Error('Une erreur est survenue lors de la réception du dossier.'));
            })
        );
    }

    rejeterDossier(dossierId: number): Observable<any> {
        const token = this.authService.getJwtToken();
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        const url = `${this.apiUrl}/rejeterDossier/${dossierId}`;

        return this.http.post(url, {}, { headers }).pipe(  // Use POST, even if the backend doesn't require a body, it's a better practice than GET for this
            catchError(error => {
                console.error(`Erreur lors du rejet du dossier avec l'ID ${dossierId}:`, error);
                return throwError(() => new Error('Une erreur est survenue lors du rejet du dossier.'));
            })
        );
    }
    getDossierById(id: number): Observable<Dossier> {
        const token = this.authService.getJwtToken();
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        const url = `amm-web-backend/dossier/${id}`; // Adjust the endpoint as needed

        return this.http.get<Dossier>(url, { headers }).pipe(
            catchError(error => {
                console.error(`Erreur lors de la récupération du dossier avec l'ID ${id}:`, error);
                return throwError(() => new Error('Une erreur est survenue lors de la récupération des détails du dossier.'));
            })
        );
    }
}