import mcp from "./src/lib/mcp";

mcp.connect().then((mcp) => {
  console.log(mcp);
});

