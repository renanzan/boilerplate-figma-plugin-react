import { onMessage } from "./controller/controller";
import { getComponentSetData } from "./utils/getComponentSetData";

figma.showUI(__html__, { height: 300, width: 400 });

figma.on("selectionchange", () => {
	figma.ui.postMessage({
		type: "selectionChange",
		data: getComponentSetData()
	});
});

figma.clientStorage.getAsync("preference").then((preference) => {
	figma.ui.postMessage({
		type: "setup",
		data: Object.assign({ preference }, getComponentSetData())
	});
});
figma.ui.onmessage = onMessage;
