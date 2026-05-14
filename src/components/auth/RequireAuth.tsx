import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "../../state/storeContext";
import type { Role } from "../../state/types";

export function RequireAuth({
  children,
  role,
}: {
  children: ReactNode;
  role?: Role;
}) {
  const { state } = useAppStore();
  const location = useLocation();
  const session = state.auth.session;

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}`, role }}
      />
    );
  }

  if (role && session.role !== role) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}`, role }}
      />
    );
  }

  return <>{children}</>;
}
