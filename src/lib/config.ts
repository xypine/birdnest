import { browser } from "$app/environment";
import { get, writable, type Writable } from "svelte/store";
let localStorageKey = "config";

export type Config = {
	interval: number;
	enable_animations: boolean;
};

export let default_config: Config = {
	interval: 2000,
	enable_animations: true
};

export let config: Writable<Config> = writable(default_config);
export default config;

if (browser) {
	// Reload saved settings from localstorage
	let backup = localStorage.getItem(localStorageKey);
	if (backup != null) {
		config.set(JSON.parse(backup));
	}
	// Save config to localstorage automatically on changes
	config.subscribe(($config) => {
		localStorage.setItem(localStorageKey, JSON.stringify($config));
	});
}
