export interface Laboratoire {
  id?: number;
  nom: string;
  type: string;
  adresse: string;
  pays: string;
  telephone: string;
  email: string;
  siteWeb: string;
  contactPrincipal: string;
  documentsAgrement: string;
  dateEnregistrement: string; // Format ISO 8601
  statut: string;
}

// L'API ne retourne pas un objet avec "content", donc on supprime ApiResponse
