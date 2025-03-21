import styles from "./AvatarPreview.module.css";
import DefHead from "../../public/assets/heads/head.png";
import DefBody from "../../public/assets/bodies/body.png";
import DefLegs from "../../public/assets/legs/legs.png";
import { useEffect, useState } from "react";

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
  height: {
    head: number;
    body: number;
    legs: number;
  };
  rotation: {
    head: number;
    body: number;
    legs: number;
  };
  bgColor: string;
  bgImage: string;
  onSelectPart: (part: string) => void;
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
}: AvatarPreviewProps) {
  const isDefaultImage = (image: string) => image.includes("default.png");
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    if (bgImage) {
      const img = new Image();
      img.src = bgImage;
      img.onload = () => {
        let canvasWidth = img.width;
        let canvasHeight = img.height;

        const maxDimension = 1000; 
        if (canvasWidth > maxDimension || canvasHeight > maxDimension) {
          const aspectRatio = canvasWidth / canvasHeight;
          if (canvasWidth > canvasHeight) {
            canvasWidth = maxDimension;
            canvasHeight = maxDimension / aspectRatio;
          } else {
            canvasHeight = maxDimension;
            canvasWidth = maxDimension * aspectRatio;
          }
        }

        setCanvasDimensions({ width: canvasWidth, height: canvasHeight });
        setScaleFactor(img.width / canvasWidth);
      };
    }
  }, [bgImage]);

  return (
    <div className={styles.avatarPreview}>
      <div
        className={styles.avatarCanvas}
        style={{
          backgroundColor: bgColor,
          backgroundImage: `url(${bgImage})`,
          width: bgImage ? `${canvasDimensions.width}px` : "100%",
          height: bgImage ? `${canvasDimensions.height}px` : "100%",
        }}
      >
        <img
          src={
            images.head && !isDefaultImage(images.head)
              ? images.head
              : DefHead.src
          }
          alt="Head"
          className={styles.part}
          style={{
            top: bgImage ? positions.head.top / scaleFactor : positions.head.top,
            left: bgImage ? positions.head.left / scaleFactor : positions.head.left,
            zIndex: 9,
            transform: `rotate(${rotation.head}deg)`,
            width: bgImage ? size.head / scaleFactor : size.head,
            height: bgImage ? height.head / scaleFactor : height.head,
          }}
          onClick={() => onSelectPart("head")}
        />
        <img
          src={
            images.body && !isDefaultImage(images.body)
              ? images.body
              : DefBody.src
          }
          alt="Body"
          className={styles.part}
          style={{
            top: bgImage ? positions.body.top / scaleFactor : positions.body.top,
            left: bgImage ? positions.body.left / scaleFactor : positions.body.left,
            zIndex: 8,
            transform: `rotate(${rotation.body}deg)`,
            width: bgImage ? size.body / scaleFactor : size.body,
            height: bgImage ? height.body / scaleFactor : height.body,
          }}
          onClick={() => onSelectPart("body")}
        />
        <img
          src={
            images.legs && !isDefaultImage(images.legs)
              ? images.legs
              : DefLegs.src
          }
          alt="Legs"
          className={styles.part}
          style={{
            top: bgImage ? positions.legs.top / scaleFactor : positions.legs.top,
            left: bgImage ? positions.legs.left / scaleFactor : positions.legs.left,
            zIndex: 7,
            transform: `rotate(${rotation.legs}deg)`,
            width: bgImage ? size.legs / scaleFactor : size.legs,
            height: bgImage ? height.legs / scaleFactor : height.legs,
          }}
          onClick={() => onSelectPart("legs")}
        />
      </div>
    </div>
  );
}
