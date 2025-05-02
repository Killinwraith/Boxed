import styles from "./ButtonStyling.module.css";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

const ButtonWithInput = ({ children }: { children: React.ReactNode }) => {
  const [input, setInput] = useState("");

  return (
    <div className="flex justify-center">
      <Input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        placeholder="Search By City"
        className={styles.inputStyle}
      />
      <Button
        onClick={() => {
          console.log(input);
        }}
        className={styles.redButton}
      >
        {children}
      </Button>
    </div>
  );
};

export default ButtonWithInput;
