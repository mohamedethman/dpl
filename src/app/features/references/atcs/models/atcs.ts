export interface Atc {
  id?: number;
  codeATC: string; // Ensure property names match the API response
  description: string; // Ensure property names match the API response
}

export interface ApiResponse {
  data: Atc[];
  totalElements: number;
}
