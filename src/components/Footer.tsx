import { useRef, useState } from "react";
import { useAppContext } from "@/App.context";
import { printLog } from "@/utils/log";

export const Footer = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { preference, numberOfComponents } = useAppContext();
	const [previewSvgs, setPreviewSvgs] = useState<string[]>([]);

	const handleImport = () => {
		inputRef.current?.click();
	};

	return (
		<>
			<input
				ref={inputRef}
				type="file"
				webkitdirectory="true"
				multiple
				className="hidden"
				onChange={(...all) => {
					const files = all[0].target.files;

					for (const file of files) {
						const reader = new FileReader();

						reader.onload = (e) => {
							const svgString = e.target?.result;

							if (svgString) {
								setPreviewSvgs((prev) => [...prev, svgString as string]);
							}
						};

						reader.readAsText(file);
					}
				}}
			/>

			<div>
				{previewSvgs.map((svgString, index) => (
					<div
						key={index}
						className="mt-4"
						dangerouslySetInnerHTML={{ __html: svgString }}
					/>
				))}
			</div>

			<footer className="flex w-full gap-4 mt-5">
				<button className="flex-1" onClick={handleImport}>
					Import
				</button>

				<button
					className="flex-1"
					onClick={() => {
						parent.postMessage(
							{ pluginMessage: { type: "export", selection: preference } },
							"*"
						);
					}}
				>
					Export{!!numberOfComponents && ` (${numberOfComponents})`}
				</button>
			</footer>
		</>
	);
};
