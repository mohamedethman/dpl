import { DossierModuleElement } from "./dossier-details";

// export interface Dossier {
//     id: number;
//     medicament: {
//         id: number;
//         nomMedicament: string;
//         autreAtc: any;
//         autreDci: any;
//         laboratoire: {
//             id: number;
//             nom: string;
//             type: string;
//             adresse: string;
//             pays: string;
//             telephone: string;
//             email: string;
//             siteWeb: string;
//             contactPrincipal: string;
//             documentsAgrement: string;
//             dateEnregistrement: string;
//             statut: string;
//         };
//         codeATC: {
//             id: number;
//             codeATC: string;
//             description: string;
//         };
//         dci: {
//             id: number;
//             nomSubstance: string;
//             typeSubstance: string;
//         };
//         formePharmaceutique: string;
//         libFormePharmaceutique: string; // Changed to string
//         dosage: string;
//         libDosage: string; // Changed to string
//         voieAdministration: string;
//         libVoieAdministration: string; // Changed to string
//         conditionnement: string;
//         libConditionnement: string; // Changed to string
//         statut: string;
//         substances: any[];
//     };
//     typeDossier: string;
//     dateSoumission: string;
//     statut: string;
//     statutCode: string;
//     statutLibelle: string;
//     synthese: any;
//     currentStep: number | null; // Added currentStep
//     evaluations: any; // Added evaluations
// }

export interface Pageable {
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  offset: number;
  pageSize: number;
  pageNumber: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}
export interface Laboratoire {
  // Added for clarity within Dossier's medicament
  id: number;
  nom: string;
  code?: string;
  type?: string;
  adresse?: string;
  pays: string; // Make sure this is just the country name/code for flag-icon
  telephone?: string;
  email?: string;
  siteWeb?: string;
  contactPrincipal?: string;
  documentsAgrement?: string;
  dateEnregistrement?: string; // Or Date
  statut?: string;
  login?: any; // or string
  password?: any; // or string
}

export interface CodeATC {
  // Added for clarity
  id: number;
  codeATC: string;
  description: string;
}

export interface Devise {
  // Added for clarity
  id: number;
  devise: string;
  symbol: string;
}

export interface Medicament {
  // Expanded Medicament interface
  id: number;
  nomMedicament: string;
  autreAtc?: any; // or string
  autreDci?: any; // or string
  laboratoire: Laboratoire;
  nomFabricant?: string;
  adresseFabricant?: string;
  codeATC?: CodeATC;
  dci?: any; // or specific type if known
  formePharmaceutique?: string;
  libFormePharmaceutique?: string;
  dosage?: any; // or string/number
  libDosage?: any; // or string
  voieAdministration?: string;
  libVoieAdministration?: string;
  conditionnement?: any; // or string
  autreConditionnement?: string;
  libConditionnement?: any; // or string
  statut?: string;
  prixGrossisteHorsTaxe?: number;
  devise?: Devise;
  labFabriquant?: boolean;
  substances?: any; // or specific type
}

export interface Dossier {
  id: number;
  medicament: Medicament; // Use the more detailed Medicament interface
  typeDossier: string;
  dateSoumission: string; // Or Date
  dateAutorisation?: string | null; // Or Date
  dateValidation?: string | null; // Or Date
  statut: string;
  statutCode?: string;
  statutLibelle?: string;
  synthese?: any; // or specific type
  currentStep?: any; // or specific type
  evaluations?: any; // or specific type
  conformeEchantillons?: boolean;
  nbJoursRestants?: number;
}

export interface Message {
  // Example, adjust if your message structure is different
  code?: string; // Or some other fields if 'null' means no messages
  libelle?: string;
  // Add other properties if your messages have them
}

export interface DossierApiResponse {
  data: Dossier[]; // The list of dossiers
  estModeConnecte: boolean;
  messagesErrors: Message[] | null; // Can be an array of Message objects or null
  messagesInfo: Message[] | null; // Can be an array of Message objects or null
  langueCourante: string; // e.g., "FR"
  totalElements: number;

  // Optional: If your backend also sends these in the same response for POST pagination
  // (though less common for POST, more common for GET with Spring Pageable)
  content?: Dossier[]; // If backend sometimes uses 'content' instead of 'data' (unlikely for this specific response)
  totalPages?: number;
  number?: number; // current page (0-indexed from backend)
  size?: number; // page size from backend
}
export interface StatutResponse {
  data: { code: string; libelle: string }[];
  estModeConnecte: boolean;
  messagesErrors: null | string[];
  messagesInfo: null | string[];
  langueCourante: string;
  totalElements: number;
}
