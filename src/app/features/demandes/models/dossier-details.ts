export interface Medicament {
  id: number;
  nomMedicament: string;
  codeATC: CodeATC | null; // codeATC can be null
  dci: DCI | null; // dci can be null
  formePharmaceutique: string;
  dosage: string;
  voieAdministration: string;
  conditionnement: string;
  statut: string;
  substances: any[]; // Define type if known, otherwise use any[]
}
export interface CodeATC {
  id: number;
  codeATC: string;
  description: string;
}

export interface DCI {
  id: number;
  nomSubstance: string;
  typeSubstance: string;
}
export interface RecapDossierApiResponse {
  data: DossierModuleElement[];
  estModeConnecte: boolean;
  messagesErrors: null | string[];
  messagesInfo: null | string[];
  langueCourante: string;
  totalElements: number;
}

export interface DossierModuleElement {
  id: number;
  moduleElement: ModuleElement;
  dossier: Dossier;
  contenuTexte: string;
  fichier: null;
  dateSoumission: string;
}

export interface ModuleElement {
  id: number;
  module: Module;
  nomElement: string;
  typeElement: string;
  obligatoire: boolean;
  ordreAffichage: number;
}

export interface Module {
  id: number;
  libelle: string;
  moduleNumero: number;
}

export interface MedicamentDetails {
  id: number;
  nomMedicament: string;
  autreAtc: any; // or string | null
  autreDci: any; // or string | null
  laboratoire: Laboratoire;
  codeATC: CodeATC | null; // codeATC can be null
  dci: DCI | null; // dci can be null
  formePharmaceutique: string;
  libFormePharmaceutique: string;
  dosage: string;
  libDosage: string;
  voieAdministration: string;
  libVoieAdministration: string;
  conditionnement: string;
  libConditionnement: string;
  statut: string;
  substances: any[];
}

export interface CodeATC {
  id: number;
  codeATC: string;
  description: string;
}

export interface DCI {
  id: number;
  nomSubstance: string;
  typeSubstance: string;
}
export interface Laboratoire {
  id: number;
  nom: string;
  type: string;
  adresse: string;
  pays: string;
  telephone: string;
  email: string;
  siteWeb: string;
  contactPrincipal: string;
  documentsAgrement: string;
  dateEnregistrement: string;
  statut: string;
}
export interface ApiResponse {
  data: Dossier[];
  estModeConnecte: boolean;
  messagesErrors: string[] | null;
  messagesInfo: string[] | null;
  langueCourante: string;
  totalElements: number;
}
export interface Dossier {
  id: number;
  medicament: MedicamentDetails;
  typeDossier: string;
  dateSoumission: string | null;
  statut: string;
  synthese: null;
  renouvellement: boolean;
  currentStep: number;
}
