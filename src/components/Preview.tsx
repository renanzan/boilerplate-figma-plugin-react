import { useAppContext } from "@/App.context";
import { printLog } from "@/utils/log";

const Preview = () => {
	const { preference, svgDataArray } = useAppContext();

	if (!svgDataArray.length) return null;

	printLog({ preference, svgDataArray });

	return (
		<div className="flex flex-col gap-4">
			<div className="p-4 bg-gray-100 rounded-lg">
				<h2>Preview export path:</h2>

				<p>
					{preference === "filenames"
						? "business-and-finance/calculator-outlined.svg"
						: "outlined/business-and-finance/calculator.svg"}
				</p>
			</div>

			<div className="p-4 bg-gray-100 rounded-lg">
				<h2>Preview</h2>

				<div className="grid grid-cols-10 gap-4 max-h-[100px] overflow-auto">
					{svgDataArray.map((svgData, index) => {
						const svgString = String.fromCharCode.apply(null, svgData);

						return (
							<div
								key={index}
								className="mt-4"
								dangerouslySetInnerHTML={{ __html: svgString }}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Preview;
