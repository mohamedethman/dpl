// models/laboratoire-response.ts
export interface LaboratoireResponse {
  data: Laboratoire[];
  estModeConnecte: boolean;
  messagesErrors: string | null;
  messagesInfo: string | null;
  langueCourante: string;
  totalElements: number;
}

// models/laboratoire.ts
export interface Laboratoire {
  id: number;
  nom: string;
  code: string;
  type: string;
  adresse: string;
  pays: string;
  telephone: string;
  email: string;
  siteWeb: string;
  contactPrincipal: string;
  documentsAgrement: any; // You might want to create a specific type for this
  dateEnregistrement: string;
  statut: string;
  login: string | null;
  password: string | null;
}
