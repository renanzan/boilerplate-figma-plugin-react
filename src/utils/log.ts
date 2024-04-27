export const printLog = (...args: any[]) => {
	console.log(
		"%cPLUGIN LOG",
		"color: green; background: yellow; font-size: 16px; margin-right:8px; padding: 0px 8px;",
		...args
	);
};

export const printError = (...args: any[]) => {
	console.log(
		"%cPLUGIN ERROR",
		"color: red; background: black; font-size: 16px; margin-right:8px; padding: 0px 8px;",
		...args
	);
};
