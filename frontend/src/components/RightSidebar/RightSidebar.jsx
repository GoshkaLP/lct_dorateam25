import React, { useState } from "react";
import style from "./style.module.css";

function todayWithWeek() {
  const today = new Date();

  // номер недели по ISO-8601
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDays = (today - startOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);

  const dateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
  return { date: dateStr, week: weekNumber };
}

const RightSidebar = () => {
  return (
    <aside className={style.wrapper}>
      <div className={style.header}>
        <p>Список прогнозов до {todayWithWeek().date}</p>
      </div>
      <hr />
      <div className={style.danger}>
        <p>Зона риска</p>
        <ol>
          <li>
            <div className={style["aprove-wrapper"]}>
              <button>&#9989;</button>
              ИТП-Западный
              <button>&#10060;</button>
            </div>
          </li>
        </ol>
      </div>
      <div className={style.warning}>
        <p>Зона предупреждения</p>
        <ol>
          <li>ИТП-Северо-Западный</li>
          <li>ИТП-Восточный</li>
        </ol>
      </div>
      <div className={style["under-control"]}>
        <p>Скорректированные прогнозы</p>
        <ol>
          <li>ИТП-Южный</li>
          <li>ИТП-Районный</li>
        </ol>
      </div>
    </aside>
  );
};

export default RightSidebar;
