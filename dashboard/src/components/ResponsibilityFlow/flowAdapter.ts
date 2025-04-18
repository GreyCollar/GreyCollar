function convertToNodesAndEdges(data) {
  const nodes = data.map((item) => {
    return {
      id: item.id,
      label: item.properties?.label,
      icon: item.properties?.icon,
    };
  });

  const edges = [];

  data.forEach((item, index) => {
    if (item.dependencyId) {
      edges.push({
        id: index,
        source: item.dependencyId,
        target: item.id,
      });
    }
  });

  return {
    nodes,
    edges,
  };
}

export { convertToNodesAndEdges };
