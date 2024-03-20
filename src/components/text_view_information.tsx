import "../styles/text_view.css";
import React, { ReactNode } from "react";

export const TextViewInformation = ({
  data,
  title,
  child,
  titleStyle,
  isVisible = true,
}: {
  title: string;
  isVisible?: boolean;
  data?: string | null;
  child?: ReactNode | null;
  titleStyle?: React.CSSProperties;
}) => {
  if (!isVisible || (!data && !child)) {
    return null;
  }

  return (
    <div className="text-view-container">
      <div className="text-view-title" style={titleStyle}>
        {title}
      </div>
      {data ? <span className="text-view-content text">{data}</span> : child}
    </div>
  );
};
