/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { usePendingPosOrdersAlert } from "../hooks/usePendingPosOrdersAlert";

const PendingPosOrdersContext = createContext();

export function PendingPosOrdersProvider({ children }) {
  const alertData = usePendingPosOrdersAlert();

  return <PendingPosOrdersContext.Provider value={alertData}>{children}</PendingPosOrdersContext.Provider>;
}

export function usePendingPosOrders() {
  const context = useContext(PendingPosOrdersContext);
  if (!context) {
    throw new Error("usePendingPosOrders must be used within PendingPosOrdersProvider");
  }
  return context;
}
