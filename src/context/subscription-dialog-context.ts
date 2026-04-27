"use client";
import { createContext, useContext } from "react";

type DialogCloseContextType = () => void;

export const DialogCloseContext = createContext<DialogCloseContextType | null>(
  null,
);
export const useDialogClose = () => {
  const context = useContext(DialogCloseContext);

  if (!context) {
    throw new Error(
      "useDialogClose must be used within a DialogCloseContext.Provider",
    );
  }

  return context;
};
