import { Iconify } from "@nucleoidai/platform/minimal/components";

import { Handle, Position } from "@xyflow/react";
import React, { useEffect, useState } from "react";

const CustomNode = ({ data }) => {
  console.log(data);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        color: "#333",
        borderRadius: "8px",
        padding: "10px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Iconify
        icon={data.icon}
        width={24}
        height={24}
        sx={{
          marginBottom: "5px",
          transition: "transform 0.5s ease-in-out",
          transform: animated ? "rotate(0deg)" : "rotate(-90deg)",
        }}
      />
      <div
        style={{
          fontWeight: "bold",
          fontSize: "14px",
          marginBottom: "5px",
          transition: "opacity 0.5s ease-in-out",
          opacity: animated ? 1 : 0,
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

export default CustomNode;
