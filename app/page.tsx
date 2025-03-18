import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Welcome to Avatar Builder</h1>
      <p>Click below to start editing your avatar:</p>
      <Link href="/editor">
        <button className={styles.startButton}>Go to Editor</button>
      </Link>
    </div>
  );
}
