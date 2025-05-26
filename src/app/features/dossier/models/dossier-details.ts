export interface ModuleRecap {
  id: number;
  numModule: number;
  moduleElements: ModuleElementRecap[];
}

export interface ModuleElementRecap {
  ordreAffichage: number;
  moduleElementData: ModuleElementData[];
  nomElement: string;
  typeElement: string;
  obligatoire: boolean;
  id: number;
}

export interface ModuleElementData {
  fichier: null;
  dateSoumission: string;
  contenuTexte: string;
  id: number;
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
  items: ModuleRecap[];
  estModeConnecte?: boolean;
  messagesErrors?: null | string[];
  messagesInfo?: null | string[];
  langueCourante?: string;
  totalElements?: number;
}
export interface Medicament {
  id: number;
  nomMedicament: string;
  codeATC: CodeATC | null;
  dci: DCI | null;
  formePharmaceutique: string;
  dosage: string;
  voieAdministration: string;
  conditionnement: string;
  statut: string;
  substances: any[];
  laboratoire: Laboratoire; // Added missing property
}

export interface Dossier {
  id: number;
  medicament: Medicament;
  typeDossier: string;
  conformeEchantillons: boolean;
  dateSoumission: string | null;
  statut: string;
  synthese: null;
  currentStep: number;
  evaluations: Evaluation[]; // Added missing property
}
export interface Examinateur {
  id: number;
  login: string;
  prenom: string;
  nom: string;
  // Other properties if needed
}
export interface Recommendation {
  code: string;
  libelle: string;
}
export interface RecapDossierApiResponse {
  data: DossierModuleElement[];
  estModeConnecte: boolean;
  conformeEchantillons: boolean;
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
export interface Evaluation {
  id: number;
  evaluateur: {
    id: number;
    login: string;
    prenom: string;
    nom: string;
  };
  dateEvaluation: string;
  commentaire: string;
  statutEvaluation: string;
  recommendation: string;
}
export interface Decision {
  code: string;
  libelle: string;
}
