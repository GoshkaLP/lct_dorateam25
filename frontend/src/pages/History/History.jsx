import React from "react";

const predictions = [
  "Отклонении свыше 10%",
  "Аварийная ситуация",
  "Потенциальная авария",
  "Неблагоприятные погодные условия",
];

const ITP = ["Центральная", "Северная", "Восточная", "Южная", "Западная"];

const dispatcherActions = [
  "Отправлен на место",
  "Принято в работу",
  "Завершено",
  "Отменено",
];

const History = () => {
  // Функция для случайного выбора значения из predictions
  const getRandomPrediction = (arr) => {
    const idx = Math.floor(Math.random() * arr.length);
    return predictions[idx];
  };

  return (
    <div style={{ padding: "85px 40px" }}>
      <h2>История</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Время</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Прогноз
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Объект</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Отработано
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, rowIdx) => (
            <tr key={rowIdx}>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                {new Date().toLocaleString()}
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                {getRandomPrediction(predictions)}
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                {getRandomPrediction(ITP)}
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                {getRandomPrediction(dispatcherActions)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
