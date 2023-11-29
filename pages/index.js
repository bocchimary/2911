import Head from "next/head";
import Image from "next/image";
import styles from "../components/styles/Home.module.css";
import Navbar from "../components/Navbar";
import LandingComponents from "../components/Landing";

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>TUPC Water Dispenser Refill Alert System</title>
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Navbar />
      <LandingComponents />
    </div>
  );
}
