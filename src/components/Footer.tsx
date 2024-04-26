import { useAppContext } from "@/App.context";

export const Footer = () => {
	const { hello } = useAppContext();

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
					console.log("testando", { hello });
					parent.postMessage({ pluginMessage: { type: "hello" } }, "*");
					alert("Hello Figma!");
				}}
			>
				Say Hello
			</button>
		</footer>
	);
};
