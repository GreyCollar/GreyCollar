import { Tool } from "../../gdrive/tools/types";

export const reduceProductCountTool: Tool<any> = {
  name: "GREY:reduce_product_count",
  description: "Reduce the count of a product by a specified amount.",
  inputSchema: {
    type: "object",
    properties: {
      productId: {
        type: "string",
        description: "The ID of the product to reduce the count of.",
      },
      amount: {
        type: "number",
        description: "The amount to reduce from the product count.",
      },
    },
    required: ["productId", "amount"],
  },
  handler: async (args: any) => ({
    content: [
      {
        type: "text",
        text: `Product ${args.productId} count reduced by ${args.amount}.`,
      },
    ],
    isError: false,
  }),
}; 