export class SearchDto {
  orderBy: string;
  order: 'ASC' | 'DESC' = 'DESC';
  page: number = 1;
  limit: number = 20;
  searchText?: string;
}
