import { Hash } from 'src/interfaces';

export interface TransformMap {
	(obj: {}, property: string, value: any, target: {}): any;
}

export interface TransformFilter {
	(obj: {}, property: string, value: any): boolean;
}

const noopMap: TransformMap = function (obj, property, value) {
	return value;
};

const noopFilter: TransformFilter = function () {
	return true;
};

function shouldRecurse(value: any): boolean {
	return Object.prototype.toString.call(value) === '[object Object]';
}

export function recursiveMap(sourceMap: TransformMap): TransformMap {
	const map: TransformMap = function (obj: Hash<any>, property: string, value: any, target: Hash<any>) {
		if (shouldRecurse(value)) {
			return this.transform(value as Hash<any>);
		}

		return sourceMap.call(this, obj, property, value, target);
	};

	return map;
}

export default class Transform {
	private map: TransformMap;
	private filter: TransformFilter;

	constructor(map: TransformMap = noopMap, filter: TransformFilter = noopFilter) {
		this.map = map;
		this.filter = filter;
	}

	transform(source: Hash<any>, target: Hash<any> = {}): {} {
		for (let name in source) {
			if (this.filter(source, name, source[name])) {
				target[name] = this.map(source, name, source[name], target);
			}
		}

		return target;
	}
}
