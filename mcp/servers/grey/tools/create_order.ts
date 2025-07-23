import { Tool } from "../../gdrive/tools/types";

export const createOrderTool: Tool<any> = {
  name: "GREY:create_order",
  description: "Create an order",
  inputSchema: {
    type: "object",
    properties: {
      productId: {
        type: "string",
        description: "The ID of the product to create an order for.",
      },
      quantity: {
        type: "number",
        description: "The quantity of the product to create an order for.",
      },
    },
    required: ["productId", "quantity"],
  },
  handler: async (args: any) => ({
    content: [
      {
        type: "text",
        text: `Order created for product ${args.productId} with quantity ${args.quantity}.`,
      },
    ],
    isError: false,
  }),
}; 