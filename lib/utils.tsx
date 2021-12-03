import CryptoJS from "crypto-js";
import qs from "qs";
import Router from "next/router";

import english from "public/static/json/english.json";

function chr4() {
	return Math.random().toString(16).slice(-4);
}
export function getRandomId() {
	return (
		chr4() +
		chr4() +
		"-" +
		chr4() +
		"-" +
		chr4() +
		"-" +
		chr4() +
		"-" +
		chr4() +
		chr4() +
		chr4()
	);
}

export function routeWithParams(route: string, params: anyObj) {
	const copyParams = { ...params };
	const href = route.replace(/\[\w+\]/g, (p) => {
		const prop = p.replace(/\[|\]/g, "");
		if (copyParams[prop]) {
			delete copyParams[prop];
		}
		return params[prop] || p;
	});
	return href + qs.stringify(copyParams, { addQueryPrefix: true });
}

export function goToRoute(to, lang, params = {}) {
	const href = routeWithParams(to, { lang, ...params });
	Router.push(href);
}

export function stringToColour(stringInput: string) {
	let stringUniqueHash = [...stringInput].reduce((acc, char) => {
		return char.charCodeAt(0) + ((acc << 5) - acc);
	}, 0);
	return `hsl(${stringUniqueHash % 360}, 95%, 35%)`;
}

export function getPasswordStrength(str: string, forWords = false) {
	const strong =
		/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{12,})/;
	const medium =
		/((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))/;
	const strongWord = /(([a-z]{3,}[\s\S]{1,}){6,})/;
	const mediumWord = /(([a-z]{3,}[\s\S]{1,}){3,})/;

	if (forWords) {
		if (strongWord.test(str)) {
			return "strong";
		} else if (mediumWord.test(str)) {
			return "medium";
		} else {
			return "weak";
		}
	} else {
		if (strong.test(str)) {
			return "strong";
		} else if (medium.test(str)) {
			return "medium";
		} else {
			return "weak";
		}
	}
}

export function getMnemonic(size = 12, sep = "-") {
	var array = new Uint32Array(size);
	window.crypto.getRandomValues(array);
	const arr: string[] = [];
	array.forEach((num) => {
		arr.push(english[num % english.length]);
	});
	return arr.join(sep);
}

function encryptWithAES(passphrase: string, text: string) {
	return CryptoJS.AES.encrypt(text, passphrase).toString();
}

function decryptWithAES(passphrase: string, ciphertext: string) {
	const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
	const originalText = bytes.toString(CryptoJS.enc.Utf8);
	return originalText;
}

export const encryption = (pass) => ({
	encrypt: (values) => encryptWithAES(pass, JSON.stringify(values)),
	decrypt: (data) => data && JSON.parse(decryptWithAES(pass, data)),
});
