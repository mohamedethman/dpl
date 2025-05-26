// src/app/models/step.model.ts

export interface ApiResponse {
    data: Step[]; // Array of Step objects
    estModeConnecte: boolean;
    messagesErrors: any;
    messagesInfo: any;
    langueCourante: string;
    totalElements: number;
    modules: Module[];
  }
  
  export interface Step {
    id: number;
    libelle: string;
    moduleNumero: number;
    moduleElements: ModuleElement[];
  }
  
  export interface ModuleElement {
    id: number;
    nomElement: string;
    typeElement: string;
    obligatoire: boolean;
    ordreAffichage: number;
  }
  


  interface Element {
    id: number;  // This is the idModuleElement
    nom_element: string;
    obligatoire: boolean;
    ordre_affichage: number;
    type_element: string;
    id_module: number;
  }
  
  interface Module {
    id: number;
    libelle: string;
    module_numero: number;
    elements: Element[];
  }
  