/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, createContext, useContext, useState } from "react";

export interface IDEProps {
  input: string;
  output: string;
  status: number
}

export const IDEContext = createContext<
 [IDEProps, React.Dispatch<React.SetStateAction<IDEProps>>]
>({} as any)

export const IDEProvider = ({
  children
}: { children: ReactNode })=> {
  const [state, setState] = useState<IDEProps>({
    input: '', output: '', status: 1
  })

  return <IDEContext.Provider value={[state, setState]}>
    {children}
  </IDEContext.Provider>
}

export const useIDE = ()=> useContext(IDEContext);
