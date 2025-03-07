"use client";

import styles from "./styles/HeroSection.module.css";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
            <p className="text-xl text-white mb-8">
              All items uploaded are secured and encrypted to ensure omplete
              confidentiatlity and security.
            </p>
            <div className="flex justify-center">
              <Input
                type="text"
                value="Search Query"
                onChange={() => {}}
                placeholder="Search By City"
                className="w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12"
              />
              <Button onClick={() => {}} className={styles.redButton}>
                Search
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
