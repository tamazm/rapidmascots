import styles from "./Sidebar.module.css";
import logo from "../../public/logo.png";
import Image from "next/image";
import Apreset1 from "../../public/preset1.png";
import Apreset2 from "../../public/preset2.png";
import Apreset3 from "../../public/preset3.png";

interface NavbarProps {
  onDownload: (format: string) => void; // Modify the prop to accept format
  onSelectedPreset: (preset: string) => void;
 }

export default function Navbar({ onDownload, onSelectedPreset }: NavbarProps) {
  const handleDownloadChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const format = event.target.value;
    if (format) {
      onDownload(format);
      event.target.value = "";
    }
  };

  return (
    <div className={styles.NavbarMain}>
      <div className={styles.headerDiv}>
        <Image src={logo} alt="logo" className={styles.logo} />
        RapidMascots
      </div>
      <div className={styles.presetDiv}>
        <Image src={Apreset1} alt="preset1" className={styles.presetImg} onClick={()=>{onSelectedPreset("preset1")}} />
        <Image src={Apreset2} alt="preset2" className={styles.presetImg} onClick={()=>{onSelectedPreset("preset2")}} />
        <Image src={Apreset3} alt="preset3" className={styles.presetImg} onClick={()=>{onSelectedPreset("preset3")}} />
      </div>
      <div className={styles.downloadBtn}>
        <select
          onChange={handleDownloadChange}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            color: "#181818",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          <option value="">Download</option>
          <option value="png">Download as PNG</option>
          <option value="svg">Download as SVG</option>
        </select>
      </div>
    </div>
  );
}
