import { getDataFromComponent } from "./getDataFromComponent";

const getNumberOfComponents = (componentSets: readonly ComponentSetNode[]) => {
	let counter = 0;

	componentSets.forEach((componentSet) => {
		counter += componentSet.children.length;
	});

	return counter;

	// return componentSets.reduce((acc, componentSet) => {
	// 	return acc + componentSet.children.length;
	// }, 0);
};

export const getComponentSets = () => {
	return figma.currentPage.selection.reduce<Array<ComponentSetNode>>(
		(acc, layer) => {
			if (layer.type === "COMPONENT_SET") acc.push(layer);

			if (layer.type === "FRAME") {
				const frameComponentSets = layer.findAll(
					(node) => node.type === "COMPONENT_SET"
				) as [ComponentSetNode];

				acc.push(...frameComponentSets);
			}

			return acc;
		},
		[]
	);
};

export const getComponentSetData = () => {
	const selection = figma.currentPage.selection;
	const componentSets = getComponentSets();

	if (selection.length == 0) {
		return null;
	} else if (componentSets.length > 0) {
		let firstComponentSet = componentSets[componentSets.length - 1];

		return {
			componentSetsLength: componentSets.length,
			numberOfComponents: getNumberOfComponents(componentSets),
			firstComponentSet: {
				metaData: getDataFromComponent(firstComponentSet.children[0])
			}
		};
	} else {
		// need to update UI to communicate that the layers that were selected don't contain any variants
		return null;
	}
};
