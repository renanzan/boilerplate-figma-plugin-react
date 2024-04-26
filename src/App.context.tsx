import { createContext, useContext } from "react";

import type { FC, PropsWithChildren } from "react";

type AppContextType = {
	hello: string;
};

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: FC<PropsWithChildren> = ({ children }) => (
	<AppContext.Provider value={{ hello: "world" }}>
		{children}
	</AppContext.Provider>
);

export const useAppContext = () => useContext(AppContext);
