type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data?: T;
	token?: string,
	errors?: string[];
}

export interface ApiOptions {
	endpoint: string;
	method?: HttpMethod;
	data?: Record<string, unknown> | null;
	token?: string | null;
}
