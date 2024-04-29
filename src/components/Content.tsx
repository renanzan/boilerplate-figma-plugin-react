import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/App.context";
import { printLog } from "@/utils/log";

import type { ChangeEvent } from "react";

type PropertySetting = "folders" | "filenames";

const Content = () => {
	const { preference, setPreference, componentSetsLength, numberOfComponents } =
		useAppContext();
	const filenameOption = useRef<HTMLInputElement>(null);

	const handlePropertySettingChange = (e: ChangeEvent<HTMLInputElement>) => {
		const preference = e.target.value as PropertySetting;

		setPreference(preference);

		parent.postMessage(
			{
				pluginMessage: { type: "set-preference", preference }
			},
			"*"
		);
	};

	return (
		<section className="my-2">
			<div className="flex flex-col gap-2 items-center">
				<p>
					{!componentSetsLength
						? "No symbol sets with variants selected."
						: `Number of Component Sets: ${componentSetsLength}`}
				</p>

				<p>
					{!numberOfComponents
						? "No variants found in selected component sets."
						: `Number of Variants: ${numberOfComponents}`}
				</p>
			</div>

			<div className="flex gap-4 mt-2">
				<label htmlFor="folders" className="flex gap-1">
					<input
						type="radio"
						name="propertySetting"
						value="folders"
						checked={preference === "folders"}
						onChange={handlePropertySettingChange}
					/>
					Folders
				</label>

				<label htmlFor="filenames" className="flex gap-1">
					<input
						ref={filenameOption}
						type="radio"
						name="propertySetting"
						value="filenames"
						checked={preference === "filenames"}
						onChange={handlePropertySettingChange}
					/>
					Files names
				</label>

				<p id="exampleText"></p>
			</div>
		</section>
	);
};

export default Content;
