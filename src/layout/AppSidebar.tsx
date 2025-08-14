import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ChevronDownIcon,
  GridIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    name: "Documents",
    path: "/documents",
  },
];

const adminItems: NavItem[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    name: "User Management",
    path: "/admin/users",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    name: "Role Management", 
    path: "/admin/roles",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    name: "Audit Log",
    path: "/admin/audit-log",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: string;
    index: number;
  } | null>(null);

  const isActive = useCallback(
    (path: string) => {
      if (path === "/") {
        return location.pathname === "/";
      }
      return location.pathname.startsWith(path);
    },
    [location.pathname],
  );

  const handleSubmenuToggle = (menuType: string, index: number) => {
    setOpenSubmenu((prev) =>
      prev?.type === menuType && prev?.index === index
        ? null
        : { type: menuType, index },
    );
  };

  const handleMouseEnter = () => {
    if (!isExpanded && !isMobileOpen) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isExpanded && !isMobileOpen) {
      setIsHovered(false);
      setOpenSubmenu(null);
    }
  };

  useEffect(() => {
    if (!isExpanded && !isMobileOpen) {
      setOpenSubmenu(null);
    }
  }, [isExpanded, isMobileOpen]);

  const renderNavItems = (items: NavItem[], menuType: string) => {
    return items.map((nav, index) => (
      <li key={index} className="mb-1">
        {nav.subItems ? (
          <button
            onClick={() => handleSubmenuToggle(menuType, index)}
            className={`menu-item group w-full ${
              nav.subItems.some((item) => isActive(item.path))
                ? "menu-item-active"
                : "menu-item-inactive"
            } ${
              isExpanded || isHovered || isMobileOpen
                ? "lg:justify-between"
                : "lg:justify-center"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </div>
            {(isExpanded || isHovered || isMobileOpen) && (
              <ChevronDownIcon
                className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                  openSubmenu?.type === menuType &&
                  openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                }`}
              />
            )}
          </button>
        ) : (
          nav.path && (
            <Link
              to={nav.path}
              className={`menu-item group ${
                isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
              } ${
                isExpanded || isHovered || isMobileOpen
                  ? "justify-start"
                  : "justify-center"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </Link>
          )
        )}
        {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
          <ul
            className={`mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
              openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {nav.subItems.map((subItem, subIndex) => (
              <li key={subIndex}>
                <Link
                  to={subItem.path}
                  className={`menu-dropdown-item ${
                    isActive(subItem.path)
                      ? "menu-dropdown-item-active"
                      : "menu-dropdown-item-inactive"
                  }`}
                >
                  <span className="menu-dropdown-item-text">{subItem.name}</span>
                  {subItem.pro && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full dark:bg-orange-900 dark:text-orange-200">
                      PRO
                    </span>
                  )}
                  {subItem.new && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-200">
                      NEW
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 z-50 h-screen transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "w-[290px]" : "w-[90px]"
        } ${
          isMobileOpen 
            ? "translate-x-0" 
            : "max-lg:-translate-x-full"
        } bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-[90px] border-b border-gray-200 dark:border-gray-700">
            {isExpanded || isHovered || isMobileOpen ? (
              <Link to="/" className="flex items-center">
                <img
                  className="block h-8 w-auto dark:hidden"
                  src="/images/logo/logo.svg"
                  alt="ManaDoc"
                />
                <img
                  className="hidden h-8 w-auto dark:block"
                  src="/images/logo/logo-dark.svg"
                  alt="ManaDoc"
                />
              </Link>
            ) : (
              <Link to="/" className="flex items-center">
                <img
                  src="/images/logo/logo-icon.svg"
                  alt="Logo"
                  className="h-8 w-8"
                />
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
            {/* Main Navigation */}
            <div>
              {(isExpanded || isHovered || isMobileOpen) && (
                <h3 className="mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500">
                  MENU
                </h3>
              )}
              <ul className="space-y-1">
                {renderNavItems(navItems, "main")}
              </ul>
            </div>

            {/* Admin Navigation */}
            <div>
              {(isExpanded || isHovered || isMobileOpen) && (
                <h3 className="mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500">
                  ADMIN
                </h3>
              )}
              <ul className="space-y-1">
                {renderNavItems(adminItems, "admin")}
              </ul>
            </div>
          </nav>


        </div>
      </aside>
    </>
  );
};

export default AppSidebar;