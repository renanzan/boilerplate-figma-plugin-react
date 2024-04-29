import { onMessage } from "./controller/controller";
import {
	getComponentSetData,
	getComponentSets
} from "./utils/getComponentSetData";
import { getDataFromComponent } from "./utils/getDataFromComponent";

figma.showUI(__html__, { height: 500, width: 800 });

figma.on("selectionchange", () => {
	let promises = [];
	let variantDataArray = [];
	const componentSets = getComponentSets();
	const data = getComponentSetData();

	if (componentSets.length) {
		componentSets.forEach((componentSet) => {
			componentSet.children.forEach((variant) => {
				let variantIsVisible = variant.visible;

				if (!variantIsVisible) variant.visible = true;

				let svgPromise = variant.exportAsync({ format: "SVG" }).finally(() => {
					if (!variantIsVisible) variant.visible = false;
				});

				let variantData = getDataFromComponent(variant);

				variantDataArray.push(variantData);
				promises.push(svgPromise);
			});
		});

		Promise.all(promises).then((svgDataArray) => {
			figma.ui.postMessage({
				type: "selectionChange",
				data: Object.assign(data, {
					svgDataArray
				})
			});
		});
	} else {
		figma.ui.postMessage({
			type: "selectionChange",
			data: Object.assign(data, {
				svgDataArray: []
			})
		});
	}
});

figma.clientStorage.getAsync("preference").then((preference) => {
	figma.ui.postMessage({
		type: "setup",
		data: Object.assign({ preference }, getComponentSetData())
	});
});
figma.ui.onmessage = onMessage;
