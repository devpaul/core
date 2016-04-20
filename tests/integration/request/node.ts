import * as registerSuite from 'intern!object';
import request from 'src/request/node';
import createCommonTests from './common';

registerSuite({
	name: 'integration/request/node',

	common: createCommonTests(request)
});
