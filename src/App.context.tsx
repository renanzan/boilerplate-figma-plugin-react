import { createContext, useContext, useMemo, useState } from "react";
import JSZip from "jszip";

import { printLog } from "./utils/log";

import type { Dispatch, FC, PropsWithChildren, SetStateAction } from "react";

type PreferenceStructure = "folders" | "filenames";

type AppContextType = {
	loading: boolean;
	preference: PreferenceStructure;
	setPreference?: Dispatch<SetStateAction<PreferenceStructure>>;
	componentSetsLength: number;
	numberOfComponents: number;
	svgDataArray: Uint8Array[];
};

const AppContext = createContext<AppContextType>({} as AppContextType);

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const [preference, setPreference] = useState<PreferenceStructure>("folders");
	const [componentSetsLength, setComponentSetsLength] = useState(0);
	const [numberOfComponents, setNumberOfComponents] = useState(0);
	const [svgDataArray, setSvgDataArray] = useState<Uint8Array[]>([]);

	const save = (blob, filename) => {
		// @ts-ignore
		if (typeof navigator.msSaveOrOpenBlob !== "undefined") {
			// @ts-ignore
			return navigator.msSaveOrOpenBlob(blob, filename);
			// @ts-ignore
		} else if (typeof navigator.msSaveBlob !== "undefined") {
			// @ts-ignore
			return navigator.msSaveBlob(blob, filename);
		} else {
			var elem: HTMLAnchorElement = window.document.createElement("a");
			elem.href = window.URL.createObjectURL(blob);
			elem.download = filename;
			elem.setAttribute("style", "display:none;opacity:0;color:transparent;");

			(document.body || document.documentElement).appendChild(elem);

			if (typeof elem.click === "function") {
				elem.click();
			} else {
				elem.target = "_blank";
				elem.dispatchEvent(
					new MouseEvent("click", {
						view: window,
						bubbles: true,
						cancelable: true
					})
				);
			}

			URL.revokeObjectURL(elem.href);
		}
	};

	const value = useMemo(
		() =>
			({
				loading,
				preference,
				setPreference,
				componentSetsLength,
				numberOfComponents,
				svgDataArray
			}) satisfies AppContextType,
		[loading, preference, componentSetsLength, numberOfComponents, svgDataArray]
	);

	onmessage = (event) => {
		const { type, data } = event.data.pluginMessage;

		if (type === "setup") {
			setPreference(data.preference);
			setLoading(false);
		}

		if (type === "selectionChange") {
			printLog("selectionChange", data);
			setSvgDataArray(data.svgDataArray);
		}

		if (type === "selectionChange" || type === "setup") {
			if (data != null) {
				setComponentSetsLength(data.componentSetsLength);
				setNumberOfComponents(data.numberOfComponents);
			} else {
				setComponentSetsLength(0);
				setNumberOfComponents(0);
			}
		}

		if (type === "download") {
			const svgDataArray = data.svgDataArray;
			const variantDataArray = data.variantDataArray;
			const zip = new JSZip();

			printLog({
				svgDataArray,
				variantDataArray,
				preference
			});

			// File names preference example: 'business-and-finance/calculator-outlined.svg'
			if (preference === "filenames") {
				const folder = zip.folder("Export");

				data.svgDataArray.forEach((svgData, index) => {
					const fileName = `${variantDataArray[index].componentName}-${variantDataArray[index].variantSubstring}.svg`;

					folder.file(fileName, svgData, { base64: true });
				});
			} else {
				// Folders preference example: 'outlined/business-and-finance/calculator.svg'
				data.svgDataArray.forEach((svgData, index) => {
					const folderName = `${variantDataArray[index].variantSubstring}`;
					const folder = zip.folder(folderName);

					const fileName = `${variantDataArray[index].componentName}.svg`;

					folder.file(fileName, svgData, { base64: true });
				});
			}

			zip.generateAsync({ type: "blob" }).then((blob) => {
				save(blob, "Export.zip");
			});
		}
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const withAppProvider = (Component) => {
	const App = (props) => (
		<AppProvider>
			<Component {...props} />
		</AppProvider>
	);

	return <App />;
};

export const useAppContext = () => useContext(AppContext);
