export interface Payload<P = string, T = string> {
	type: P;
	payload: T;
}
