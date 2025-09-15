"use client";
import { createContext, useContext } from "react";

type Session = { user_id: string; account_id: string } | null;

const SessionContext = createContext<Session>(null);

export function SessionProvider({
  value,
  children,
}: {
  value: Session;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
