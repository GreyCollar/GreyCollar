import { Label } from "@canmingir/link/minimal/components";

import {
  Card,
  IconButton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import {
  Iconify,
  Scrollbar,
  TableHeadCustom,
  TableSelectedAction,
} from "@canmingir/link/minimal/components";
import React, { useState } from "react";

function KnowledgeTable({
  table,
  selectedType,
  knowledges,
  handleDeleteClick,
}) {
  const getTableHead = (selectedType) => {
    switch (selectedType) {
      case "ALL":
        return [
          { id: "type", label: "Type" },
          { id: "content", label: "Content" },
          { id: "status", label: "Status" },
          { id: "date", label: "Date" },
          { id: "", label: "" },
        ];
      case "URL":
        return [
          { id: "url", label: "URL" },
          { id: "status", label: "Status" },
          { id: "date", label: "Date" },
          { id: "", label: "" },
        ];
      case "TEXT":
        return [
          { id: "text", label: "Text" },
          { id: "status", label: "Status" },
          { id: "date", label: "Date" },
          { id: "", label: "" },
        ];
      case "QA":
        return [
          { id: "question", label: "Question" },
          { id: "answer", label: "Answer" },
          { id: "status", label: "Status" },
          { id: "date", label: "Date" },
          { id: "", label: "" },
        ];
      default:
        return [{ id: "status", label: "Status" }];
    }
  };

  const statusLabel = (row, status) => {
    return row.teamId !== null ? (
      <>
        {status}
        <Label
          sx={{
            backgroundColor: "rgba(97, 97, 97, 0.2)",
            color: "white",
            ml: 0.5,
          }}
        >
          TEAM
        </Label>
      </>
    ) : (
      <>{status}</>
    );
  };

  const getStatus = (row) => {
    switch (row.status) {
      case "IN_PROGRESS":
        return statusLabel(row, "In Progress");
      case "COMPLETED":
        return statusLabel(row, "Completed");
      default:
        return statusLabel(row, row.status);
    }
  };

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card>
      <TableContainer sx={{ position: "relative", overflow: "unset" }}>
        <TableSelectedAction dense={table.dense} />
        <Scrollbar>
          <Table size={table.dense ? "small" : "medium"}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={getTableHead(selectedType)}
            />
            <TableBody>
              {knowledges
                .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                .map((row, index) => (
                  <TableRow hover key={index} tabIndex={-1}>
                    {selectedType === "ALL" && (
                      <>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>
                          {row.type === "URL" && row.url}
                          {row.type === "TEXT" && row.text}
                          {row.type === "QA" &&
                            `Q: ${row.question} A: ${row.answer}`}
                          {row.type === "TASK" && row.Task.description}
                        </TableCell>
                        <TableCell>{getStatus(row)}</TableCell>
                        <TableCell>
                          {new Date(row.createdAt).toLocaleDateString()}
                        </TableCell>
                      </>
                    )}
                    {selectedType === "URL" && (
                      <>
                        <TableCell>{row.url}</TableCell>
                        <TableCell>{getStatus(row)}</TableCell>
                        <TableCell>
                          {new Date(row.createdAt).toLocaleDateString()}
                        </TableCell>
                      </>
                    )}
                    {selectedType === "TEXT" && (
                      <>
                        <TableCell>{row.text}</TableCell>
                        <TableCell>{getStatus(row)}</TableCell>
                        <TableCell>
                          {new Date(row.createdAt).toLocaleDateString()}
                        </TableCell>
                      </>
                    )}
                    {selectedType === "QA" && (
                      <>
                        <TableCell>{row.question}</TableCell>
                        <TableCell>{row.answer}</TableCell>
                        <TableCell>{getStatus(row)}</TableCell>
                        <TableCell>
                          {new Date(row.createdAt).toLocaleDateString()}
                        </TableCell>
                      </>
                    )}
                    <TableCell sx={{ width: "5%" }}>
                      <IconButton
                        data-cy="delete-knowledge-button"
                        onClick={() => handleDeleteClick(row)}
                        sx={{
                          "&:hover": {
                            "& svg": {
                              color: "error.main",
                            },
                          },
                        }}
                      >
                        <Iconify icon="mdi:trash" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {knowledges.length > rowsPerPage && (
            <Pagination
              count={Math.ceil(knowledges.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
                padding: "10px",
                borderRadius: "5px",
              }}
            />
          )}
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

export default KnowledgeTable;
