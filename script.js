function stripV(version) {
	return version?.replace(/^v/, "");
}

async function fetchDriverLatestVersion() {
	const response = await fetch("https://api.github.com/repos/zwave-js/node-zwave-js/releases");
	const responseJson = await response.json();
	return responseJson.filter(r => !r.prerelease)[0].tag_name;
}


async function fetchHAZUIAppLatestVersion() {
	const response = await fetch("https://api.github.com/repos/hassio-addons/app-zwave-js-ui/releases");
	const responseJson = await response.json();
	return responseJson.filter(r => !r.prerelease)[0].tag_name;
}

async function fetchZUILatestVersion() {
	const response = await fetch("https://api.github.com/repos/zwave-js/zwave-js-ui/releases");
	const responseJson = await response.json();
	return responseJson.filter(r => !r.prerelease)[0].tag_name;
}

async function fetchHAZUIAppZUIVersion(version) {
	const Dockerfile = await fetch(`https://raw.githubusercontent.com/hassio-addons/app-zwave-js-ui/${version}/zwave-js-ui/Dockerfile`);
	const DockerfileText = await Dockerfile.text();
	// ARG ZWAVE_JS_UI_VERSION="11.11.0"
	const regex = /ARG ZWAVE_JS_UI_VERSION="(.*)"/gm;
	const match = regex.exec(DockerfileText);
	const zuiVersion = match?.[1];
	return zuiVersion && !zuiVersion.startsWith("v") ? `v${zuiVersion}` : zuiVersion;
}

async function fetchHACoreAppVersion() {
	const response = await fetch(`https://raw.githubusercontent.com/home-assistant/addons/master/zwave_js/config.yaml`);
	const responseText = await response.text();
	// version: 0.1.83
	const regex = /^version: (.*)$/gm;
	const match = regex.exec(responseText);
	return match?.[1];
}

async function fetchHACoreAppZUIVersion() {
	const response = await fetch(`https://raw.githubusercontent.com/home-assistant/addons/master/zwave_js/build.yaml`);
	const responseText = await response.text();
	//  ZWAVEJS_UI_VERSION: 11.11.0
	const regex = /ZWAVEJS_UI_VERSION: (.*)/gm;
	const match = regex.exec(responseText);
	const zuiVersion = match?.[1];
	return zuiVersion && !zuiVersion.startsWith("v") ? `v${zuiVersion}` : zuiVersion;
}

async function fetchZUIDriverVersion(version) {
	const response = await fetch(`https://raw.githubusercontent.com/zwave-js/zwave-js-ui/${version}/package.json`);
	const responseJson = await response.json();
	return "v" + responseJson.dependencies["zwave-js"].replace(/^[^0-9]*/, "");
}

async function fetchDriver() {
	const driverVersion = await fetchDriverLatestVersion();

	document.getElementById("driver__version").innerText = stripV(driverVersion);
}

async function fetchHAZUIApp() {
	const haAppVersion = await fetchHAZUIAppLatestVersion();
	const haAppZUIVersion = await fetchHAZUIAppZUIVersion(haAppVersion);
	const zwavejsVersion = await fetchZUIDriverVersion(haAppZUIVersion);

	document.getElementById("ha-app__version").innerText = stripV(haAppVersion);
	document.getElementById("ha-app__zui-version").innerText = stripV(haAppZUIVersion);
	document.getElementById("ha-app__driver-version").innerText = stripV(zwavejsVersion);
}

async function fetchZUI() {
	const zuiVersion = await fetchZUILatestVersion();
	const zwavejsVersion = await fetchZUIDriverVersion(zuiVersion);

	document.getElementById("zui__version").innerText = stripV(zuiVersion);
	document.getElementById("zui__driver-version").innerText = stripV(zwavejsVersion);
}

async function fetchHACoreApp() {
	const appVersion = await fetchHACoreAppVersion();
	const zuiVersion = await fetchHACoreAppZUIVersion();
	const zwavejsVersion = await fetchZUIDriverVersion(zuiVersion);

	document.getElementById("ha-core__version").innerText = stripV(appVersion);
	document.getElementById("ha-core__zui-version").innerText = stripV(zuiVersion);
	document.getElementById("ha-core__driver-version").innerText = stripV(zwavejsVersion);
}

document.addEventListener("DOMContentLoaded", () => {
	fetchDriver().catch(console.error);
	fetchHAZUIApp().catch(console.error);
	fetchZUI().catch(console.error);
	fetchHACoreApp().catch(console.error);
});