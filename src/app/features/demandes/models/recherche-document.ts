// document.model.ts
export interface Document {
  idDossier: number;
  nomMedicament: string;
  dateAutorisation: string | null;
  entiteEmetrice: string;
  typeDocument?: string; // Optional since it's not in response but might be useful
}

export interface RechercheDocumentResponse {
  data: Document[];
  estModeConnecte: boolean;
  messagesErrors: any;
  messagesInfo: any;
  langueCourante: string;
  totalElements: number;
}

export interface RechercheDocumentRequest {
  typeDocument: string;
  id?: number;
  page?: number;
  size?: number; // Optional for DPL profile
}
