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

	if (msg.type === "test") {
		const structure = msg.structure;
		const frame = figma.createFrame();

		frame.x = 50;
		frame.y = 50;

		frame.name = "Icons Pack";
		//frame.resize(1280, 720);

		frame.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }];
		frame.layoutMode = "HORIZONTAL";

		for (const variant in structure) {
			const variantFrame = figma.createFrame();
			variantFrame.name = variant;

			variantFrame.layoutMode = "VERTICAL";

			frame.appendChild(variantFrame);

			for (const category in structure[variant]) {
				const categoryFrame = figma.createFrame();
				categoryFrame.name = category;

				categoryFrame.layoutMode = "VERTICAL";

				variantFrame.appendChild(categoryFrame);

				for (const name in structure[variant][category]) {
					const svgString = structure[variant][category][name];

					const svgNode = figma.createNodeFromSvg(svgString);
					svgNode.name = name;

					categoryFrame.appendChild(svgNode);
				}
			}
		}
	}

	if (msg.type === "close") {
		figma.closePlugin();
	}
};
