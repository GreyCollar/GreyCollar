import {
  GDriveReadFileInput,
  GDriveSearchInput,
  GSheetsReadInput,
  GSheetsUpdateCellInput,
  Tool,
} from "./types";
import {
  schema as gdriveReadFileSchema,
  readFile,
} from "./gdrive_read_file";
import { schema as gdriveSearchSchema, search } from "./gdrive_search";
import { schema as gsheetsReadSchema, readSheet } from "./gsheets_read";
import {
  schema as gsheetsUpdateCellSchema,
  updateCell,
} from "./gsheets_update_cell";

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
