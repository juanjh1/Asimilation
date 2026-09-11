import { RawRouteParams } from '../types/router.type.js';

export interface GetRouteI {
	getRoute(): Generator<RawRouteParams| RawRouteParams>;
}
