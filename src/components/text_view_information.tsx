import "../styles/text_view.css";
import React, { ReactNode } from "react";

export const TextViewInformation = ({
  data,
  title,
  child,
  tooltip,
  titleStyle,
  onClickTitle,
  isVisible = true,
}: {
  title: string;
  tooltip?: string;
  isVisible?: boolean;
  data?: string | null;
  onClickTitle?: Function;
  child?: ReactNode | null;
  titleStyle?: React.CSSProperties;
}) => {
  if (!isVisible || (!data && !child)) {
    return null;
  }

  return (
    <div className="text-view-container">
      <div
        title={tooltip}
        style={titleStyle}
        onClick={() => onClickTitle && onClickTitle()}
        className={`text-view-title ${onClickTitle ? "pointer" : ""}`}
      >
        {title}
      </div>
      {data ? <span className="text-view-content text">{data}</span> : child}
    </div>
  );
};
