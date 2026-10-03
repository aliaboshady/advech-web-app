export type NameId = { name?: string; id?: string };

export type LocaleEntry = {
	en: string;
	ar: string;
};

export type QueryParam = {
	key: string;
	value: string | number | boolean | null | undefined;
	ignore?: (string | number | boolean)[];
};

export type ServerResponse<T> = {
	data?: T;
	success?: boolean;
	error?: ErrorResponse;
};

export type FieldErrorDetail = {
	field?: string;
	constraints?: string[];
};

export type ErrorResponse = {
	code: string;
	message: string;
	details?: FieldErrorDetail[] | Record<string, unknown>;
};

export type PaginatedPayload = {
	page: number;
	limit: number;
	search?: string;
	orderBy?: string;
	orderType?: SortType;
};

export type Paginated<T> = {
	docs: T[];
	limit: number;
	totalItems: number;
	page: number;
	totalPages: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
};

export type PaginatedResponse<T> = ServerResponse<Paginated<T>>;

export type SortType = "asc" | "desc";

export type Dir = "ltr" | "rtl";

export type NameID = {
	id: string;
	name: string;
	username: string;
};

export type MimeType =
	| "text/csv"
	| "application/pdf"
	| "application/json"
	| "text/plain"
	| "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export type Item = {
	value: string;
	label: string;
	labelNode?: React.ReactNode;
};
