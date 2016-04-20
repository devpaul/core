import * as registerSuite from 'intern!object';
import fetch from 'src/request/fetch';
import createCommonTests from './common';

registerSuite({
	name: 'integration/request/fetch',

	common: createCommonTests(fetch)
});
