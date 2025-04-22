import { google } from "googleapis";
import { GSheetsUpdateCellInput, InternalToolResponse } from "./types.js";

export const schema = {
  name: "GDRIVE:update_cell",
  description: "Update a cell value in a Google Spreadsheet",
  inputSchema: {
    type: "object",
    properties: {
      fileId: {
        type: "string",
        description: "ID of the spreadsheet",
      },
      range: {
        type: "string",
        description: "Cell range in A1 notation (e.g. 'Sheet1!A1')",
      },
      value: {
        type: "string",
        description: "New cell value",
      },
    },
    required: ["fileId", "range", "value"],
  },
} as const;

export async function updateCell(
  args: GSheetsUpdateCellInput,
): Promise<InternalToolResponse> {
  const { fileId, range, value } = args;
  const sheets = google.sheets({ version: "v4" });

  await sheets.spreadsheets.values.update({
    spreadsheetId: fileId,
    range: range,
    valueInputOption: "RAW",
    requestBody: {
      values: [[value]],
    },
  });

  return {
    content: [
      {
        type: "text",
        text: `Updated cell ${range} to value: ${value}`,
      },
    ],
    isError: false,
  };
}
