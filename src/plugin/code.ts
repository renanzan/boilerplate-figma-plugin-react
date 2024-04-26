import { hello } from "./utils/hello";

figma.showUI(__html__, { height: 300, width: 400 });

figma.ui.onmessage = (msg) => {
	if (msg.type === "hello") {
		return hello();
	}

	figma.closePlugin();
};
