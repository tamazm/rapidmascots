"use client";

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import AvatarPreview from "@/app/components/AvatarPreview";
import styles from "./editor.module.css";
import Navbar from "../components/Navbar";
import DefHead from "../../public/assets/heads/head.png";
import DefBody from "../../public/assets/bodies/body.png";
import DefLegs from "../../public/assets/legs/legs.png";

import body1 from "../../public/assets/bodies/body1.png";
import body2 from "../../public/assets/bodies/body2.png";
import body3 from "../../public/assets/bodies/body3.png";
import body4 from "../../public/assets/bodies/body4.png";
import body5 from "../../public/assets/bodies/body5.png";
import body6 from "../../public/assets/bodies/body6.png";
import body7 from "../../public/assets/bodies/body7.png";

import head1 from "../../public/assets/heads/head1.png";
import head2 from "../../public/assets/heads/head2.png";
import head3 from "../../public/assets/heads/head3.png";
import head4 from "../../public/assets/heads/head4.png";
import head5 from "../../public/assets/heads/head5.png";
import head6 from "../../public/assets/heads/head6.png";
import head7 from "../../public/assets/heads/head7.png";

import legs1 from "../../public/assets/legs/legs1.png";
import legs2 from "../../public/assets/legs/legs2.png";
import legs3 from "../../public/assets/legs/legs3.png";
import legs4 from "../../public/assets/legs/legs4.png";

export default function EditorPage() {
  const [images, setImages] = useState({
    head: "/assets/heads/default.png",
    body: "/assets/bodies/default.png",
    legs: "/assets/legs/default.png",
  });

  const [bgColor, setBgColor] = useState(" ");
  const [bgImage, setBgImage] = useState<string | ArrayBuffer | null>(null);

  const [size, setSizes] = useState({
    head: 150,
    body: 150,
    legs: 120,
  });
  const [height, setHeight] = useState({
    head: 180,
    body: 180,
    legs: 150,
  });

  const [rotation, setRotation] = useState({
    head: 0,
    body: 0,
    legs: 0,
  });

  const [positions, setPositions] = useState<{
    head: { top: number; left: number };
    body: { top: number; left: number };
    legs: { top: number; left: number };
  }>({
    head: { top: 150, left: 550 },
    body: { top: 290, left: 545 },
    legs: { top: 430, left: 570 },
  });

  const handleUpload = (part: string, src: string | ArrayBuffer | null) => {
    if (part === "bg") {
      setBgImage(src);
    } else {
      setImages((prevImages) => ({
        ...prevImages,
        [part]: src,
      }));
    }
  };

  type Part = "head" | "body" | "legs";

  const handlePositionChange = (
    part: Part,
    position: { top?: number; left?: number }
  ) => {
    setPositions((prevPositions) => ({
      ...prevPositions,
      [part]: { ...prevPositions[part], ...position },
    }));
  };

  const isDefaultImage = (image: string) => image.includes("default.png");
  const [selectedPart, setSelectedPart] = useState("head"); // State to track selected part
  const [includeBg, setIncludeBg] = useState(true); // State to track if background should be included

  const handleDownload = async (format: string) => {
    const headImage =
      images.head && !isDefaultImage(images.head) ? images.head : DefHead.src;
    const bodyImage =
      images.body && !isDefaultImage(images.body) ? images.body : DefBody.src;
    const legsImage =
      images.legs && !isDefaultImage(images.legs) ? images.legs : DefLegs.src;

    const parts = [
      { image: headImage, position: positions.head, size: size.head },
      { image: bodyImage, position: positions.body, size: size.body },
      { image: legsImage, position: positions.legs, size: size.legs },
    ];

    // Calculate the bounding box of the avatar parts
    const minX = Math.min(...parts.map((part) => part.position.left));
    const minY = Math.min(...parts.map((part) => part.position.top));
    const maxX = Math.max(
      ...parts.map((part) => part.position.left + part.size)
    );
    const maxY = Math.max(
      ...parts.map((part) => part.position.top + part.size)
    );

    // Add 240px padding around the avatar if background is included
    const padding = includeBg ? 240 : 50;
    let canvasWidth = maxX - minX + padding * 2;
    let canvasHeight = maxY - minY + padding * 2;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      const loadImage = (src: string) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = src;
          img.onload = () => resolve(img);
        });
      };

      if (includeBg) {
        if (bgImage) {
          const bgImg = await loadImage(bgImage as string);
          canvasWidth = bgImg.width;
          canvasHeight = bgImg.height;
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
          console.log("sigrdze sigane", canvasWidth, canvasHeight);
        } else {
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
      } else {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }

      const [legsImg, bodyImg, headImg] = await Promise.all([
        loadImage(legsImage),
        loadImage(bodyImage),
        loadImage(headImage),
      ]);

      ctx.drawImage(
        legsImg,
        positions.legs.left - minX + padding,
        positions.legs.top - minY + padding,
        size.legs,
        height.legs
      );
      ctx.drawImage(
        bodyImg,
        positions.body.left - minX + padding,
        positions.body.top - minY + padding,
        size.body,
        height.body
      );
      ctx.drawImage(
        headImg,
        positions.head.left - minX + padding,
        positions.head.top - minY + padding,
        size.head,
        height.head
      );

      if (format === "png") {
        const link = document.createElement("a");
        link.download = "avatar.png";
        link.href = canvas.toDataURL();
        link.click();
      } else if (format === "svg") {
        const pngDataUrl = canvas.toDataURL();
        const svgString = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}">
            <image href="${pngDataUrl}" width="${canvasWidth}" height="${canvasHeight}" />
          </svg>
        `;
        const svgBlob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);

        const link = document.createElement("a");
        link.download = "avatar.svg";
        link.href = url;
        link.click();
      }
    }
  };

  const handleIncludeBgChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIncludeBg(event.target.checked);
  };

  const handleSizeChange = (part: string, newSize: number) => {
    setSizes((prevSizes) => ({
      ...prevSizes,
      [part]: newSize,
    }));
  };
  const handleHeightChange = (part: string, newHeight: number) => {
    setHeight((prevHeight) => ({
      ...prevHeight,
      [part]: newHeight,
    }));
  };

  const handleSelectPart = (part: string) => {
    setSelectedPart(part);
  };

  const handleRotationChange = (part: string, rotation: number) => {
    setRotation((prevRotation) => ({
      ...prevRotation,
      [part]: rotation,
    }));
  };

  const handleBgColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBgColor(event.target.value);
  };

  const handleSelectedPreset = (preset: string) => {
    if (preset === "preset1") {
      setImages({
        head: head1.src,
        body: body1.src,
        legs: legs1.src,
      });
      setSizes({
        head: 200,
        body: 170,
        legs: 90,
      });
      setHeight({
        head: 200,
        body: 170,
        legs: 90,
      });
      setPositions({
        head: { top: 170, left: 540 },
        body: { top: 310, left: 545 },
        legs: { top: 465, left: 575 },
      });
      setRotation({
        head: 0,
        body: 0,
        legs: 0,
      });
      setBgColor("#1D2333");
    } else if (preset === "preset2") {
      setImages({
        head: head2.src,
        body: body2.src,
        legs: legs2.src,
      });
      setSizes({
        head: 220,
        body: 120,
        legs: 70,
      });
      setHeight({
        head: 200,
        body: 160,
        legs: 70,
      });
      setPositions({
        head: { top: 190, left: 530 },
        body: { top: 335, left: 565 },
        legs: { top: 470, left: 590 },
      });
      setRotation({
        head: 0,
        body: 0,
        legs: 0,
      });
      setBgColor("#1B4D3D");
    } else if (preset === "preset3") {
      setImages({
        head: head3.src,
        body: body3.src,
        legs: legs3.src,
      });
      setSizes({
        head: 170,
        body: 130,
        legs: 90,
      });
      setHeight({
        head: 170,
        body: 130,
        legs: 90,
      });
      setRotation({
        head: 10,
        body: 0,
        legs: 0,
      });
      setPositions({
        head: { top: 165, left: 535 },
        body: { top: 310, left: 550 },
        legs: { top: 420, left: 570 },
      });
      setBgColor("#2B2B2B");
    } else if (preset === "random") {
      // Array of available head images
      const headOptions = [
        head1.src, 
        head2.src, 
        head3.src, 
        head4.src, 
        head5.src, 
        head6.src, 
        head7.src
      ];
      
      // Array of all available body images
      const bodyOptions = [
        body1.src, 
        body2.src, 
        body3.src, 
        body4.src, 
        body5.src, 
        body6.src, 
        body7.src
      ];
      
      // Array of all available legs images
      const legsOptions = [
        legs1.src, 
        legs2.src, 
        legs3.src, 
        legs4.src
      ];

      // Random color generator
      const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

      // Random number within range
      const getRandomNumber = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      // Set random images
      setImages({
        head: headOptions[Math.floor(Math.random() * headOptions.length)],
        body: bodyOptions[Math.floor(Math.random() * bodyOptions.length)],
        legs: legsOptions[Math.floor(Math.random() * legsOptions.length)],
      });

      // Set random sizes
      setSizes({
        head: getRandomNumber(130, 220),
        body: getRandomNumber(110, 170),
        legs: getRandomNumber(70, 120),
      });

      // Set random heights
      setHeight({
        head: getRandomNumber(140, 200),
        body: getRandomNumber(110, 180),
        legs: getRandomNumber(70, 150),
      });

      // Set random rotation
      setRotation({
        head: getRandomNumber(-15, 15),
        body: getRandomNumber(-5, 5),
        legs: getRandomNumber(-5, 5),
      });

      // Set random positions
      setPositions({
        head: {
          top: getRandomNumber(150, 200),
          left: getRandomNumber(510, 560),
        },
        body: {
          top: getRandomNumber(290, 330),
          left: getRandomNumber(535, 575),
        },
        legs: {
          top: getRandomNumber(410, 470),
          left: getRandomNumber(550, 590),
        },
      });

      // Set random background color
      setBgColor(getRandomColor());
    }
  };

  return (
    <div className={styles.editorContainer}>
      <Navbar
        onDownload={handleDownload}
        onSelectedPreset={handleSelectedPreset}
      />
      <div className={styles.SidebarAvatarWrapper}>
        <Sidebar
          onUpload={handleUpload}
          onPositionChange={handlePositionChange}
          onSizeChange={handleSizeChange}
          selectedPart={selectedPart}
          positions={positions}
          rotation={rotation}
          onRotationChange={handleRotationChange}
          sizes={size}
          bgColor={bgColor}
          handleBgColorChange={handleBgColorChange}
          includeBg={includeBg}
          handleIncludeBgChange={handleIncludeBgChange}
          heights={height}
          onHeightChange={handleHeightChange}
          images={images}
          onSelectedPreset={handleSelectedPreset}
        />
        <AvatarPreview
          images={images}
          positions={positions}
          size={size}
          onSelectPart={handleSelectPart}
          rotation={rotation}
          bgColor={bgColor}
          height={height}
          bgImage={(bgImage as string) || ""}
        />
      </div>
    </div>
  );
}
