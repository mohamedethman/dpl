export class EntiteSante{
    id: number;
    nom: string;
    code: string;
    supprimer: boolean;
}

export class ServiceMedical{
    id: number;
    nom: string;
    entiteSante: EntiteSante;
    supprimer: boolean;
}

export class Appareil{
    id: number;
    nom: string;
    imei: string;
    structure: EntiteSante;
    version: string;
    longitude: number;
    latitude: number;
    lastDateUpdate: Date;
    dateStart: Date;
    supprimer: boolean;
}

export class Prestation{
    id: number;
    code: string;
    prestation: string
    typePrestation: string;
}