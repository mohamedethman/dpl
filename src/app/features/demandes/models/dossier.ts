export interface Dossier {
    id: number;
    medicament: Medicament;
    typeDossier: string;
    dateSoumission: string | null;
    statut: string;
    synthese: any; // Define type if known, otherwise use any
}
export interface Medicament {
    id: number;
    nomMedicament: string;
    codeATC: {
        id: number;
        codeATC: string;
        description: string;
    };
    dci: {
        id: number;
        nomSubstance: string;
        typeSubstance: string;
    };
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
