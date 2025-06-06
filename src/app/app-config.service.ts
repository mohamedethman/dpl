import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return this.http
      .get('/assets/parametres.json')
      .toPromise()
      .then(config => {
        this.config = config;
      })
      .catch(() => {
        this.config = {
          ip: 'http://localhost',
          port: '8095',
          context: '/api'
        };
      });
  }

  get Config() {
    return this.config;
  }

  getConfig() {
  return this.config;
}


  get host(): string {
    return `${this.config.ip}:${this.config.port}${this.config.context}`;
  }
}
