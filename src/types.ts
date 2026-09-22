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

export type BackendResponse<T> = {
	data?: T;
	success?: boolean;
	error?: ErrorResponse;
	meta?: PaginationMeta;
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

export type PaginationMeta = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

export type PaginatedPayload = {
	page: number;
	limit: number;
	search?: string;
	orderBy?: string;
	orderType?: SortType;
};

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
