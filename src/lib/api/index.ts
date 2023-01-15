export let API_ENDPOINT = "https://birdnest-api.eliaseskelinen.fi";

export type OptionalFetchFunction =
	| ((input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>)
	| null;
