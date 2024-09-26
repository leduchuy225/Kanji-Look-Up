import React, { useState } from "react";
import { CanvasWidth } from "../config/config";

export const BackgroundImage = () => {
  const [imageSrcs, setImageSrcs] = useState(["background.png"]);

  const openImageInNewTab = (imageUrl: string) => {
    window.open(imageUrl, "_blank"); // '_blank' opens the image in a new tab
  };

  return imageSrcs.map((src) => {
    const sharedProps = {
      src: src,
      width: CanvasWidth,
      className: "pointer",
      style: { marginTop: 8 },
    };
    if (src == "background.png") {
      return (
        <img
          {...sharedProps}
          title="Click to show alphabet"
          onClick={() => {
            setImageSrcs(["hiragana.png", "katakana.png"]);
          }}
        />
      );
    }
    return <img {...sharedProps} onClick={() => openImageInNewTab(src)} />;
  });
};
