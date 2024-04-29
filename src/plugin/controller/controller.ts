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
		const promises = [];
		const variantDataArray = [];
		const componentSets = getComponentSets();

		componentSets.forEach((componentSet) => {
			componentSet.children.forEach((variant) => {
				const variantIsVisible = variant.visible;

				if (!variantIsVisible) variant.visible = true;

				const svgPromise = variant
					.exportAsync({ format: "SVG" })
					.finally(() => {
						if (!variantIsVisible) variant.visible = false;
					});

				const variantData = getDataFromComponent(variant);

				variantDataArray.push(variantData);
				promises.push(svgPromise);
			});
		});

		Promise.all(promises).then((svgDataArray) => {
			figma.ui.postMessage({
				type: "download",
				data: {
					svgDataArray,
					variantDataArray
				}
			});
		});
	}

	if (msg.type === "close") {
		figma.closePlugin();
	}
};
