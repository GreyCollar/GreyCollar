import { Iconify } from "@nucleoidai/platform/minimal/components";

import { Handle, Position } from "@xyflow/react";
import React, { useEffect, useState } from "react";
import { alpha, useTheme } from "@mui/material/styles";

const CustomNode = ({ data }) => {
  console.log(data);
  const theme = useTheme();
  const [animated, setAnimated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
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
        boxShadow: isHovered
          ? "0 4px 20px rgba(0, 0, 0, 0.3)"
          : "0 2px 10px rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        minWidth: "120px",
      }}
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
        }}
      >
        <Iconify
          icon={data.icon}
          width={28}
          height={28}
          sx={{
            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: animated
              ? isHovered
                ? "rotate(360deg) scale(1.1)"
                : "rotate(0deg) scale(1)"
              : "rotate(-90deg) scale(0.8)",
            filter: "none",
            color: "#ffffff",
          }}
        />
      </div>

      <div
        style={{
          fontWeight: "600",
          fontSize: "13px",
          letterSpacing: "0.5px",
          textAlign: "center",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: animated ? 1 : 0,
          transform: animated ? "translateY(0)" : "translateY(10px)",
          textShadow: "none",
          lineHeight: "1.4",
        }}
      >
        {data.label}
      </div>

      {/* Modern handle styling */}
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

export default CustomNode;
