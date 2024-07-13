import { createRoot } from "react-dom/client";

import "./styles.css";

import { useAppContext, withAppProvider } from "./App.context";
import Content from "./components/Content";
import { Footer } from "./components/Footer";
import Header from "./components/Header";
import Preview from "./components/Preview";
import ImportScreen from "./screens/Import/Import";

const App = () => {
	const { loading } = useAppContext();

	if (loading) return <></>;

	// return (
	// 	<main>
	// 		<ImportScreen />
	// 	</main>
	// );

	return (
		<main>
			<Header />
			<Content />
			<Preview />
			<Footer />
		</main>
	);
};

createRoot(document.getElementById("react-page")).render(withAppProvider(App));
