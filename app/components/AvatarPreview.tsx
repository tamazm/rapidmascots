import styles from "./AvatarPreview.module.css";
import DefHead from "../../public/assets/heads/head.png";
import DefBody from "../../public/assets/bodies/body.png";
import DefLegs from "../../public/assets/legs/legs.png";

interface AvatarImages {
  head: string;
  body: string;
  legs: string;
}

interface AvatarPreviewProps {
  images: AvatarImages;
  positions: { [key: string]: { top: number; left: number } };
  size: { head: number; body: number; legs: number };
  onSelectPart: (part: string) => void;
  rotation: { head: number; body: number; legs: number };
  bgColor: string;
  height: { head: number; body: number; legs: number };
  bgImage: string;
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

  return (
    <div className={styles.avatarPreview} style={{ backgroundColor: bgColor, backgroundImage: `url(${bgImage})` }}>
      <div className={styles.avatarCanvas}>
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
