import React from 'react';

const Table = ({ columns = [], data = [], keyExtractor, emptyMessage = 'No records found.' }) => {
  return (
    <div className="w-full overflow-x-auto border border-[#A8B9C8] rounded-md bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#202020] text-white text-xs uppercase tracking-wider">
            {columns.map((col, index) => (
              <th
                key={index}
                className={`py-3 px-4 font-semibold border-b-2 border-[#48779E] ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#A8B9C8]/30 text-sm text-[#202020]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-[#A8B9C8]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={keyExtractor ? keyExtractor(item, rowIndex) : rowIndex}
                className="hover:bg-[#EAF1F7]/50 transition-colors"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`py-3.5 px-4 ${col.className || ''}`}>
                    {col.render ? col.render(item, rowIndex) : item[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
