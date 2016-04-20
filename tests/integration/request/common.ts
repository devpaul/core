import * as assert from 'intern/chai!assert';
import Transform, { recursiveMap, TransformMap } from '../support/transform';
import { RequestProvider } from 'src/request';
import { isEchoServerAvailable, wrapServerRequired } from '../support/echoServer';

export default function createCommonTests(request: RequestProvider) {
	const tests = {
		before() {
			return isEchoServerAvailable();
		},

		'HTTP methods': {
			'default'() {
				return request('/__echo/foo.json')
					.then(function (response: any) {
						assert.strictEqual(response.requestOptions.method, 'GET');
					});
			},

			GET: {
				'plain GET'() {
					this.skip('implement this');
				},

				'get with URL query'() {
					this.skip('implement this');
				}
			},

			POST() {
				this.skip('implement this');
			}
		},

		timeout() {
			this.skip('implement this');
		},

		authentication: {
			'username and password'() {
				this.skip('implement this');
			},

			'auth, without user or password'() {
				this.skip('implement this');
			},

			'auth overrides user or password'() {
				this.skip('implement this');
			},

			'Authentication header overrides all other auth methods'() {
				this.skip('implement this');
			}
		},

		query: {
			'GET with query URL'() {
				this.skip('implement this');
			},

			'GET with query options'() {
				this.skip('implement this');
			},

			'GET with cachebust'() {
				this.skip('implement this');
			},

			'GET with query URL and query options'() {
				this.skip('implement this');
			},

			'GET with cachebust and query string'() {
				this.skip('implement this');
			},

			'GET with cachebust and query options'() {
				this.skip('implement this');
			},

			'GET with cachebust and query string and query options'() {
				this.skip('implement this');
			}
		},

		headers: {}
	};

	const map: TransformMap = recursiveMap((obj: {}, property: string, value: any, target: {}) => {
		if (typeof value === 'function' && property !== 'before') {
			return wrapServerRequired(value);
		}

		return value;
	});

	return new Transform(map).transform(tests);
}
