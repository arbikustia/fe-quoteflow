export type ApiMessages = string[] | string | null;

export type ApiEnvelope<TData> = {
  status: boolean;
  data: TData;
  messages: ApiMessages;
};

export type PaginationMetadata = {
  page_number: number;
  total_pages: number;
  total_count: number;
  has_previous: boolean;
  has_next: boolean;
};

export type PaginatedResponse<TItem> = PaginationMetadata & {
  data: TItem[];
};

export type ApiQueryParams = {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
};

export type GenericQueryArgs = {
  url: string;
  params?: ApiQueryParams;
};

export type GenericMutationArgs<TBody> = {
  url: string;
  body: TBody;
};

export type ApiError = {
  status: number;
  data: ApiMessages;
};

export type ApiBaseItem = {
  id?: string;
  name?: string;
};

export type ApiBaseData = ApiEnvelope<ApiBaseItem | ApiBaseItem[] | null>;
