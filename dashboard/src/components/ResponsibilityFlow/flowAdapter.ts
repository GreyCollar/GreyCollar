function convertToNodesAndEdges(data) {
  const nodes = data.map((item) => {
    return {
      id: item.id,
      label: item.properties?.label,
      icon: item.properties?.icon,
      type: item.type,
    };
  });

  const edges = [];
  let edgeIdCounter = 0;

  data.forEach((item) => {
    if (item.type === "CONDITION") {
      if (item.true) {
        const trueNodes = Array.isArray(item.true) ? item.true : [item.true];
        trueNodes.forEach((targetId) => {
          if (targetId) {
            edges.push({
              id: `edge-${edgeIdCounter++}`,
              source: item.id,
              target: targetId,
              style: {
                stroke: "#22c55e",
                strokeDasharray: "5.5",
              },
              data: { conditionResult: "true" },
            });
          }
        });
      }

      if (item.false) {
        const falseNodes = Array.isArray(item.false)
          ? item.false
          : [item.false];
        falseNodes.forEach((targetId) => {
          if (targetId) {
            edges.push({
              id: `edge-${edgeIdCounter++}`,
              source: item.id,
              target: targetId,
              style: {
                stroke: "#ef4444",
                strokeDasharray: "5.5",
              },
              data: { conditionResult: "false" },
            });
          }
        });
      }
    } else if (item.next) {
      const nextNodes = Array.isArray(item.next) ? item.next : [item.next];

      nextNodes.forEach((targetId) => {
        if (targetId) {
          edges.push({
            id: `edge-${edgeIdCounter++}`,
            source: item.id,
            target: targetId,
          });
        }
      });
    }
  });

  return {
    nodes,
    edges,
  };
}

export { convertToNodesAndEdges };
