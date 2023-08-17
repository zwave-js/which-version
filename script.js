async function fetchDriverLatestVersion() {
	const response = await fetch("https://api.github.com/repos/zwave-js/node-zwave-js/releases");
	const responseJson = await response.json();
	return responseJson.filter(r => !r.prerelease)[0].tag_name;
}


async function fetchHAZUIAddonLatestVersion() {
	const response = await fetch("https://api.github.com/repos/hassio-addons/addon-zwave-js-ui/releases");
	const responseJson = await response.json();
	return responseJson.filter(r => !r.prerelease)[0].tag_name;
}

async function fetchZUILatestVersion() {
	const response = await fetch("https://api.github.com/repos/zwave-js/zwave-js-ui/releases");
	const responseJson = await response.json();
	return responseJson.filter(r => !r.prerelease)[0].tag_name;
}

async function fetchHAZUIAddonZUIVersion(version) {
	const Dockerfile = await fetch(`https://raw.githubusercontent.com/hassio-addons/addon-zwave-js-ui/${version}/zwave-js-ui/Dockerfile`);
	const DockerfileText = await Dockerfile.text();
	// ARG ZWAVE_JS_UI_VERSION="v8.18.0"
	const regex = /ARG ZWAVE_JS_UI_VERSION="(.*)"/gm;
	const match = regex.exec(DockerfileText);
	return match?.[1];
}

async function fetchHACoreAddonVersion() {
	const response = await fetch(`https://raw.githubusercontent.com/home-assistant/addons/master/zwave_js/config.yaml`);
	const responseText = await response.text();
	// version: 0.1.83
	const regex = /^version: (.*)$/gm;
	const match = regex.exec(responseText);
	return match?.[1];
}

async function fetchHACoreAddonDriverVersion() {
	const response = await fetch(`https://raw.githubusercontent.com/home-assistant/addons/master/zwave_js/build.yaml`);
	const responseText = await response.text();
	//  ZWAVEJS_VERSION: 10.22.3
	const regex = /ZWAVEJS_VERSION: (.*)/gm;
	const match = regex.exec(responseText);
	return match?.[1];
}

async function fetchZUIDriverVersion(version) {
	const response = await fetch(`https://raw.githubusercontent.com/zwave-js/zwave-js-ui/${version}/package.json`);
	const responseJson = await response.json();
	return responseJson.dependencies["zwave-js"].replace(/^[^~]/, "v");
}

async function fetchDriver() {
	const driverVersion = await fetchDriverLatestVersion();

	document.getElementById("driver__version").innerText = driverVersion;
}

async function fetchHAZUIAddon() {
	const haAddonVersion = await fetchHAZUIAddonLatestVersion();
	const haAddonZUIVersion = await fetchHAZUIAddonZUIVersion(haAddonVersion);
	const zwavejsVersion = await fetchZUIDriverVersion(haAddonZUIVersion);

	document.getElementById("ha-addon__version").innerText = haAddonVersion;
	document.getElementById("ha-addon__zui-version").innerText = haAddonZUIVersion;
	document.getElementById("ha-addon__driver-version").innerText = zwavejsVersion;
}

async function fetchZUI() {
	const zuiVersion = await fetchZUILatestVersion();
	const zwavejsVersion = await fetchZUIDriverVersion(zuiVersion);

	document.getElementById("zui__version").innerText = zuiVersion;
	document.getElementById("zui__driver-version").innerText = zwavejsVersion;
}

async function fetchHACoreAddon() {
	const addonVersion = await fetchHACoreAddonVersion();
	const zwavejsVersion = await fetchHACoreAddonDriverVersion();

	document.getElementById("ha-core__version").innerText = addonVersion;
	document.getElementById("ha-core__driver-version").innerText = zwavejsVersion;
}

document.addEventListener("DOMContentLoaded", () => {
	fetchDriver().catch(console.error);
	fetchHAZUIAddon().catch(console.error);
	fetchZUI().catch(console.error);
	fetchHACoreAddon().catch(console.error);
});