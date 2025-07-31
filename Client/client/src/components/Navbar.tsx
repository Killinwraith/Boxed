import { Button } from "@/components/ui/button";
import styles from "./styling/navbar.module.css";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const NAVBAR_HEIGHT = 50;
  const navigate = useNavigate();
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
            <Link to="/Login/signIn" className={styles.aStandard}>
              <Button variant={"outline"} className={styles.standardButton}>
                Sign In
              </Button>
            </Link>
            <Link to="/Login/signUp" className={styles.aStandard}>
              <Button variant={"outline"} className={styles.redButton}>
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
