function convertToNodesAndEdges(data) {
  const nodes = data.map((item) => {
    return {
      id: item.id,
      label: item.properties?.label,
      icon: item.properties?.icon,
    };
  });

  const edges = [];
  let edgeIdCounter = 0;

  data.forEach((item) => {
    if (item.next) {
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
