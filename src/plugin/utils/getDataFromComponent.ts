export const getDataFromComponent = (component: SceneNode) => {
	let parentName = component.parent.name.toLowerCase();
	let parts = component.name.split(", ");

	let properties = [];
	let variants = [];

	parts.forEach((partText) => {
		let splitText = partText.split("=");
		variants.push(splitText[1]);
		properties.push(splitText[0]);
	});

	let variantSubstring = "";
	let bools = ["yes", "true", "no", "false"];
	let falses = ["no", "false"];
	variants.forEach((variant, index) => {
		if (bools.indexOf(variant.toLowerCase()) === -1) {
			variantSubstring += `-${variant.toLowerCase()}`;
		} else {
			if (falses.indexOf(variant.toLowerCase()) === -1) {
				variantSubstring += `-${properties[index].toLowerCase()}`;
			}
		}
	});
	// ex: -variant1-variant2-variant3...
	variantSubstring = variantSubstring.substring(1); // remove first '-'
	return { componentName: parentName, variantSubstring: variantSubstring };
};
