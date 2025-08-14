// import Navbar from "@/components/Navbar";
import styles from "./styles/Layout.module.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const NAVBAR_HEIGHT = 50;
  return (
    <>
      <div className={styles.mainBody}>
        {/* <Navbar /> */}
        <main
          className={styles.mainContainer}
          style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
