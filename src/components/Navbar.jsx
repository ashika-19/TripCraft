import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  Briefcase,
  CalendarDays,
  Wallet,
  Luggage,
  Menu,
  X,
  Plane,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/trips", label: "My Trips", icon: Briefcase },
  { to: "/itinerary", label: "Itinerary", icon: CalendarDays },
  { to: "/budget", label: "Budget", icon: Wallet },
  { to: "/packing", label: "Packing List", icon: Luggage },
];

function Brand() {
  return (
    <Link to="/" className="brand">
      <span className="brand-mark">
        <Plane size={20} />
      </span>
      <span>
        Trip<em>Craft</em>
      </span>
    </Link>
  );
}

export default function Navbar({ tripCount = 0 }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="topbar">
        <Brand />
        <button
          className="icon-btn"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={22} />
        </button>
      </header>

      <div
        className={`sidebar-overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-head">
          <Brand />
          <button
            className="icon-btn sidebar-close"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <p className="nav-label">Menu</p>
        <nav>
          <ul className="nav-list">
            {links.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-card">
          <strong>
            {tripCount === 0
              ? "Start your first trip"
              : `${tripCount} trip${tripCount > 1 ? "s" : ""} planned`}
          </strong>
          <p>
            {tripCount === 0
              ? "Pick a destination and craft your journey."
              : "Keep going. The world is waiting."}
          </p>
          <Link to="/explore" className="btn btn-orange btn-sm">
            Explore destinations
          </Link>
        </div>
      </aside>
    </>
  );
}
