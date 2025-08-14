import styles from "./ButtonStyling.module.css";
import { Button } from "../ui/button";

interface StandardRedButtonProps {
  children: React.ReactNode;
  redDirectLink?: string;
  onClick?: () => void;
}

const StandardRedButton = ({
  children,
  redDirectLink,
  onClick,
}: StandardRedButtonProps) => {
  // If redDirectLink exists, render as <a>, else render as <Button> with onClick
  return (
    <div className={styles.buttonGroup}>
      {redDirectLink ? (
        <a href={redDirectLink}>
          <Button variant="secondary" className={styles.redButton2}>
            {children}
          </Button>
        </a>
      ) : (
        <Button
          variant="secondary"
          className={styles.redButton2}
          onClick={onClick}
        >
          {children}
        </Button>
      )}
    </div>
  );
};

export default StandardRedButton;
