// TODO fix this. TypeScript doesn't support importing defined modules into declarations.
type UrlSearchParams = { };
type ReadableStream = NodeJS.ReadableStream;

interface Thenable<T> {
	then<U>(onFulfilled?: (value?: T) => U | Thenable<U>, onRejected?: (error?: any) => U | Thenable<U>): Thenable<U>;
	then<U>(onFulfilled?: (value?: T) => U | Thenable<U>, onRejected?: (error?: any) => void): Thenable<U>;
}

interface Promise<T> extends Thenable<T> { }

declare type ReferrerPolicy = '' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin-only' |
	'origin-when-cross-origin' | 'unsafe-url';
declare type RequestMode = 'navigate' | 'same-origin' | 'no-cors' | 'cors';
declare type RequestCredentials = 'omit' | 'same-origin' | 'include';
declare type RequestCache = 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache';
declare type RequestRedirect = 'follow' | 'error' | 'manual';
declare type RequestType = '' | 'audio' | 'font' | 'image' | 'script' | 'style' | 'track' | 'video';
declare type RequestDestination = '' | 'document' | 'embed' | 'font' | 'image' | 'manifest' | 'media' | 'object' |
	'report' | 'script' | 'serviceworker' | 'sharedworker' | 'style' |  'worker' | 'xslt';
declare type ResponseType = 'basic' | 'cors' | 'default' | 'error' | 'opaque' | 'opaqueredirect';
declare type BodyInit = Blob | BufferSource | FormData | UrlSearchParams | string;
declare type RequestInfo = string | Request;
type BufferSource = Uint8Array;
type HeadersInit = { [ key: string ]: string };

declare class Headers {
	constructor(init?: HeadersInit);

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

interface RequestInit {
	method?: string;
	headers?: Headers;
	body?: BodyInit;
	referrer?: string;
	referrerPolicy?: ReferrerPolicy;
	mode?: RequestMode;
	credentials?: RequestCredentials;
	cache?: RequestCache;
	redirect?: RequestRedirect;
	integrity?: string;
}

declare class Body {
	bodyUsed: boolean;
	arrayBuffer(): Promise<ArrayBuffer>;
	blob(): Promise<Blob>;
	formData(): Promise<FormData>;
	json(): Promise<Object>;
	text(): Promise<string>;
}

declare class Request extends Body {
	constructor(request: RequestInfo, init?: RequestInit);
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

declare class Response extends Body {
	constructor(body: BodyInit, init?: ResponseInit);

	static error(): Response;
	static redirect(url: string, status?: number): Response;

	type: ResponseType;
	url: string;
	redirected: boolean;
	status: number;
	ok: boolean;
	statusText: string;
	headers: Headers;
	body: ReadableStream;

	clone(): Response;
}

interface ResponseInit {
	status: number;
	statusText: string;
	headers: HeadersInit;
}

declare var fetch: (request: RequestInfo, init?: RequestInit) => Promise<Response>;
