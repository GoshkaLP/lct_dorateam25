import React from "react";

const Reports = () => {
  return (
    <div style={{ padding: "85px 40px" }}>
      <h2>Отчёты</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Столбец 1
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Столбец 2
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Столбец 3
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Столбец 4
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Столбец 5
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, rowIdx) => (
            <tr key={rowIdx}>
              {[...Array(5)].map((_, colIdx) => (
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    textAlign: "center",
                  }}
                  key={colIdx}
                >
                  {`Строка ${rowIdx + 1}, Столбец ${colIdx + 1}`}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
