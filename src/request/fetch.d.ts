import UrlSearchParams from '../UrlSearchParams';
import { Hash } from '../interfaces';
import Promise from '../Promise';
import ReadableStream = NodeJS.ReadableStream;

type ReferrerPolicy = '' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin-only' |
	'origin-when-cross-origin' | 'unsafe-url';
type RequestMode = 'navigate' | 'same-origin' | 'no-cors' | 'cors';
type RequestCredentials = 'omit' | 'same-origin' | 'include';
type RequestCache = 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache';
type RequestRedirect = 'follow' | 'error' | 'manual';
type RequestType = '' | 'audio' | 'font' | 'image' | 'script' | 'style' | 'track' | 'video';
type RequestDestination = '' | 'document' | 'embed' | 'font' | 'image' | 'manifest' | 'media' | 'object' |
	'report' | 'script' | 'serviceworker' | 'sharedworker' | 'style' |  'worker' | 'xslt';
type ResponseType = 'basic' | 'cors' | 'default' | 'error' | 'opaque' | 'opaqueredirect';
type BufferSource = Uint8Array;
type HeadersInit = Hash<string>;

interface Headers {
	append(name: string, value: string): void;
	delete(name: string): void;
	get(name: string): string;
	has(name: string): boolean;
	set(name: string, value: string): void;
	// TODO enable definition w/ future iterator support
	// #if es6
	// [Symbol.iterator](): IterableIterator<[string, string]>
	// #endif
}

interface HeadersConstructor {
	new (init?: HeadersInit): Headers;
}

export interface RequestInit {
	method?: string;
	headers?: Headers;
	body?: Blob | FormData | UrlSearchParams | BufferSource | string;
	referrer?: string;
	referrerPolicy?: ReferrerPolicy;
	mode?: RequestMode;
	credentials?: RequestCredentials;
	cache?: RequestCache;
	redirect?: RequestRedirect;
	integrity?: string;
}

interface Body {
	bodyUsed: boolean;
	arrayBuffer(): Promise<ArrayBuffer>;
	blob(): Promise<Blob>;
	formData(): Promise<FormData>;
	json(): Promise<Object>;
	text(): Promise<string>;
}

interface Request extends Body {
	method: string;
	url: string;
	headers: Headers;
	type: RequestType;
	destination: RequestDestination;
	referrer: string;
	referrerPolicy: ReferrerPolicy;
	mode: RequestMode;
	credentials: RequestCredentials;
	cache: RequestCache;
	redirect: RequestRedirect;
	integrity: string;

	clone(): Request;
}

interface RequestConstructor {
	new (request: string | Request, init?: RequestInit): Request;
}

interface Response extends Body {
	type: ResponseType;
	url: string;
	redirected: boolean;
	status: number;
	ok: boolean;
	statusText: string;
	headers: Headers;
	body?: ReadableStream;

	clone(): Response;
}

type BodyInit = Blob | BufferSource | FormData | UrlSearchParams | string;

interface ResponseInit {
	status: number;
	statusText: string;
	headers: HeadersInit;
}

interface ResponseConstructor {
	new (body: BodyInit, init?: ResponseInit): Response;
	error(): Response;
	redirect(url: string, status?: number);
}

export { RequestConstructor as Request };
export { HeadersConstructor as Headers };
export { ResponseConstructor as Response };

export interface Fetch {
	(request: string | Request, init?: RequestInit): Promise<Response>;
}
