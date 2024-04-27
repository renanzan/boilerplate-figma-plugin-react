import { createContext, useContext, useMemo, useState } from "react";
import JSZip from "jszip";

import type { Dispatch, FC, PropsWithChildren, SetStateAction } from "react";

type PreferenceStructure = "folders" | "filenames";

type AppContextType = {
	loading: boolean;
	preference: PreferenceStructure;
	setPreference?: Dispatch<SetStateAction<PreferenceStructure>>;
	componentSetsLength: number;
	numberOfComponents: number;
};

const AppContext = createContext<AppContextType>({} as AppContextType);

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const [preference, setPreference] = useState<PreferenceStructure>("folders");
	const [componentSetsLength, setComponentSetsLength] = useState(0);
	const [numberOfComponents, setNumberOfComponents] = useState(0);

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
				numberOfComponents
			}) satisfies AppContextType,
		[loading, preference, componentSetsLength, numberOfComponents]
	);

	onmessage = (event) => {
		const { type, data } = event.data.pluginMessage;

		if (type === "setup") {
			setPreference(data.preference);
			setLoading(false);
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
			let svgDataArray = data.svgDataArray;
			let variantDataArray = data.variantDataArray; // {componentName: string, variantSubstring: string}

			// build zip file
			var zip = new JSZip();
			if (preference === "filenames") {
				let folder = zip.folder("Export");
				data.svgDataArray.forEach((svgData, index) => {
					let fileName = `${variantDataArray[index].componentName}-${variantDataArray[index].variantSubstring}.svg`;
					folder.file(fileName, svgData, { base64: true });
				});

				// perform download
				zip.generateAsync({ type: "blob" }).then((blob) => {
					save(blob, "Export.zip");
				});
			} else {
				// folders
				data.svgDataArray.forEach((svgData, index) => {
					let folderName = `${variantDataArray[index].variantSubstring}`;
					let folder = zip.folder(folderName);
					let fileName = `${variantDataArray[index].componentName}.svg`;
					folder.file(fileName, svgData, { base64: true });
				});

				// perform download
				zip.generateAsync({ type: "blob" }).then((blob) => {
					save(blob, "Export.zip");
				});
			}
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
