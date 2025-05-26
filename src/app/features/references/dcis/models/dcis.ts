export interface Dci {
  id?: number;
  nomSubstance: string; // Ensure property names match the API response
  typeSubstance: string; // Ensure property names match the API response
}

export interface ApiResponse {
  content: Dci[];
  totalElements: number;
  totalPages: number;
  pageable: {
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
  };
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
