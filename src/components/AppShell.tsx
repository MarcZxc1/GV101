import type { ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '../state/store'

function TopNav() {
  const { state, actions } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-brand-600 text-white">
            HL
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">HandiLink</div>
            <div className="text-xs text-slate-500">
              Beta locked: Quezon City, Philippines
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink
            to="/marketplace"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
              }`
            }
          >
            Marketplace
          </NavLink>
          <NavLink
            to="/customer"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
              }`
            }
          >
            Customer Portal
          </NavLink>
          <NavLink
            to="/provider"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
              }`
            }
          >
            Provider Portal
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden text-right text-xs text-slate-600 sm:block">
            <div className="font-medium text-slate-900">
              {state.role === 'customer' ? 'Customer mode' : 'Provider mode'}
            </div>
            <div className="truncate">{state.customerName}</div>
          </div>
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
            onClick={() => {
              const next = state.role === 'customer' ? 'provider' : 'customer'
              actions.setRole(next)
              if (location.pathname === '/') return
              navigate(next === 'customer' ? '/customer' : '/provider')
            }}
          >
            Switch to {state.role === 'customer' ? 'Provider' : 'Customer'}
          </button>
        </div>
      </div>
    </header>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-medium text-slate-900">HandiLink</span> — Reputation
            as currency.
          </div>
          <div className="text-xs">
            Demo build: in-memory state only · QC-only categories: Plumbing, Electrical, General
            Maintenance
          </div>
        </div>
      </footer>
    </div>
  )
}

