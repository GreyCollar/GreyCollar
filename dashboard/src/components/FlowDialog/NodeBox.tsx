import AnimatedNode from "./AnimatedNode";
import { Iconify } from "@canmingir/link/platform/components";
import LoadingNode from "./LoadingNode";
import React from "react";

import { Card, Tooltip, Typography } from "@mui/material";

const NodeBox = ({ nodeData, visible, delay, isLoading }) => {
  const getIconForAction = (action) => {
    const iconMap = {
      SCRAPE_WEBSITE: "mdi:web",
      LLM: "mdi:robot",
      DEFAULT: "mdi:cube-outline",
    };
    return iconMap[action] || iconMap.DEFAULT;
  };

  if (isLoading) {
    return <LoadingNode visible={visible} delay={delay} />;
  }

  return (
    <Tooltip title={nodeData.comment} placement="right">
      <AnimatedNode visible={visible} delay={delay}>
        <Card
          sx={{
            p: 2,
            width: "180px",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            borderRadius: 1,
            bgcolor: "background.paper",
            transition: "background-color 0.3s ease",
            "&:hover": {
              bgcolor: "grey.600",
              cursor: "pointer",
            },
          }}
        >
          <Iconify
            icon={getIconForAction(nodeData.action)}
            width={24}
            height={24}
          />
          <Typography
            variant="caption"
            sx={{
              textAlign: "center",
              fontSize: "0.5rem",
              color: "text.secondary",
            }}
          >
            {nodeData.action}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              textAlign: "center",
              fontSize: "0.5rem",
              color: "text.secondary",
            }}
          >
            {nodeData.status}
          </Typography>
        </Card>
      </AnimatedNode>
    </Tooltip>
  );
};

export default NodeBox;
