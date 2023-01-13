import { API_ENDPOINT } from ".";

export type ApiInfo = {
	version: string;
};

export async function getApiInformation(nfetch: any | null): Promise<ApiInfo> {
	let fetch_to_use = nfetch ?? fetch;
	try {
		let resp = await fetch_to_use(`${API_ENDPOINT}/meta`);
		if (resp.ok) {
			let data: ApiInfo = await resp.json();
			return data;
		}
	} catch (e) {
		console.warn("Error fetching api details:", e);
	}
	return {
		version: "unknown"
	};
}
