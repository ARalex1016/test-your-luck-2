import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

// Store
import useStore from "../../Store/useStore";

// Components
import Coins from "../Coins";

// Icons
import { FaBars } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const Header = () => {
  const { isAuthenticated, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isNavOpen, setIsNavOpen] = useState(false);

  const navRef = useRef(null);

  const openNav = () => {
    setIsNavOpen(true);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  // Automatically close the navbar when the route changes
  useEffect(() => {
    closeNav();
  }, [location.pathname]); // Runs whenever the route changes

  // Close navbar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeNav();
      }
    };

    if (isNavOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavOpen]);

  // Close navbar on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (isNavOpen) {
        closeNav();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isNavOpen]);

  const handleClick = async () => {
    try {
      if (isAuthenticated) {
        await logout();

        navigate("/login");
      } else if (!isAuthenticated) {
        navigate("/signup");
      }

      closeNav();
    } catch (error) {}
  };

  return (
    <>
      <header
        className="w-full h-menuHeight flex flex-row justify-between items-center px-paddingX fixed z-40"
        style={{
          backgroundColor: "hsl(216, 14%, 7%, .8)",
          backdropFilter: "blur(3px)",
        }}
      >
        <p
          onClick={() => navigate("/")}
          className="text-accent text-2xl font-bold"
        >
          Logo
        </p>

        {!isNavOpen && (
          <FaBars
            onClick={openNav}
            className="text-2xl md:hidden text-secondary"
          />
        )}

        {isNavOpen && (
          <IoMdClose
            onClick={closeNav}
            className="text-3xl text-red-600 md:hidden"
          />
        )}

        {/* Mobile Nav */}
        <AnimatePresence>
          {isNavOpen && (
            <motion.nav
              ref={navRef}
              variants={{
                initial: {
                  height: 0,
                },
                final: {
                  height: "fit-content",
                },
              }}
              initial="initial"
              animate="final"
              exit="initial"
              transition={{
                duration: 0.3,
                ease: "easeIn",
              }}
              className="w-1/2 rounded-lg flex justify-start overflow-hidden md:hidden absolute right-paddingX z-50 p-6"
              style={{
                backgroundColor: "hsl(216, 14%, 7%, .8)",
                backdropFilter: "blur(3px)",
                boxShadow: "0 2px 8px hsl(210, 100%, 41%)",
                top: "calc(100% - 8px)",
              }}
            >
              <ul className="flex flex-col justify-between items-start gap-y-6">
                {/* Coins */}
                {isAuthenticated && (
                  <li>
                    <Coins />
                  </li>
                )}

                {/* Dashboard */}
                {isAuthenticated && (
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `text-xl font-medium  hover:text-accent transition-all duration-300 ${
                        isActive ? "text-accent" : "text-secondary"
                      }`
                    }
                  >
                    <li>Dashboard</li>
                  </NavLink>
                )}

                {/* Contests */}
                <NavLink
                  to="/contest"
                  className={({ isActive }) =>
                    `text-xl font-medium  hover:text-accent transition-all duration-300 ${
                      isActive ? "text-accent" : "text-secondary"
                    }`
                  }
                >
                  <li>Contest</li>
                </NavLink>

                {/* Referral */}

                <NavLink
                  to="/referral"
                  className={({ isActive }) =>
                    `text-xl font-medium  hover:text-accent transition-all duration-300 ${
                      isActive ? "text-accent" : "text-secondary"
                    }`
                  }
                >
                  <li>Referral</li>
                </NavLink>

                {/* Profile */}
                {isAuthenticated && (
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `text-xl font-medium  hover:text-accent transition-all duration-300 ${
                        isActive ? "text-accent" : "text-secondary"
                      }`
                    }
                  >
                    <li>Profile</li>
                  </NavLink>
                )}

                {/* About Us */}
                <NavLink
                  to="/about-us"
                  className={({ isActive }) =>
                    `text-xl font-medium  hover:text-accent transition-all duration-300 ${
                      isActive ? "text-accent" : "text-secondary"
                    }`
                  }
                >
                  <li>About Us</li>
                </NavLink>

                {/* Contact Us */}
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `text-xl font-medium  hover:text-accent transition-all duration-300 ${
                      isActive ? "text-accent" : "text-secondary"
                    }`
                  }
                >
                  <li>Contact</li>
                </NavLink>

                {/* Sign up || Log out Button */}
                <li
                  onClick={handleClick}
                  className={`${
                    isAuthenticated
                      ? "text-xl"
                      : "mobilesm:text-sm mobile:text-base"
                  } font-bold text-secondary text-center bg-red-600 rounded-md transition-all duration-300 px-2 py-1`}
                >
                  {isAuthenticated ? "Logout" : "Create new account"}
                </li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Desktop Nav */}
        {/* <nav className="w-2/3">
          <ul className="w-full flex flex-row justify-between">
            <li>Dashboard</li>
            <li>Contest</li>
            <li>About Us</li>
            <li>Profile</li>
          </ul>
        </nav> */}
      </header>
    </>
  );
};

export default Header;
