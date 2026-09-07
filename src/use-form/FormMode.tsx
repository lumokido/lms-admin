'use client';
import React, { createContext, useContext } from "react";

type FormModeContextValue = {
  isReadOnly: boolean;
};

const FormModeContext = createContext<FormModeContextValue>({ isReadOnly: false });

type FormModeProviderProps = {
  isReadOnly: boolean;
  children: React.ReactNode;
};

export function FormModeProvider({ isReadOnly, children }: FormModeProviderProps) {
  return (
    <FormModeContext.Provider value={{ isReadOnly }}>
      {children}
    </FormModeContext.Provider>
  );
}

export function useFormMode() {
  return useContext(FormModeContext);
}

export default FormModeContext;


