import * as React from "react";
import { useEffect } from "react";
import styles from "./Sidebar.module.css";
import { useDropzone } from "react-dropzone";
import randomImg from "../../public/randomImg.png";
import Image from "next/image";
import DefHead from "../../public/assets/heads/head.png";
import DefBody from "../../public/assets/bodies/body.png";
import DefLegs from "../../public/assets/legs/legs.png";
import ColorPicker from "react-pick-color";

interface SidebarProps {
  onUpload: (part: string, data: string | ArrayBuffer | null) => void;
  onPositionChange: (
    part: "head" | "body" | "legs",
    position: { top: number; left: number }
  ) => void;
  onSizeChange: (part: string, size: number) => void;
  selectedPart: string;
  positions: { [key: string]: { top: number; left: number } };
  sizes: { head: number; body: number; legs: number };
  onRotationChange: (part: string, rotation: number) => void;
  rotation: { head: number; body: number; legs: number };
  bgColor: string;
  handleBgColorChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  includeBg: boolean;
  handleIncludeBgChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  heights: { head: number; body: number; legs: number };
  onHeightChange: (part: string, height: number) => void;
  images: { head: string; body: string; legs: string };
  onSelectedPreset: (preset: string) => void;
  bgImage: string;
  OriginalCanvasDimensions: { width: number; height: number };
}

export default function Sidebar({
  onUpload,
  onPositionChange,
  onSizeChange,
  onRotationChange,
  selectedPart,
  positions,
  sizes,
  rotation,
  bgColor,
  handleBgColorChange,
  includeBg,
  handleIncludeBgChange,
  heights,
  onHeightChange,
  images,
  onSelectedPreset,
  bgImage,
  OriginalCanvasDimensions,
}: SidebarProps) {
  const [bgBlock, setBgBlock] = React.useState(false);
  const [avatarBlock, setAvatarBlock] = React.useState(true);
  const isDefaultImage = (image: string) => image.includes("default.png");
  const [canvasDimensions, setCanvasDimensions] = React.useState({
    width: 0,
    height: 0,
  });
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    part: string
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(part, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (acceptedFiles: File[], part: string) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(part, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create separate dropzone configurations for each part
  const bgDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles, "bg"),
    accept: { "image/*": [] },
  });

  const headDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles, "head"),
    accept: { "image/*": [] },
  });

  const bodyDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles, "body"),
    accept: { "image/*": [] },
  });

  const legsDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles, "legs"),
    accept: { "image/*": [] },
  });

  const handlePositionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    part: "head" | "body" | "legs",
    axis: string
  ) => {
    const value = event.target.value ? parseInt(event.target.value, 10) : 0;
    onPositionChange(part, {
      ...positions[part],
      [axis]: value,
    });
  };

  const handleSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    part: string
  ) => {
    const newSize = parseInt(event.target.value, 10);
    onSizeChange(part, newSize);
  };

  const handleHeightChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    part: string
  ) => {
    const newHeight = parseInt(event.target.value, 10);
    onHeightChange(part, newHeight);
  };

  const handleRotationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    part: string
  ) => {
    const newRotation = parseInt(event.target.value, 10);
    onRotationChange(part, newRotation);
  };

  const handleBgToggle = () => {
    setBgBlock(false);
    setAvatarBlock(true);
  };

  const handleAvatarToggle = () => {
    setBgBlock(true);
    setAvatarBlock(false);
  };

  useEffect(() => {
    if (bgImage) {
      const img = document.createElement("img");
      img.src = bgImage;
      img.onload = () => {
        const canvasWidth = img.width - 100;
        const canvasHeight = img.height - 100;
        setCanvasDimensions({ width: canvasWidth, height: canvasHeight });
      };
    }
  }, [bgImage, OriginalCanvasDimensions]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarWrapper}>
        <div className={styles.menuToggle}>
          <button
            className={styles.menuItem}
            onClick={handleBgToggle}
            style={{ borderBottom: avatarBlock ? "1px solid #181818" : "none" }}
          >
            Avatar Editor
          </button>
          <button
            className={styles.menuItem}
            onClick={handleAvatarToggle}
            style={{ borderBottom: bgBlock ? "1px solid #181818" : "none" }}
          >
            Background Editor
          </button>
        </div>

        {avatarBlock && (
          <>
            <h2 style={{ color: "black" }}>Avatar Editor</h2>
            <div className={styles.partDisplay}>
              <p>Customize</p>
              <div className={styles.partRow}>
                <div className={styles.partDiv}>
                  <Image
                    src={
                      images.head && !isDefaultImage(images.head)
                        ? images.head
                        : DefHead.src
                    }
                    alt="Head"
                    className={styles.part}
                    onClick={() => {}}
                    width={50}
                    height={50}
                  />
                </div>
                <div className={styles.partDiv}>
                  <Image
                    src={
                      images.body && !isDefaultImage(images.body)
                        ? images.body
                        : DefBody.src
                    }
                    alt="Body"
                    className={styles.part}
                    onClick={() => {}}
                    width={50}
                    height={50}
                  />
                </div>
                <div className={styles.partDiv}>
                  <Image
                    src={
                      images.legs && !isDefaultImage(images.legs)
                        ? images.legs
                        : DefLegs.src
                    }
                    alt="Legs"
                    className={styles.part}
                    onClick={() => {}}
                    width={50}
                    height={50}
                  />
                </div>
                <div className={styles.partDiv}>
                  <Image
                    src={randomImg}
                    alt="Random"
                    className={styles.part}
                    onClick={() => {
                      onSelectedPreset("random");
                    }}
                    width={30}
                    height={30}
                  />
                </div>
              </div>
            </div>
            {selectedPart === "head" && (
              <>
                <h1 style={{ color: "#181818" }}>Head</h1>
                <div
                  {...headDropzone.getRootProps({
                    className: styles.uploadInput,
                  })}
                >
                  <input {...headDropzone.getInputProps()} />
                  <p
                    style={{
                      fontSize: "0.8rem",
                      padding: "3rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Drop your Head Image here
                  </p>
                </div>
                <input
                  id="upload-head"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "head")}
                  style={{ display: "none" }}
                />
                <div className={styles.inputCont}>
                  <label>Top</label>
                  <input
                    type="range"
                    min="0"
                    max={bgImage ? canvasDimensions.height : OriginalCanvasDimensions.height || 700}
                    value={positions.head.top}
                    onChange={(e) => handlePositionChange(e, "head", "top")}
                    className={styles.MInput}
                  />
                  <label>Left</label>
                  <input
                    type="range"
                    min="0"
                    max={bgImage ? canvasDimensions.width : OriginalCanvasDimensions.width || 1200}
                    value={positions.head.left}
                    onChange={(e) => handlePositionChange(e, "head", "left")}
                    className={styles.MInput}
                  />
                </div>
                <div className={styles.MetricsDiv}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    {" "}
                    <p>Width</p>
                    <p>{sizes.head}PX</p>
                  </label>
                  <input
                    type="range"
                    value={sizes.head}
                    onChange={(e) => handleSizeChange(e, "head")}
                    className={styles.MInput}
                    min="0"
                    max="1000"
                  />
                </div>
                <div className={styles.MetricsDiv}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    {" "}
                    <p>Height</p>
                    <p>{heights.head}PX</p>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    className={styles.MInput}
                    value={heights.head || 0}
                    onChange={(e) => {
                      handleHeightChange(e, "head");
                    }}
                  />
                </div>
                <div className={styles.MetricsDiv}>
                  <label>Rotation</label>
                  <input
                    type="text"
                    className={styles.RotationInput}
                    value={rotation.head || 0}
                    onChange={(e) => {
                      handleRotationChange(e, "head");
                    }}
                  />
                </div>
              </>
            )}
            {selectedPart === "body" && (
              <>
                <h1 style={{ color: "#181818" }}>Body</h1>
                <div
                  {...bodyDropzone.getRootProps({
                    className: styles.uploadInput,
                  })}
                >
                  <input {...bodyDropzone.getInputProps()} />
                  <p style={{ fontSize: "0.8rem", padding: "3rem" }}>
                    Drop your Body Image here
                  </p>
                </div>
                <input
                  id="upload-head"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "body")}
                  style={{ display: "none" }}
                />
                <div className={styles.inputCont}>
                  <label>Top</label>
                  <input
                    type="range"
                    min="0"
                    max={bgImage ? canvasDimensions.height : OriginalCanvasDimensions.height || 700}
                    value={positions.body.top}
                    onChange={(e) => handlePositionChange(e, "body", "top")}
                    className={styles.MInput}
                  />
                  <label>Left</label>
                  <input
                    type="range"
                    min="0"
                    max={bgImage ? canvasDimensions.width : OriginalCanvasDimensions.width || 1200}
                    value={positions.body.left}
                    onChange={(e) => handlePositionChange(e, "body", "left")}
                    className={styles.MInput}
                  />
                </div>
                <div className={styles.MetricsDiv}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    {" "}
                    <p>Width</p>
                    <p>{sizes.body}PX</p>
                  </label>
                  <input
                    type="range"
                    value={sizes.body}
                    onChange={(e) => handleSizeChange(e, "body")}
                    className={styles.MInput}
                    min="0"
                    max="300"
                  />
                </div>
                <div className={styles.MetricsDiv}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    {" "}
                    <p>Height</p>
                    <p>{heights.body}PX</p>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    className={styles.MInput}
                    value={heights.head || 0}
                    onChange={(e) => {
                      handleHeightChange(e, "body");
                    }}
                  />
                </div>
                <div className={styles.MetricsDiv}>
                  <label>Rotation</label>
                  <input
                    type="text"
                    className={styles.RotationInput}
                    value={rotation.body || 0}
                    onChange={(e) => {
                      handleRotationChange(e, "body");
                    }}
                  />
                </div>
              </>
            )}
            {selectedPart === "legs" && (
              <>
                <h1 style={{ color: "#181818" }}>Legs</h1>
                <div
                  {...legsDropzone.getRootProps({
                    className: styles.uploadInput,
                  })}
                >
                  <input {...legsDropzone.getInputProps()} />
                  <p style={{ fontSize: "0.8rem", padding: "3rem" }}>
                    Drop your Legs Image here
                  </p>
                </div>
                <input
                  id="upload-head"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "legs")}
                  style={{ display: "none" }}
                />
                <div className={styles.inputCont}>
                  <label>Top</label>
                  <input
                    type="range"
                    min="0"
                    max={bgImage ? canvasDimensions.height : OriginalCanvasDimensions.height || 700}
                    value={positions.legs.top}
                    onChange={(e) => handlePositionChange(e, "legs", "top")}
                    className={styles.MInput}
                  />
                  <label>Left</label>
                  <input
                    type="range"
                    min="0"
                    max={bgImage ? canvasDimensions.width : OriginalCanvasDimensions.width || 1200}
                    value={positions.legs.left}
                    onChange={(e) => handlePositionChange(e, "legs", "left")}
                    className={styles.MInput}
                  />
                </div>
                <div className={styles.MetricsDiv}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    {" "}
                    <p>Width</p>
                    <p>{sizes.legs}PX</p>
                  </label>
                  <input
                    type="range"
                    value={sizes.legs}
                    onChange={(e) => handleSizeChange(e, "legs")}
                    className={styles.MInput}
                    min="0"
                    max="300"
                  />
                </div>
                <div className={styles.MetricsDiv}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    {" "}
                    <p>Height</p>
                    <p>{heights.legs}PX</p>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    className={styles.MInput}
                    value={heights.legs || 0}
                    onChange={(e) => {
                      handleHeightChange(e, "legs");
                    }}
                  />
                </div>
                <div className={styles.MetricsDiv}>
                  <label>Rotation</label>
                  <input
                    type="text"
                    className={styles.RotationInput}
                    value={rotation.legs || 0}
                    onChange={(e) => {
                      handleRotationChange(e, "legs");
                    }}
                  />
                </div>
              </>
            )}
          </>
        )}

        {bgBlock && (
          <div className={styles.BgColorDiv}>
            <h2 style={{ color: "black" }}>Background Editor</h2>
            <label style={{ color: "#181818" }}>Include Background</label>
            <div className={styles.checkboxwrapper2}>
              <input
                type="checkbox"
                checked={includeBg}
                onChange={handleIncludeBgChange}
                className={styles.ikxBAC}
              />
            </div>
            <label style={{ color: "#181818" }}>Background Image</label>
            <div
              {...bgDropzone.getRootProps({ className: styles.uploadInput })}
            >
              <input {...bgDropzone.getInputProps()} />
              <p
                style={{
                  fontSize: "0.8rem",
                  padding: "3rem",
                  whiteSpace: "nowrap",
                }}
              >
                Upload Background Image
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "bg")}
              style={{ display: "none" }}
            />
            <label style={{ color: "#181818" }}>Background Color</label>
            <ColorPicker
              color={bgColor}
              onChange={(color) => {
                // Create a synthetic event to match the expected interface
                const syntheticEvent = {
                  target: {
                    value: color.hex,
                  },
                } as React.ChangeEvent<HTMLInputElement>;

                handleBgColorChange(syntheticEvent);
              }}
            />{" "}
          </div>
        )}
      </div>
      <p style={{ color: "#181818" }}>
        App by{" "}
        <span style={{ color: "#F06127" }}>
          <a
            href="https://klics.io"
            target="_blank"
            style={{ color: "#F06127" }}
          >
            Klics
          </a>
        </span>
      </p>
    </div>
  );
}
