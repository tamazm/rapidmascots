import { useState } from "react";
import styles from "./Sidebar.module.css";
import logo from "../../public/logo.png";
import Image from "next/image";
import Apreset1 from "../../public/preset1.png";
import Apreset2 from "../../public/preset2.png";
import Apreset3 from "../../public/preset3.png";
import modalImg from "../../public/modalimg.png";

interface NavbarProps {
  onDownload: (format: string) => void; // Modify the prop to accept format
  onSelectedPreset: (preset: string) => void;
}

export default function Navbar({ onDownload, onSelectedPreset }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState(false);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (format: string) => {
    onDownload(format);
    setIsOpen(false);
  };
  const handleLink = () => {
    window.open("https://klics.io", "_blank");
    setModal(false);
  };

  return (
    <div className={styles.NavbarMain}>
      <div className={styles.headerDiv}>
        <Image src={logo} alt="logo" className={styles.logo} />
        RapidMascots
      </div>
      <div className={styles.presetDiv}>
        <p style={{ color: "#181818", fontSize: "0.7rem" }}>Presets</p>
        <Image
          src={Apreset1}
          alt="preset1"
          className={styles.presetImg}
          onClick={() => {
            onSelectedPreset("preset1");
          }}
        />
        <Image
          src={Apreset2}
          alt="preset2"
          className={styles.presetImg}
          onClick={() => {
            onSelectedPreset("preset2");
          }}
        />
        <Image
          src={Apreset3}
          alt="preset3"
          className={styles.presetImg}
          onClick={() => {
            onSelectedPreset("preset3");
          }}
        />
      </div>

      <button className={styles.btn} onClick={handleButtonClick}>
        <span>Download</span>
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div
            onClick={() => {
              handleSelect("png");
              setIsOpen(false);
              setModal(true);
            }}
            className={styles.option}
          >
            Download as PNG
          </div>
          <div
            onClick={() => {
              handleSelect("svg");
              setIsOpen(false);
              setModal(true);
            }}
            className={styles.option}
          >
            Download as SVG
          </div>
        </div>
      )}

      {modal && (
        <div className={styles.bgDiv}>
          <div className={styles.modalCont}>
            <button className={styles.closeBtn} onClick={() => setModal(false)}>
              X
            </button>
            <Image src={modalImg} alt="modal img" className={styles.modalImg} />
            <p className={styles.text1}>
              Build your marketing games and <br />
              <span style={{ color: "#F06127" }}>convert 30% more!</span>
            </p>
            <p className={styles.text2}>
              We also built <span style={{ color: "#F06127" }}>Klics</span> a gamification platform to <br /> help eCommerce &
              Retail business build marketing <br /> games that help you convert 30%
              more. 100+ Marketers <br /> and Enterprise companies love us!
            </p>
            <button className={styles.linkBtn} onClick={handleLink}>Build Your Marketing Game</button>
            <p className={styles.text2}>App by <span style={{ color: "#F06127" }}>Klics</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
