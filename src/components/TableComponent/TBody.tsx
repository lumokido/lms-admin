import { flexRender } from "@tanstack/react-table";
import Empty from "./Empty";
import { EMPTY_TABLE_DATA } from "@/lib/global";
import Loader from "../Loader";

interface TBodyProps {
  data: any[];
  model?: string;
  isLoading?: boolean;
}

const TBody: React.FC<TBodyProps> = ({ data, model,isLoading }) => {
  const emptyData = EMPTY_TABLE_DATA.find((item) => item.id === model);
  if (!data || data.length === 0&&!isLoading) {
    return (
      <tbody>
        <tr>
          <td colSpan={100} className="px-6 py-16">
            <Empty
              title={emptyData?.title || "No Data Available"}
              description={
                emptyData?.description || "No data found for this table."
              }
              icon={emptyData?.icon}
              actionButton={emptyData?.actionButton}
            />
          </td>
        </tr>
      </tbody>
    );
  }
  if (isLoading) {
    return (
      <tbody>
        <tr>
          <td colSpan={100}>
            {/* <Empty
              title={emptyData?.title || "No Data Available"}
              description={
                emptyData?.description || "No data found for this table."
              }
              icon={emptyData?.icon}
              actionButton={emptyData?.actionButton}
            /> */}
            <div className="flex items-center justify-center py-10">
              <Loader />
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.map((row: any) => (
        <tr
          key={row.id || row.original?._id || Math.random()}
          className="border-b last:border-b-0 hover:bg-[#FAF7F2]/60 transition-colors"
        >
          {row.getVisibleCells().map((cell: any) => (
            <td
              key={cell.id}
              className="px-6 py-4 text-sm text-gray-700"
              style={{ maxWidth: cell.column.getSize() }}
            >
              <div className="truncate">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TBody;
