/** @see https://github.com/destefanis/design-lint/blob/master/src/plugin/controller.ts */

import { printLog } from "@/utils/log";

import { getComponentSets } from "../utils/getComponentSetData";
import { getDataFromComponent } from "../utils/getDataFromComponent";

export const onMessage: MessageEventHandler = async (msg, props) => {
	printLog("Message received from UI", msg);

	if (msg.type === "set-preference") {
		figma.clientStorage.setAsync("preference", msg.preference);
	}

	if (msg.type === "export") {
		let promises = [];
		let variantDataArray = [];

		const componentSets = getComponentSets();

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

		printLog("Exporting components", msg.selection, {
			promises,
			variantDataArray
		});

		Promise.all(promises).then((svgDataArray) => {
			figma.ui.postMessage({
				type: "download",
				data: {
					svgDataArray: svgDataArray,
					variantDataArray: variantDataArray
				}
			});
		});
	}

	if (msg.type === "close") {
		figma.closePlugin();
	}
};
