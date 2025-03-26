import styles from "./AvatarPreview.module.css";
import DefHead from "../../public/assets/heads/head.png";
import DefBody from "../../public/assets/bodies/body.png";
import DefLegs from "../../public/assets/legs/legs.png";
import { useCallback, useEffect, useRef } from "react";

interface AvatarPreviewProps {
  images: {
    head: string;
    body: string;
    legs: string;
  };
  positions: {
    head: { top: number; left: number };
    body: { top: number; left: number };
    legs: { top: number; left: number };
  };
  size: {
    head: number;
    body: number;
    legs: number;
  };
  onSelectPart: (part: string) => void;
  rotation: {
    head: number;
    body: number;
    legs: number;
  };
  bgColor: string;
  height: {
    head: number;
    body: number;
    legs: number;
  };
  bgImage: string;
  onPositionChange: (
    part: "head" | "body" | "legs",
    position: { top: number; left: number },
    skipHistory?: boolean
  ) => void;
}

export default function AvatarPreview({
  images,
  positions,
  size,
  onSelectPart,
  rotation,
  bgColor,
  height,
  bgImage,
  onPositionChange,
  
}: AvatarPreviewProps) {
  const isDefaultImage = (image: string) => image.includes("default.png");
  const canvasRef = useRef<HTMLDivElement>(null);
  const hasBeenCentered = useRef(false);

  // In AvatarPreview.tsx, modify your centerAvatar function:
  const centerAvatar = useCallback(() => {
    if (!canvasRef.current || !onPositionChange) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const startY = rect.height * 0.2; // Start at 20% from top

    // Pass true to skipHistory when centering during initialization
    const skipHistory = !hasBeenCentered.current;

    // Center all parts horizontally and stack vertically
    onPositionChange(
      "head",
      { top: startY, left: centerX - size.head / 2 },
      skipHistory
    );

    onPositionChange(
      "body",
      {
        top: startY + height.head * 0.8,
        left: centerX - size.body / 2,
      },
      skipHistory
    );

    onPositionChange(
      "legs",
      {
        top: startY + height.head * 0.8 + height.body * 0.8,
        left: centerX - size.legs / 2,
      },
      skipHistory
    );
  }, [canvasRef, onPositionChange, size, height, hasBeenCentered]);

  useEffect(() => {
    // Only center if we have the callback and haven't centered yet
    if (!hasBeenCentered.current) {
      // Wait a bit to ensure everything is rendered
      const timer = setTimeout(() => {
        centerAvatar();
        hasBeenCentered.current = true;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [centerAvatar]);

  return (
    <div className={styles.avatarPreview} ref={canvasRef}>
      <div
        className={`${styles.avatarCanvas} avatarCanvas`}
        style={{
          backgroundColor: bgColor,
          backgroundImage: bgImage ? `url(${bgImage})` : "none",
        }}
      >
        {/* Head */}
        <img
          src={
            images.head && !isDefaultImage(images.head)
              ? images.head
              : DefHead.src
          }
          alt="Head"
          className={styles.part}
          style={{
            top: positions.head.top,
            left: positions.head.left,
            zIndex: 9,
            transform: `rotate(${rotation.head}deg)`,
            width: size.head,
            height: height.head,
          }}
          onClick={() => onSelectPart("head")}
        />

        {/* Body */}
        <img
          src={
            images.body && !isDefaultImage(images.body)
              ? images.body
              : DefBody.src
          }
          alt="Body"
          className={styles.part}
          style={{
            top: positions.body.top,
            left: positions.body.left,
            zIndex: 8,
            transform: `rotate(${rotation.body}deg)`,
            width: size.body,
            height: height.body,
          }}
          onClick={() => onSelectPart("body")}
        />

        {/* Legs */}
        <img
          src={
            images.legs && !isDefaultImage(images.legs)
              ? images.legs
              : DefLegs.src
          }
          alt="Legs"
          className={styles.part}
          style={{
            top: positions.legs.top,
            left: positions.legs.left,
            zIndex: 7,
            transform: `rotate(${rotation.legs}deg)`,
            width: size.legs,
            height: height.legs,
          }}
          onClick={() => onSelectPart("legs")}
        />
      </div>
    </div>
  );
}
