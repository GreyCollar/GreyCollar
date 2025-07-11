import { Handle, Position } from "@xyflow/react";
import React, { CSSProperties, useEffect, useState } from "react";
import { alpha, useTheme } from "@mui/material/styles";

const AIResponseNode = ({ data }) => {
  const theme = useTheme();
  const [animationStage, setAnimationStage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
      background: isHovered
        ? `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.3
          )}, ${alpha(theme.palette.secondary.light, 0.2)})`
        : `linear-gradient(135deg, ${alpha(
            theme.palette.secondary.light,
            0.2
          )}, ${alpha(theme.palette.primary.main, 0.3)})`,
      color: "#ffffff",
      borderRadius: "16px",
      padding: "16px 20px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      minWidth: "120px",
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
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        };
      case 2:
        return {
          ...baseStyle,
          opacity: 0.9,
          transform: "scale(1.1)",
          boxShadow: "0 3px 15px rgba(0, 0, 0, 0.25)",
        };
      case 3:
      case 4:
        return {
          ...baseStyle,
          opacity: 1,
          transform: "scale(1)",
          boxShadow: isHovered
            ? "0 4px 20px rgba(0, 0, 0, 0.3)"
            : "0 2px 10px rgba(0, 0, 0, 0.2)",
        };
      case 5:
      default:
        return {
          ...baseStyle,
          opacity: 1,
          transform: "scale(1)",
          boxShadow: isHovered
            ? "0 4px 20px rgba(0, 0, 0, 0.3)"
            : "0 2px 10px rgba(0, 0, 0, 0.2)",
        };
    }
  };

  const getIconTransform = () => {
    if (animationStage === 0) return "rotate(-90deg) scale(0.8)";
    if (animationStage === 1) return "rotate(180deg) scale(0.9)";
    if (animationStage === 2) return "rotate(360deg) scale(1.1)";
    if (animationStage >= 3) {
      return "rotate(0deg) scale(1)";
    }
    return "rotate(0deg) scale(1)";
  };

  return (
    <div
      style={{ ...getNodeStyle() }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon container with modern styling */}
      <div
        style={{
          backgroundColor: isHovered
            ? "rgba(255, 255, 255, 0.15)"
            : "rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          padding: "8px",
          marginBottom: "12px",
          transition: "all 0.4s ease",
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <img
          src={data.icon}
          alt={data.label}
          width={28}
          height={28}
          style={{
            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: getIconTransform(),
            filter: "none",
            opacity: animationStage >= 1 ? 1 : 0,
          }}
        />
      </div>

      <div
        style={{
          fontWeight: "600",
          fontSize: "13px",
          letterSpacing: "0.5px",
          textAlign: "center",
          opacity: animationStage >= 4 ? 1 : 0,
          transform: animationStage >= 4 ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          textShadow: "none",
          lineHeight: "1.4",
          position: "relative",
          zIndex: 2,
        }}
      >
        {data.label}
      </div>

      {/* Modern handle styling */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          width: "12px",
          height: "12px",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          border: "2px solid rgba(255, 255, 255, 0.8)",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
          opacity: 0.8,
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{
          width: "12px",
          height: "12px",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          border: "2px solid rgba(255, 255, 255, 0.8)",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
          opacity: 0.8,
        }}
      />
    </div>
  );
};

export default AIResponseNode;
