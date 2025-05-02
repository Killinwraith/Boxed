import styles from "./ButtonStyling.module.css";
import { Button } from "../ui/button";

const StandardRedButon = ({
  redDirectLink,
  children,
}: {
  children: React.ReactNode;
  redDirectLink: string;
}) => {
  return (
    <div>
      <div className={styles.buttonGroup}>
        <a href={redDirectLink}>
          <Button variant={"secondary"} className={styles.redButton2}>
            {children}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default StandardRedButon;
