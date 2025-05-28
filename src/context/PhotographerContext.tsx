"use client";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

type PhotographerType = {
  photographerName: string;
  setPhotographerName: (name: string) => void;
};
const PhotographerContext = createContext<PhotographerType>({
  photographerName: "",
  setPhotographerName: () => {},
});
export const PhotographerContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [photographerName, setPhotographerName] = useState<string>("");
  return (
    <PhotographerContext.Provider
      value={{ photographerName, setPhotographerName }}
    >
      {children}
    </PhotographerContext.Provider>
  );
};
export const usePhotographer = () => useContext(PhotographerContext);
