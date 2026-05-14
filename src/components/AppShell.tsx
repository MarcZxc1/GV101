import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router-dom";
import { useAppStore } from "../state/storeContext";

function useRouteScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positionsRef = useRef(new Map<string, number>());

  useEffect(() => {
    const key = `${location.pathname}${location.search}`;
    const positions = positionsRef.current;
    return () => {
      positions.set(key, window.scrollY);
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    const key = `${location.pathname}${location.search}`;
    const stored = positionsRef.current.get(key);
    if (navigationType === "POP" && stored !== undefined) {
      window.scrollTo({ top: stored, behavior: "auto" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname, location.search, navigationType]);
}

function TopNav() {
  const { state, actions } = useAppStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const session = state.auth.session;

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-brand-50 text-brand-800 shadow-sm"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-brand-600 text-white">
            HL
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">
              HandiLink
            </div>
            <div className="text-xs text-slate-500">
              Beta locked: Quezon City, Philippines
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <NavLink to="/marketplace" className={navClass}>
            Marketplace
          </NavLink>
          <NavLink to="/customer" className={navClass}>
            Customer Portal
          </NavLink>
          <NavLink to="/provider" className={navClass}>
            Provider Portal
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <div className="hidden text-right text-xs text-slate-600 sm:block">
                <div className="font-medium text-slate-900">
                  {session.displayName}
                </div>
                <div className="capitalize">{session.role} account</div>
              </div>
              <button
                type="button"
                className="btn btn-secondary px-3 py-2 text-sm"
                onClick={() => {
                  actions.logout();
                  navigate("/");
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-secondary px-3 py-2 text-sm">
              Sign in
            </Link>
          )}
          <button
            type="button"
            className="btn btn-ghost px-3 py-2 text-sm md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-slate-200/70 bg-white/95 md:hidden"
        >
          <nav
            className="mx-auto grid max-w-6xl gap-2 px-4 py-3"
            aria-label="Mobile"
          >
            <NavLink
              to="/marketplace"
              className={navClass}
              onClick={() => setMobileOpen(false)}
            >
              Marketplace
            </NavLink>
            <NavLink
              to="/customer"
              className={navClass}
              onClick={() => setMobileOpen(false)}
            >
              Customer Portal
            </NavLink>
            <NavLink
              to="/provider"
              className={navClass}
              onClick={() => setMobileOpen(false)}
            >
              Provider Portal
            </NavLink>
            <NavLink
              to="/admin"
              className={navClass}
              onClick={() => setMobileOpen(false)}
            >
              Admin
            </NavLink>
            {session ? (
              <button
                type="button"
                className="btn btn-secondary px-3 py-2 text-sm"
                onClick={() => {
                  actions.logout();
                  setMobileOpen(false);
                  navigate("/");
                }}
              >
                Log out
              </button>
            ) : (
              <NavLink
                to="/login"
                className={navClass}
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </NavLink>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  useRouteScrollRestoration();
  const location = useLocation();
  const { state } = useAppStore();
  const isAuthRoute = location.pathname === "/login";

  const breadcrumbs = useMemo(() => {
    const path = location.pathname;
    if (path === "/") return [] as Array<{ label: string; to: string }>;

    const parts = path.split("/").filter(Boolean);
    const crumbs: Array<{ label: string; to: string }> = [];

    if (path.startsWith("/marketplace")) {
      crumbs.push({ label: "Marketplace", to: "/marketplace" });
      return crumbs;
    }

    if (path.startsWith("/providers/")) {
      const providerId = parts[1];
      const provider = state.providers.find((p) => p.id === providerId);
      crumbs.push({ label: "Marketplace", to: "/marketplace" });
      crumbs.push({ label: provider?.name ?? "Provider profile", to: path });
      return crumbs;
    }

    if (path.startsWith("/book/")) {
      const providerId = parts[1];
      const provider = state.providers.find((p) => p.id === providerId);
      crumbs.push({ label: "Marketplace", to: "/marketplace" });
      crumbs.push({ label: provider?.name ?? "Booking", to: path });
      return crumbs;
    }

    if (path.startsWith("/review/")) {
      crumbs.push({ label: "Customer portal", to: "/customer" });
      crumbs.push({ label: "Review", to: path });
      return crumbs;
    }

    if (path.startsWith("/messages/")) {
      crumbs.push({ label: "Messages", to: path });
      return crumbs;
    }

    if (path.startsWith("/customer")) {
      crumbs.push({ label: "Customer portal", to: "/customer" });
      return crumbs;
    }

    if (path.startsWith("/provider")) {
      crumbs.push({ label: "Provider portal", to: "/provider" });
      return crumbs;
    }

    if (path.startsWith("/admin")) {
      crumbs.push({ label: "Admin", to: "/admin" });
      return crumbs;
    }

    return crumbs;
  }, [location.pathname, state.providers]);

  return (
    <div className="app-shell">
      {!isAuthRoute ? (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow"
        >
          Skip to content
        </a>
      ) : null}
      {!isAuthRoute ? <TopNav /> : null}
      {!isAuthRoute && breadcrumbs.length > 0 ? (
        <div className="border-b border-slate-200/70 bg-white/60">
          <nav
            className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs text-slate-600"
            aria-label="Breadcrumb"
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <div key={crumb.to} className="flex items-center gap-2">
                  {isLast ? (
                    <span
                      aria-current="page"
                      className="font-semibold text-slate-900"
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <Link to={crumb.to} className="hover:text-slate-900">
                      {crumb.label}
                    </Link>
                  )}
                  {!isLast ? <span className="text-slate-400">/</span> : null}
                </div>
              );
            })}
          </nav>
        </div>
      ) : null}
      <main
        id="main-content"
        className={
          isAuthRoute ? "min-h-dvh" : "mx-auto min-h-[65vh] max-w-6xl px-4 py-6"
        }
      >
        {children}
      </main>
      {!isAuthRoute ? (
        <footer className="border-t border-slate-200/70 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-medium text-slate-900">HandiLink</span> —
              Reputation as currency.
            </div>
            <div className="text-xs">
              Demo build: in-memory state only · QC-only categories: Plumbing,
              Electrical, General Maintenance
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
