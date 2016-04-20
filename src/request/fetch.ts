/// <reference path="../interfaces/fetch.d.ts" />
import { RequestOptions as BaseRequestOptions, ResponsePromise, RequestProvider, Response as RequestResponse } from '../request';
import { generateRequestUrl } from './util';
import { Hash } from '../interfaces';
import Task from '../async/Task';

export interface RequestOptions extends BaseRequestOptions {
	data?: BodyInit | any;
	fetch?: {
		mode?: RequestMode;
		headers: Headers;
		credentials?: RequestCredentials;
		cache?: RequestCache;
		redirect?: RequestRedirect;
		referrer?: string;
		referrerPolicy?: ReferrerPolicy;
		integrity?: string;
	};
}

export interface FetchProvider extends RequestProvider {
	<T>(url: Request, options: RequestOptions): ResponsePromise<T>;
	<T>(url: string, options: RequestOptions): ResponsePromise<T>;
}

function createHeaders(options: RequestOptions): Headers {
	const headers = options.headers ? new Headers(options.headers) : new Headers();

	if (options.fetch && options.fetch.headers) {
		// TODO cast headers to any to leave me alone in an ES5 context
		for (let [name, value] of options.fetch.headers as any) {
			headers.set(name, value);
		}
	}

	if (!headers.has('Authorization')) {
		if (options.auth) {
			headers.set('Authorization', `Basic ${options.auth}`);
		}
		else if (options.password && options.user) {
			const username = encodeURIComponent(options.user || '');
			const password = encodeURIComponent(options.password || '');
			headers.set('Authorization', `Basic ${ username }:${ password }`);
		}
	}

	return headers;
}

function copyPresent(source: Hash<any>, target: Hash<any>, keys: Array<string>) {
	keys.forEach(key => {
		if (source.hasOwnProperty(key)) {
			target[key] = source[key];
		}
	});
}

function createRequest(request: RequestInfo, options: RequestOptions): RequestInfo {
	if (typeof request === 'string') {
		return generateRequestUrl(request, options);
	}
	else if (request instanceof Request) {
		const url = generateRequestUrl(request.url, options);
		return new Request(url, request);
	}

	return request;
}

function createFetchOptions(options: RequestOptions): RequestInit {
	const request: RequestInit = {
		headers: createHeaders(options)
	};

	if (options.data) {
		request.body = options.data as BodyInit;
	}

	copyPresent(options, request, [
		'method',
		'mode',
		'cache',
		'redirect',
		'referrerPolicy',
		'integrity'
	]);

	return request;
}

const provider: FetchProvider = function <T>(request: RequestInfo, options: RequestOptions = {}): ResponsePromise<T> {
	let canceled = false;
	const canceler = function () {
		canceled = true;
	};
	const task = new Task<RequestResponse<T>>(function (resolve) {
		fetch(
			createRequest(request, options),
			createFetchOptions(options)
		).then(function (response: Response) {
			return !canceled && response.text().then(function (body: string) {
					return {
						data: (body as any),
						nativeResponse: response,
						requestOptions: options,
						statusCode: response.status,
						url: response.url,
						statusText: response.statusText,
						getHeader(name: string): string {
							return response.headers.get(name);
						}
					} as RequestResponse<T>;
				});
		}).then(resolve);
	}, canceler);

	return task;

};

export default provider;
