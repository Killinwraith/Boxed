import { Button } from "../ui/button";
import styles from "./ButtonStyling.module.css";

const StandardWhiteButton = ({
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
          <Button variant={"outline"} className={styles.standardButton}>
            {children}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default StandardWhiteButton;
