import { useAppContext } from "@/App.context";

export const Footer = () => {
	const { preference, numberOfComponents } = useAppContext();

	const onCancel = () => {
		parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
	};

	return (
		<footer className="flex w-full gap-4 mt-5">
			<button className="flex-1" onClick={onCancel}>
				Close
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
	);
};
