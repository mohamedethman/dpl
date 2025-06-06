// src/app/core/services/config.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    constructor(private http: HttpClient) { }

    getVersion(): Observable<any> {
        return this.http.get('assets/version.json'); // Corrected path
    }
}