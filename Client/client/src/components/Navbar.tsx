import { Button } from "@/components/ui/button";
import styles from "./styling/navbar.module.css";

const Navbar = () => {
  const NAVBAR_HEIGHT = 50;
  return (
    <>
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
                  Box
                  <span className={styles.redText}>Ed</span>
                </div>
              </div>
            </a>
          </div>
          <div className={styles.buttonGroup}>
            <a href="/signIn">
              <Button variant={"outline"} className={styles.standardButton}>
                Sign In
              </Button>
            </a>
            <a href="/signUp">
              <Button variant={"secondary"} className={styles.redButton}>
                Sign Up
              </Button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
