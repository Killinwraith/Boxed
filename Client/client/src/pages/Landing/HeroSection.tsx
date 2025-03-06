"use client";

import styles from "./HeroSection.module.css";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className={styles.hero}>
      <img src="/LandingBckGrnd.jpeg" alt="boxed logo" />
      <div className={styles.parentDiv}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.motionDiv}
        >
          <div className={styles.textDiv}>
            <h1>Let's Get Started With Your First File Upload</h1>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
