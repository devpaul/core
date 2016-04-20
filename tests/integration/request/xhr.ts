import * as registerSuite from 'intern!object';
import xhr from 'src/request/xhr';
import createCommonTests from './common';

registerSuite({
	name: 'integration/request/xhr',

	common: createCommonTests(xhr)
});
