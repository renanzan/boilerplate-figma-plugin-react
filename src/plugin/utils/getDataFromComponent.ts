const bools = ["yes", "true", "no", "false"];
const falses = ["no", "false"];

export const getDataFromComponent = (component: SceneNode) => {
	const parentName = component.parent.name.toLowerCase();
	const parts = component.name.split(", ");
	const properties = [];
	const variants = [];

	let variantSubstring = "";

	parts.forEach((partText) => {
		let splitText = partText.split("=");
		variants.push(splitText[1]);
		properties.push(splitText[0]);
	});

	variants.forEach((variant, index) => {
		if (bools.indexOf(variant.toLowerCase()) === -1) {
			variantSubstring += `-${variant.toLowerCase()}`;
		} else if (falses.indexOf(variant.toLowerCase()) === -1) {
			variantSubstring += `-${properties[index].toLowerCase()}`;
		}
	});

	variantSubstring = variantSubstring.substring(1);

	return { componentName: parentName, variantSubstring: variantSubstring };
};
