import * as request from 'intern/dojo/request';
import * as Promise from 'intern/dojo/Promise';

let serverAvailable: boolean = undefined;

interface Test {
	(... args: any[]): any;
}

export function wrapServerRequired(test: Test): any {
	return function (... args: any[]) {
		if (serverAvailable === undefined) {
			throw new Error('server was not checked. Call isEchoServerAvailable().');
		}
		if (serverAvailable) {
			return test.apply(this, args);
		}

		this.skip('server not available');
	};
}

export const serverRequired: MethodDecorator = function (target: Object, propertyKey: string,
	descriptor: TypedPropertyDescriptor<Test>): TypedPropertyDescriptor<Test> {
	return {
		value: wrapServerRequired(descriptor.value)
	};
};

export function isEchoServerAvailable(): Promise<boolean> {
	return request('/__echo/', {
		method: 'get',
		timeout: 10000
	}).then(function (response: any) {
		console.log('response', response);
		if (response && response.statusCode === 200) {
			serverAvailable = true;
		}
		return serverAvailable;
	}, function (e: any) {
		console.log('error', e);
		serverAvailable = false;
		return serverAvailable;
	});
}
