"use client";

import { useRef, useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import html2canvas from "html2canvas";
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
  const avatarPreviewRef = useRef<HTMLDivElement>(null);
  const isDefaultImage = (image: string) => image.includes("default.png");
  const [selectedPart, setSelectedPart] = useState("head"); // State to track selected part
  const [includeBg, setIncludeBg] = useState(true); // State to track if background should be included
  const [history, setHistory] = useState<
    {
      positions: typeof positions;
      size: typeof size;
      height: typeof height;
      rotation: typeof rotation;
      images: typeof images;
      bgColor: string;
      bgImage: string | ArrayBuffer | null;
    }[]
  >([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const maxHistoryLength = 20;

  // In EditorPage.tsx, add this near your other refs
  const isInitializing = useRef(true);

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
      saveToHistory({
        positions,
        size,
        height,
        rotation,
        images,
        bgColor,
        bgImage: src,
      });
    } else {
      setImages((prevImages) => {
        const newImages = {
          ...prevImages,
          [part]: src,
        };

        saveToHistory({
          positions,
          size,
          height,
          rotation,
          images: newImages,
          bgColor,
          bgImage,
        });

        return newImages;
      });
    }
  };

  type Part = "head" | "body" | "legs";

  const saveToHistory = (newState: {
    positions: typeof positions;
    size: typeof size;
    height: typeof height;
    rotation: typeof rotation;
    images: typeof images;
    bgColor: string;
    bgImage: string | ArrayBuffer | null;
  }) => {
    // Skip saving to history during initialization
    if (isInitializing.current) {
      console.log("Skipping history save during initialization");
      return;
    }

    // Truncate forward history if we've gone back and made a change
    const newHistory = history.slice(0, currentHistoryIndex + 1);

    // Add the new state to history
    newHistory.push(newState);

    // Limit history length by removing oldest entries
    if (newHistory.length > maxHistoryLength) {
      newHistory.shift();
    }

    // Update history and index
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  // Add this function after saveToHistory
  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const prevState = history[newIndex];

      // Restore previous state
      setPositions(prevState.positions);
      setSizes(prevState.size);
      setHeight(prevState.height);
      setRotation(prevState.rotation);
      setImages(prevState.images);
      setBgColor(prevState.bgColor);
      setBgImage(prevState.bgImage);

      // Update index
      setCurrentHistoryIndex(newIndex);
    }
  };

  // Add this useEffect near the top of your component
  // Add this useEffect after your initialization useEffect
  useEffect(() => {
    // Wait a bit longer than the centerAvatar delay
    const initTimer = setTimeout(() => {
      // Save initial state properly after centering is complete
      const initialState = {
        positions,
        size,
        height,
        rotation,
        images,
        bgColor,
        bgImage,
      };

      // Replace the history instead of adding to it
      setHistory([initialState]);
      setCurrentHistoryIndex(0);

      // Mark initialization as complete
      isInitializing.current = false;
      console.log("Initialization complete, history tracking enabled");
    }, 500); // Wait 500ms (longer than the 100ms in centerAvatar)

    return () => clearTimeout(initTimer);
  }, []); // Empty dependency array = run once on mount

  // In EditorPage.tsx
  const handlePositionChange = (
    part: Part,
    position: { top?: number; left?: number },
    skipHistory = false // Add this parameter
  ) => {
    setPositions((prevPositions) => {
      const newPositions = {
        ...prevPositions,
        [part]: { ...prevPositions[part], ...position },
      };

      // Save to history after state update, unless skipped
      if (!skipHistory) {
        saveToHistory({
          positions: newPositions,
          size,
          height,
          rotation,
          images,
          bgColor,
          bgImage,
        });
      }

      return newPositions;
    });
  };

  // Empty dependency array = run once on mount
  const handleDownload = async (format: string) => {
    // Check if background is present
    const hasBg =
      (bgImage && bgImage !== "") || (includeBg && bgColor && bgColor !== " ");

    if (hasBg) {
      // Use screenshot method for background images/colors
      await takeScreenshotDownload(format);
    } else {
      // Use original method for transparent backgrounds
      await handleOriginalDownload(format);
    }
  };

  const handleOriginalDownload = async (format: string) => {
    const headImage =
      images.head && !isDefaultImage(images.head) ? images.head : DefHead.src;
    const bodyImage =
      images.body && !isDefaultImage(images.body) ? images.body : DefBody.src;
    const legsImage =
      images.legs && !isDefaultImage(images.legs) ? images.legs : DefLegs.src;

    const parts = [
      {
        image: headImage,
        position: positions.head,
        size: size.head,
        height: height.head,
        rotation: rotation.head,
      },
      {
        image: bodyImage,
        position: positions.body,
        size: size.body,
        height: height.body,
        rotation: rotation.body,
      },
      {
        image: legsImage,
        position: positions.legs,
        size: size.legs,
        height: height.legs,
        rotation: rotation.legs,
      },
    ];

    // Calculate the bounding box of the avatar parts
    const minX = Math.min(...parts.map((part) => part.position.left));
    const minY = Math.min(...parts.map((part) => part.position.top));
    const maxX = Math.max(
      ...parts.map((part) => part.position.left + part.size)
    );
    const maxY = Math.max(
      ...parts.map((part) => part.position.top + part.height || part.size)
    );

    // Use smaller padding for transparent background
    const padding = 50;
    const canvasWidth = maxX - minX + padding * 2;
    const canvasHeight = maxY - minY + padding * 2;

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

      // Load all images
      const [legsImg, bodyImg, headImg] = await Promise.all([
        loadImage(legsImage),
        loadImage(bodyImage),
        loadImage(headImage),
      ]);

      // Function to draw rotated images
      const drawRotatedImage = (
        ctx: CanvasRenderingContext2D,
        image: HTMLImageElement,
        x: number,
        y: number,
        width: number,
        height: number,
        degrees: number
      ) => {
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);
        ctx.rotate((degrees * Math.PI) / 180);
        ctx.drawImage(image, -width / 2, -height / 2, width, height);
        ctx.restore();
      };

      // Draw parts with rotation
      // Draw legs
      drawRotatedImage(
        ctx,
        legsImg,
        positions.legs.left - minX + padding,
        positions.legs.top - minY + padding,
        size.legs,
        height.legs,
        rotation.legs
      );

      // Draw body
      drawRotatedImage(
        ctx,
        bodyImg,
        positions.body.left - minX + padding,
        positions.body.top - minY + padding,
        size.body,
        height.body,
        rotation.body
      );

      // Draw head
      drawRotatedImage(
        ctx,
        headImg,
        positions.head.left - minX + padding,
        positions.head.top - minY + padding,
        size.head,
        height.head,
        rotation.head
      );

      // Download the image
      if (format === "png") {
        const link = document.createElement("a");
        link.download = "avatar.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else if (format === "svg") {
        const pngDataUrl = canvas.toDataURL("image/png");
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

  const takeScreenshotDownload = async (format: string) => {
    if (!avatarPreviewRef.current) {
      console.error("Avatar preview ref not found");
      return handleOriginalDownload(format); // Fallback
    }

    try {
      // Find the canvas element
      const canvasElement =
        avatarPreviewRef.current.querySelector(".avatarCanvas");

      if (!canvasElement) {
        console.error("Canvas element not found");
        return handleOriginalDownload(format); // Fallback
      }

      // Take the screenshot
      const canvas = await html2canvas(canvasElement as HTMLElement, {
        scale: 1, // Better quality
        useCORS: true,
        allowTaint: true,
        logging: false, // Disable logging for production
      });

      // Download the image
      if (format === "png") {
        const link = document.createElement("a");
        link.download = "avatar.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else if (format === "svg") {
        // Convert PNG to SVG
        const pngDataUrl = canvas.toDataURL("image/png");
        const svgString = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
            <image href="${pngDataUrl}" width="${canvas.width}" height="${canvas.height}" />
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
    } catch (error) {
      console.error("Error taking screenshot:", error);
      // Fall back to original method if screenshot fails
      await handleOriginalDownload(format);
    }
  };

  const handleIncludeBgChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIncludeBg(event.target.checked);
  };

  const handleSizeChange = (part: string, newSize: number) => {
    setSizes((prevSizes) => {
      const newSizes = {
        ...prevSizes,
        [part]: newSize,
      };

      saveToHistory({
        positions,
        size: newSizes,
        height,
        rotation,
        images,
        bgColor,
        bgImage,
      });

      return newSizes;
    });
  };

  const handleHeightChange = (part: string, newHeight: number) => {
    setHeight((prevHeight) => {
      const newHeights = {
        ...prevHeight,
        [part]: newHeight,
      };

      saveToHistory({
        positions,
        size,
        height: newHeights,
        rotation,
        images,
        bgColor,
        bgImage,
      });

      return newHeights;
    });
  };

  const handleSelectPart = (part: string) => {
    setSelectedPart(part);
  };

  const handleRotationChange = (part: string, newRotation: number) => {
    setRotation((prevRotation) => {
      const newRotations = {
        ...prevRotation,
        [part]: newRotation,
      };

      saveToHistory({
        positions,
        size,
        height,
        rotation: newRotations,
        images,
        bgColor,
        bgImage,
      });

      return newRotations;
    });
  };

  const handleBgColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setBgColor(newColor);

    saveToHistory({
      positions,
      size,
      height,
      rotation,
      images,
      bgColor: newColor,
      bgImage,
    });
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
        head7.src,
      ];

      // Array of all available body images
      const bodyOptions = [
        body1.src,
        body2.src,
        body3.src,
        body4.src,
        body5.src,
        body6.src,
        body7.src,
      ];

      // Array of all available legs images
      const legsOptions = [legs1.src, legs2.src, legs3.src, legs4.src];

      // Random color generator
      const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

      // Set random images
      setImages({
        head: headOptions[Math.floor(Math.random() * headOptions.length)],
        body: bodyOptions[Math.floor(Math.random() * bodyOptions.length)],
        legs: legsOptions[Math.floor(Math.random() * legsOptions.length)],
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
        onUndo={handleUndo}
        canUndo={currentHistoryIndex > 0}
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
          bgImage={(bgImage as string) || ""}
          onSelectedPreset={handleSelectedPreset}
          OriginalCanvasDimensions={
            avatarPreviewRef.current
              ? {
                  width: avatarPreviewRef.current.getBoundingClientRect().width,
                  height:
                    avatarPreviewRef.current.getBoundingClientRect().height,
                }
              : { width: 0, height: 0 }
          }
        />
        <div ref={avatarPreviewRef} style={{ width: "100%", height: "100%" }}>
          <AvatarPreview
            images={images}
            positions={positions}
            size={size}
            onSelectPart={handleSelectPart}
            rotation={rotation}
            bgColor={bgColor}
            height={height}
            bgImage={(bgImage as string) || ""}
            onPositionChange={handlePositionChange}
          />
        </div>
      </div>
    </div>
  );
}
