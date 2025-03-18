import styles from "./Sidebar.module.css";
import * as React from "react";

interface SidebarProps {
  onUpload: (part: string, data: string | ArrayBuffer | null) => void;
  onPositionChange: (
    part: string,
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
}: SidebarProps) {
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
  const handlePositionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    part: string,
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

  const handleLocalBgColorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleBgColorChange(event);
  };

  return (
    <div className={styles.sidebar}>
      <h2 style={{ color: "black" }}>Avatar Editor</h2>
      {selectedPart === "head" && (
        <>
          <h1 style={{ color: "#181818" }}>Head</h1>
          <label htmlFor="upload-head" className={styles.uploadInput}>
            Upload image +
          </label>
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
              max="700"
              value={positions.head.top}
              onChange={(e) => handlePositionChange(e, "head", "top")}
              className={styles.MInput}
            />
            <label>Left</label>
            <input
              type="range"
              min="0"
              max="1200"
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
              <p>{heights.head}PX</p>
            </label>
            <input
              type="range"
              min="0"
              max="300"
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
          <label htmlFor="upload-body" className={styles.uploadInput}>
            Upload Image +
          </label>
          <input
            id="upload-body"
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
              max="700"
              value={positions.body.top}
              onChange={(e) => handlePositionChange(e, "body", "top")}
              className={styles.MInput}
            />
            <label>Left</label>
            <input
              type="range"
              min="0"
              max="1200"
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
          <label htmlFor="upload-legs" className={styles.uploadInput}>
            Upload Images +
          </label>
          <input
            id="upload-legs"
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
              max="700"
              value={positions.legs.top}
              onChange={(e) => handlePositionChange(e, "legs", "top")}
              className={styles.MInput}
            />
            <label>Left</label>
            <input
              type="range"
              min="0"
              max="1200"
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
      <div className={styles.BgColorDiv}>
        <label style={{ color: "#181818" }}>Background Color</label>
        <input
          type="color"
          className={styles.ColorInput}
          value={bgColor}
          onChange={handleLocalBgColorChange}
        />
        <label style={{ color: "#181818" }}>Include Background</label>
        <div className={styles.checkboxwrapper2}>
          <input
            type="checkbox"
            checked={includeBg}
            onChange={handleIncludeBgChange}
            className={styles.ikxBAC}
          />
        </div>
      </div>
    </div>
  );
}
