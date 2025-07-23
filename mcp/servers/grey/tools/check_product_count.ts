import { Tool } from "../../gdrive/tools/types";
import data from "../mock/inventory.json";

export const checkProductCountTool: Tool<any> = {
  name: "GREY:check_product_count",
  description: "Check product count",
  inputSchema: {
    type: "object",
    properties: {
      productId: {
        type: "string",
        description: "The ID of the product to check the count of.",
      },
    },
    required: ["productId"],
  },
  handler: async (args: any) => ({
    content: [
      {
        type: "text",
        text: JSON.stringify({ productId: args.productId, count: data.find(item => item.id === args.productId)?.count }),
      },
    ],
    isError: false,
  }),
}; 