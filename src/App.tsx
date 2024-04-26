import { createRoot } from "react-dom/client";

import "./styles.css";

import { AppProvider } from "./App.context";
import Content from "./components/Content";
import { Footer } from "./components/Footer";
import Header from "./components/Header";

const App = () => (
	<AppProvider>
		<main>
			<Header />
			<Content />
			<Footer />
		</main>
	</AppProvider>
);

createRoot(document.getElementById("react-page")).render(<App />);
