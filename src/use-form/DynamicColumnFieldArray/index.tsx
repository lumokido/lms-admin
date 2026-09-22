import { useFieldArray, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import FormGeneratorComp from "../FormGeneratorComp";
import { FormFieldConfig } from "../ControllerMap";

interface DynamicMatrixFieldArrayProps {
  control: any;
  name: string;
  disabled?: boolean;
  label?: string;

  config: {
    rowField: FormFieldConfig;
    cellField: FormFieldConfig;

    defaultRow?: {
      field: string;
      values: string[];
    };

    defaultColumn?: {};

    columnTitle?: (index: number) => string;

    minRows?: number;
    minColumns?: number;
  };
}

export default function DynamicMatrixFieldArray({
  control,
  name,
  config,
  disabled,
  label,
}: DynamicMatrixFieldArrayProps) {
  const {
    fields: rows,
    append: appendRow,
    remove: removeRow,
    replace,
  } = useFieldArray({
    control,
    name,
  });

  const matrix = useWatch({
    control,
    name,
  });

  const columnCount = matrix?.length > 0 ? matrix[0].values.length : 0;

  const addColumn = () => {
    const updated = matrix.map((row: any) => ({
      ...row,
      values: [...row.values, ""],
    }));

    replace(updated);
  };

  const removeColumn = (columnIndex: number) => {
    if (config.minColumns && columnCount <= config.minColumns) return;

    const updated = matrix.map((row: any) => ({
      ...row,
      values: row.values.filter(
        (_: any, index: number) => index !== columnIndex,
      ),
    }));

    replace(updated);
  };

  const addRow = () => {
    appendRow({
      field: "",
      values: Array(columnCount).fill(""),
    });
  };

  const deleteRow = (rowIndex: number) => {
    if (config.minRows && rows.length <= config.minRows) return;

    removeRow(rowIndex);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <h3 className="font-semibold">{label}</h3>

        <div className="flex gap-2">
          <Button type="button" onClick={addRow} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Row
          </Button>

          <Button type="button" onClick={addColumn} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Share Class
          </Button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="border-collapse min-w-max w-full">
          <thead>
            <tr>
              <th className="border px-4 py-3 bg-slate-800 text-white w-16">
                Action
              </th>

              <th className="border px-4 py-3 bg-slate-800 text-white min-w-60">
                Field
              </th>

              {Array.from({
                length: columnCount,
              }).map((_, columnIndex) => (
                <th
                  key={columnIndex}
                  className="border px-4 py-3 bg-slate-800 text-white min-w-64"
                >
                  <div className="flex justify-between items-center">
                    <span>
                      {config.columnTitle
                        ? config.columnTitle(columnIndex)
                        : `Share Class ${columnIndex + 1}`}
                    </span>

                    <Button
                      size="icon"
                      variant="ghost"
                      type="button"
                      onClick={() => removeColumn(columnIndex)}
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id}>
                <td className="border px-3 py-3 text-center">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={disabled}
                    onClick={() => deleteRow(rowIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </td>

                <td className="border px-3 py-3 min-w-60">
                  <FormGeneratorComp
                    props={[
                      {
                        ...config.rowField,
                        control,
                        label: "",
                        name: `${name}.${rowIndex}.field`,
                        disabled,
                      },
                    ]}
                  />
                </td>

                {Array.from({ length: columnCount }).map((_, columnIndex) => (
                  <td key={columnIndex} className="border px-3 py-3 min-w-64">
                    <FormGeneratorComp
                      props={[
                        {
                          ...config.cellField,
                          control,
                          label: "",
                          rowIndex,
                          parentName: name,
                          name: `${name}.${rowIndex}.values.${columnIndex}`,
                          disabled,
                        },
                      ]}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
