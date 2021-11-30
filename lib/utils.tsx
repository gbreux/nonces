import qs from "qs";
import Router from "next/router";

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

export function getPasswordStrength(str: string) {
	const strong =
		/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{12,})/;
	const medium =
		/((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))/;

	if (strong.test(str)) {
		return "strong";
	} else if (medium.test(str)) {
		return "medium";
	} else {
		return "weak";
	}
}
