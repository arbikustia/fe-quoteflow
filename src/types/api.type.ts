export type ApiMessages = string[] | string | null;

export type ApiEnvelope<TData> = {
  readonly status: boolean;
  readonly data: TData;
  readonly messages: ApiMessages;
};

export type PaginationMetadata = {
  readonly page_number: number;
  readonly total_pages: number;
  readonly total_count: number;
  readonly has_previous: boolean;
  readonly has_next: boolean;
};

export type PaginatedResponse<TItem> = PaginationMetadata & {
  readonly data: TItem[];
};

export type ApiQueryParams = {
  readonly PageNumber?: number;
  readonly PageSize?: number;
  readonly SearchTerm?: string;
};

export type GenericQueryArgs = {
  readonly url: string;
  readonly params?: ApiQueryParams;
};

export type GenericMutationArgs<TBody> = {
  readonly url: string;
  readonly body: TBody;
};

export type ApiError = {
  readonly status: number;
  readonly data: ApiMessages;
};

export type ApiBaseItem = {
  readonly id?: string;
  readonly name?: string;
};

export type ApiBaseData = ApiEnvelope<ApiBaseItem | ApiBaseItem[] | null>;
