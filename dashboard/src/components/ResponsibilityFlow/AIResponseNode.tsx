import { Handle, Position } from "@xyflow/react";
import React, { CSSProperties, useEffect, useState } from "react";

const AIResponseNode = ({ data }) => {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStage(1), 200),
      setTimeout(() => setAnimationStage(2), 800),
      setTimeout(() => setAnimationStage(3), 1300),
      setTimeout(() => setAnimationStage(4), 1800),
      setTimeout(() => setAnimationStage(5), 2300),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  const getNodeStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#f0f0f0",
      color: "#333",
      borderRadius: "8px",
      padding: "10px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      position: "relative",
      overflow: "hidden",
    };

    switch (animationStage) {
      case 0:
        return {
          ...baseStyle,
          opacity: 0,
          transform: "scale(0.1) translateY(20px)",
          boxShadow: "none",
        };
      case 1:
        return {
          ...baseStyle,
          opacity: 0.7,
          transform: "scale(0.5) translateY(10px)",
          boxShadow: "0 0 15px rgba(66, 153, 225, 0.5)",
        };
      case 2:
        return {
          ...baseStyle,
          opacity: 0.9,
          transform: "scale(1.1)",
          boxShadow: "0 0 25px rgba(66, 153, 225, 0.8)",
        };
      case 3:
      case 4:
        return {
          ...baseStyle,
          opacity: 1,
          transform: "scale(1)",
          boxShadow: "0 0 15px rgba(66, 153, 225, 0.6)",
        };
      case 5:
      default:
        return {
          ...baseStyle,
          opacity: 1,
          transform: "scale(1)",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
        };
    }
  };

  const getIconClass = () => {
    if (animationStage === 0) return "hidden-icon";
    if (animationStage === 1) return "spin-icon";
    if (animationStage === 2) return "bounce-icon";
    return "settled-icon";
  };

  return (
    <div style={{ ...getNodeStyle() }}>
      {animationStage >= 2 && animationStage < 5 && (
        <div className="node-ripple-effect" />
      )}

      <img
        src={data.icon}
        alt={data.label}
        width={24}
        height={24}
        className={getIconClass()}
        style={{
          marginBottom: "5px",
          position: "relative",
          zIndex: 2,
        }}
      />
      <div
        style={{
          fontWeight: "bold",
          fontSize: "14px",
          marginBottom: "5px",
          opacity: animationStage >= 4 ? 1 : 0,
          transform: animationStage >= 4 ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.4s ease-in-out",
          position: "relative",
          zIndex: 2,
        }}
      >
        {data.label}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          opacity: 0,
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{
          opacity: 0,
        }}
      />
    </div>
  );
};

export default AIResponseNode;
