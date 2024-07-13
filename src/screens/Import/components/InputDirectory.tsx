import { forwardRef, useRef } from "react";
import { printLog } from "@/utils/log";

import type { ChangeEventHandler, InputHTMLAttributes } from "react";

type HTMLInputProps = {
	onChange: (files: File[]) => void;
} & Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"type" | "webkitdirectory" | "className" | "onChange"
>;

const HTMLInputSVG = forwardRef<HTMLInputElement, HTMLInputProps>(
	(props, ref) => {
		const { onChange, ...restProps } = props;

		const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
			const svgFiles = Array.from(event.target.files).filter((file) =>
				file.name.endsWith(".svg")
			);

			onChange?.(svgFiles);
		};

		return (
			<input
				ref={ref}
				type="file"
				webkitdirectory="true"
				className="hidden"
				onChange={handleOnChange}
				{...restProps}
			/>
		);
	}
);

const InputDirectory = () => {
	const inputRef = useRef<HTMLInputElement>(null);

	const readAllFiles = async (files: File[]) => {
		const promises = files.map((file) => {
			const reader = new FileReader();

			reader.readAsText(file);

			return new Promise((resolve) => {
				reader.onload = (e) => {
					const svgString = e.target?.result;

					if (svgString) {
						resolve(svgString);
					}
				};
			});
		});

		return (await Promise.all(promises)) as string[];
	};

	const handleImport: HTMLInputProps["onChange"] = async (files) => {
		const structure = {};
		const svgFiles = await readAllFiles(files);

		for (const fileIdx in files) {
			const file = files[fileIdx];

			const variant = file.webkitRelativePath.split("/")[1];
			const category = file.webkitRelativePath.split("/")[2];
			const name = file.webkitRelativePath.split("/")[3];

			if (!structure[variant]) {
				structure[variant] = {};
			}

			if (!structure[variant][category]) {
				structure[variant][category] = {};
			}

			structure[variant][category][name] = svgFiles[fileIdx];
		}

		parent.postMessage(
			{
				pluginMessage: {
					type: "test",
					structure
				}
			},
			"*"
		);

		printLog({ structure });
	};

	return (
		<>
			<HTMLInputSVG ref={inputRef} onChange={handleImport} />

			<button onClick={() => inputRef.current?.click()}>Import</button>
		</>
	);
};

export default InputDirectory;
