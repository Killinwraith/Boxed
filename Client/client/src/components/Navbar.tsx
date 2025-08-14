import { Button } from "@/components/ui/button";
import styles from "./styling/navbar.module.css";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  const NAVBAR_HEIGHT = 50;

  return (
    <div className={styles.navbar} style={{ height: `${NAVBAR_HEIGHT}px` }}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarLogo}>
          <a href="/" className={styles.aStandard}>
            <div className={styles.navbarLogoChild}>
              <img
                src="/boxedLogo.png"
                alt="Boxed"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className={styles.standardText}>
                Box<span className={styles.redText}>Ed</span>
              </div>
            </div>
          </a>
        </div>

        <div className={styles.buttonGroup}>
          {isLoading ? null : isAuthenticated ? (
            <Button
              variant="outline"
              className={styles.redButton}
              onClick={() =>
                logout({
                  logoutParams: {
                    returnTo: window.location.origin,
                  },
                })
              }
            >
              Sign Out
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className={styles.standardButton}
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: { screen_hint: "login" },
                  })
                }
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                className={styles.redButton}
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: { screen_hint: "signup" },
                  })
                }
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
