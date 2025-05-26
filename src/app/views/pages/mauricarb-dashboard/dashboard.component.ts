import {Component, Input, OnInit} from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import {Utilisateur} from "../mauricarb-parametrage/modele/Utilisateur";
import {AuthenticationService} from "../../../service/authenticationService";
import {Router} from "@angular/router";
import {Roles} from "../../layout/navbar/roles";
import {CncmpEnregistrementService} from "../mauricarb-enregistrement/cncmp-enregistrement.service";
import {NgxPermissionsService} from "ngx-permissions";
import {IdleService} from "../../../service/idle-service";
import {environment} from "../../../../environments/environment";
import {DossierTraiteType} from "./modele/graphes";

import Accessbility from "highcharts/modules/accessibility";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms'; // Add FormGroup here



@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    preserveWhitespaces: true
})
export class DashboardComponent{

  steps: any[] = 
  
  [
    {
      "id": 1,
      "libelle": "Dossiers Administratifs",
      "module_numero": 1,
      "elements": [
        {
          "id": 1,
          "nom_element": "Lettre de demande d'AMM",
          "obligatoire": true,
          "ordre_affichage": 1,
          "type_element": "textarea",
          "id_module": 1
        },
        {
          "id": 2,
          "nom_element": "Information sur le demandeur d'AMM",
          "obligatoire": true,
          "ordre_affichage": 2,
          "type_element": "text",
          "id_module": 1
        },
        {
          "id": 3,
          "nom_element": "Licence de fabrication (Fabricant)",
          "obligatoire": true,
          "ordre_affichage": 3,
          "type_element": "file",
          "id_module": 1
        },
        {
          "id": 4,
          "nom_element": "Attestation de commercialisation",
          "obligatoire": true,
          "ordre_affichage": 4,
          "type_element": "file",
          "id_module": 1
        },
        {
          "id": 5,
          "nom_element": "Prix grossiste hors taxe",
          "obligatoire": true,
          "ordre_affichage": 5,
          "type_element": "text",
          "id_module": 1
        }
      ]
    },
    {
      "id": 2,
      "libelle": "Résumé du dossier technique",
      "module_numero": 2,
      "elements": [
        {
          "id": 6,
          "nom_element": "Résumé des données sur la substance active",
          "obligatoire": true,
          "ordre_affichage": 1,
          "type_element": "textarea",
          "id_module": 2
        },
        {
          "id": 7,
          "nom_element": "Information sur le Fabriquant",
          "obligatoire": true,
          "ordre_affichage": 2,
          "type_element": "textarea",
          "id_module": 2
        },
        {
          "id": 8,
          "nom_element": "Méthode de caracterisation",
          "obligatoire": true,
          "ordre_affichage": 3,
          "type_element": "textarea",
          "id_module": 2
        },
        {
          "id": 9,
          "nom_element": "Méthode de Controle",
          "obligatoire": true,
          "ordre_affichage": 4,
          "type_element": "textarea",
          "id_module": 2
        },
        {
          "id": 10,
          "nom_element": "Data de stabilité",
          "obligatoire": true,
          "ordre_affichage": 5,
          "type_element": "textarea",
          "id_module": 2
        }
      ]
    },
    {
      "id": 3,
      "libelle": "Dossier qualité",
      "module_numero": 3,
      "elements": [
        {
          "id": 11,
          "nom_element": "Table des matières (Substance Active)",
          "obligatoire": true,
          "ordre_affichage": 1,
          "type_element": "textarea",
          "id_module": 3
        },
        {
          "id": 12,
          "nom_element": "Nomenclature (Substance Active)",
          "obligatoire": true,
          "ordre_affichage": 2,
          "type_element": "textarea",
          "id_module": 3
        },
        {
          "id": 13,
          "nom_element": "processus de controle (Substance Active)",
          "obligatoire": true,
          "ordre_affichage": 3,
          "type_element": "textarea",
          "id_module": 3
        },
        {
          "id": 14,
          "nom_element": "Valider Fabrication (Substance Active)",
          "obligatoire": true,
          "ordre_affichage": 4,
          "type_element": "textarea",
          "id_module": 3
        },
        {
          "id": 15,
          "nom_element": "analyse impurete (Substance Active)",
          "obligatoire": true,
          "ordre_affichage": 5,
          "type_element": "textarea",
          "id_module": 3
        }
      ]
    },
    {
      "id": 4,
      "libelle": "Dossier non clinique",
      "module_numero": 4,
      "elements": [
        {
          "id": 16,
          "nom_element": "Rapport phamaco",
          "obligatoire": true,
          "ordre_affichage": 1,
          "type_element": "textarea",
          "id_module": 4
        },
        {
          "id": 17,
          "nom_element": "Méthodes et Rapports",
          "obligatoire": true,
          "ordre_affichage": 2,
          "type_element": "textarea",
          "id_module": 4
        },
        {
          "id": 18,
          "nom_element": "Information Toxicologie",
          "obligatoire": true,
          "ordre_affichage": 3,
          "type_element": "textarea",
          "id_module": 4
        },
        {
          "id": 19,
          "nom_element": "toxicité",
          "obligatoire": true,
          "ordre_affichage": 4,
          "type_element": "textarea",
          "id_module": 4
        },
        {
          "id": 20,
          "nom_element": "Autre Etude",
          "obligatoire": true,
          "ordre_affichage": 5,
          "type_element": "textarea",
          "id_module": 4
        }
      ]
    },
    {
      "id": 5,
      "libelle": "Dossier clinique",
      "module_numero": 5,
      "elements": [
        {
          "id": 21,
          "nom_element": "Etude",
          "obligatoire": true,
          "ordre_affichage": 1,
          "type_element": "textarea",
          "id_module": 5
        },
        {
          "id": 22,
          "nom_element": "Information Biopharmaceutique",
          "obligatoire": true,
          "ordre_affichage": 2,
          "type_element": "textarea",
          "id_module": 5
        },
        {
          "id": 23,
          "nom_element": "Liaison Protéine",
          "obligatoire": true,
          "ordre_affichage": 3,
          "type_element": "textarea",
          "id_module": 5
        },
        {
          "id": 24,
          "nom_element": "Materiel Humain",
          "obligatoire": true,
          "ordre_affichage": 4,
          "type_element": "textarea",
          "id_module": 5
        },
        {
          "id": 25,
          "nom_element": "Data d'Efficacité",
          "obligatoire": true,
          "ordre_affichage": 5,
          "type_element": "textarea",
          "id_module": 5
        }
      ]
    }
  ];

  selectedIndex: number = 0;
  formGroups: UntypedFormGroup[] = [];
  formSubmitted: boolean = false;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit() {
    this.steps.forEach(step => {
      // Create form groups dynamically for each step
      const group = this.fb.group({});
      step.elements.forEach(element => {
        if (element.type_element === 'textarea') {
          group.addControl(element.nom_element, this.fb.control('', Validators.required));
        } else if (element.type_element === 'text') {
          group.addControl(element.nom_element, this.fb.control('', Validators.required));
        } else if (element.type_element === 'file') {
          group.addControl(element.nom_element, this.fb.control(null, Validators.required));
        }
      });
      this.formGroups.push(group);
    });
  }

  goBack() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  goForward() {
    if (this.selectedIndex < this.steps.length - 1) {
      this.selectedIndex++;
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.formGroups[this.selectedIndex].valid) {
      console.log('Form Data:', this.formGroups[this.selectedIndex].value);
    }
  }

  isPanelVisible: boolean = false;

  toggleUserPanel(): void {
    this.isPanelVisible = !this.isPanelVisible;
  }

  logout(): void {
    // Implement your logout logic here
    console.log('Logging out...');
    // Optionally, add logic for redirecting or clearing session data
  }
}