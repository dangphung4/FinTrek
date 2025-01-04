import React,{ createContext, useReducer, Dispatch, ReactNode } from "react";

interface QuickstartState {
  linkSuccess: boolean;
  isItemAccess: boolean;
  isPaymentInitiation: boolean;
  isUserTokenFlow: boolean;
  isCraProductsExclusively: boolean;
  linkToken: string | null;
  accessToken: string | null;
  userToken: string | null;
  itemId: string | null;
  isError: boolean;
  backend: boolean;
  products: string[];
  linkTokenError: {
    error_message: string;
    error_code: string;
    error_type: string;
  };
  institutionsLinked: string[];
}

const initialState: QuickstartState = {
  linkSuccess: false,
  isItemAccess: true,
  isPaymentInitiation: false,
  isCraProductsExclusively: false,
  isUserTokenFlow: false,
  linkToken: "", // Don't set to null or error message will show up briefly when site loads
  userToken: null,
  accessToken: null,
  itemId: null,
  isError: false,
  backend: true,
  products: ["transactions"],
  linkTokenError: {
    error_type: "",
    error_code: "",
    error_message: "",
  },
  institutionsLinked: [],
  
};

type QuickstartAction = {
  type: "SET_STATE";
  state: Partial<QuickstartState>;
};

interface QuickstartContext {
  state: QuickstartState; // Explicitly include the state
  dispatch: Dispatch<QuickstartAction>; // Include dispatch function
}


const Context = createContext<QuickstartContext>({
  state: initialState, // Initial state value
  dispatch: () => undefined, // Placeholder function for dispatch
});

const { Provider } = Context;
export const QuickstartProvider: React.FC<{ children: ReactNode }> = (
  props
) => {
  const reducer = (
    state: QuickstartState,
    action: QuickstartAction
  ): QuickstartState => {
    switch (action.type) {
      case "SET_STATE":
        return { ...state, ...action.state };
      default:
        return { ...state };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Provider value={{ state, dispatch }}>{props.children}</Provider>;
};

export default Context;
