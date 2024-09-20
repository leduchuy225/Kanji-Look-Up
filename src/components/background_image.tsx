import React, { useState } from "react";

export const BackgroundImage = () => {
  const [imageSrcs, setImageSrcs] = useState(["background.png"]);

  return imageSrcs.map((src) => {
    const sharedProps = { src: src, width: 350, style: { marginTop: 8 } };
    if (src == "background.png") {
      return (
        <img
          {...sharedProps}
          className="pointer"
          title="Click to show alphabet"
          onClick={() => {
            setImageSrcs(["hiragana.png", "katakana.png"]);
          }}
        />
      );
    }
    return <img {...sharedProps} />;
  });
};
