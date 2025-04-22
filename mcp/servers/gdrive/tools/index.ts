import { schema as gdriveSearchSchema, search } from "./gdrive_search.js";
import {
  schema as gdriveReadFileSchema,
  readFile,
} from "./gdrive_read_file.js";
import {
  schema as gsheetsUpdateCellSchema,
  updateCell,
} from "./gsheets_update_cell.js";
import { schema as gsheetsReadSchema, readSheet } from "./gsheets_read.js";
import {
  Tool,
  GDriveSearchInput,
  GDriveReadFileInput,
  GSheetsUpdateCellInput,
  GSheetsReadInput,
} from "./types.js";

export const tools: [
  Tool<GDriveSearchInput>,
  Tool<GDriveReadFileInput>,
  Tool<GSheetsUpdateCellInput>,
  Tool<GSheetsReadInput>,
] = [
  {
    ...gdriveSearchSchema,
    handler: search,
  },
  {
    ...gdriveReadFileSchema,
    handler: readFile,
  },
  {
    ...gsheetsUpdateCellSchema,
    handler: updateCell,
  },
  {
    ...gsheetsReadSchema,
    handler: readSheet,
  },
];
