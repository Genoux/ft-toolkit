import type { ReactNode } from "react";
import { AnnotationCaption, getAnnotatedState, StateMarker } from "./state-annotation";

/** Rows by columns of examples; a row or column named after an interaction state marks its examples. */
export function VariantGrid<Row extends string, Column extends string>({
  rows,
  columns,
  renderCell,
}: {
  rows: readonly Row[];
  columns: readonly Column[];
  renderCell: (row: Row, column: Column) => ReactNode;
}) {
  return (
    <div
      className="grid items-center gap-x-8 gap-y-5"
      style={{ gridTemplateColumns: `6rem repeat(${columns.length}, auto)` }}
    >
      <span />
      {columns.map((column) => (
        <AnnotationCaption key={column} className="border-b border-dashed border-border pb-1.5">
          {column}
        </AnnotationCaption>
      ))}
      {rows.map((row) => (
        <div key={row} className="contents">
          <AnnotationCaption>{row}</AnnotationCaption>
          {columns.map((column) => (
            <StateMarker key={column} state={getAnnotatedState(row) ?? getAnnotatedState(column)}>
              {renderCell(row, column)}
            </StateMarker>
          ))}
        </div>
      ))}
    </div>
  );
}
