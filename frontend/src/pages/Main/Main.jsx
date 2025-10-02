import React, { useEffect, useState } from "react";
import MainSection from "../../components/Main/Main";
import Filters from "../../components/Filters/Filters";
import { Analytics } from "../../components";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import FullscreenOutlined from "@mui/icons-material/FullscreenOutlined";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../const/const";
import style from "./style.module.css";
import { useData } from "../../components/Filters/components/DataContext/DataContext";

const Main = () => {
  const navigate = useNavigate();
  const { regions } = useData();
  const handleDownloadAnalytics = async () => {
    try {
      // Создаем текстовое содержимое для файла
      const content =
        "Аналитика по ИТП\n" +
        "Дата: " +
        new Date().toLocaleDateString() +
        "\n" +
        "Время: " +
        new Date().toLocaleTimeString() +
        "\n\n" +
        "Общая статистика:\n" +
        "- Количество объектов: 267\n" +
        "- Среднее отклонение: 7%\n" +
        "- Загруженность: 75%";

      // Создаем Blob с текстовым содержимым
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });

      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `analytics_${new Date().toISOString().split("T")[0]}.txt`
      );

      // Добавляем ссылку в DOM, кликаем по ней и удаляем
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Освобождаем URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка при скачивании файла:", error);
    }
  };

  const [coordinatesPoint, setCoordinatesPoint] = useState({
    lng: 37.4155,
    lat: 55.7022,
  });
  const [selectedCrossingFilters, setSelectedCrossingFilters] = useState(null);
  const [filterNames, setFilterNames] = useState({});
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  useEffect(() => {
    console.log("🚀 ~ Main ~ regions:", regions);
  }, [regions]);
  return (
    <main style={{ position: "relative" }}>
      <MainSection
        setCoordinatesPoint={setCoordinatesPoint}
        selectedCrossingFilters={selectedCrossingFilters}
        filterNames={filterNames}
      />
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        className={style.right_sidebar}
      >
        <Accordion
          style={{
            borderRadius: "20px",
            margin: 0,
            width: "100%",
            "&::before": { display: "none" },
          }}
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          className={style.accordion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <div style={{ textDecoration: "semibold", fontWeight: "700" }}>
                Фильтры
              </div>
              <Chip
                label={`${regions?.data?.length} объектов`}
                color="primary"
                style={{ backgroundColor: "#0D4CD3" }}
              />
            </Stack>
          </AccordionSummary>
          <AccordionDetails style={{ overflowY: "auto", maxHeight: "70vh" }}>
            <Filters
              coordinatesPoint={coordinatesPoint}
              setSelectedCrossingFilters={setSelectedCrossingFilters}
              setFilterNames={setFilterNames}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion
          style={{
            borderRadius: "20px",
            margin: 0,
            width: "100%",
            "&::before": { display: "none" },
          }}
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
          className={style.accordion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div style={{ textDecoration: "semibold", fontWeight: "700" }}>
                Аналитика
              </div>
              <div>
                <IconButton
                  aria-label="delete"
                  onClick={() => navigate(ROUTES.REPORTS)}
                >
                  <FullscreenOutlined />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDownloadAnalytics()}
                >
                  <FileDownloadOutlined />
                </IconButton>
              </div>
            </Stack>
          </AccordionSummary>
          <AccordionDetails style={{ overflowY: "auto", maxHeight: "70vh" }}>
            <Analytics />
          </AccordionDetails>
        </Accordion>
      </Box>
    </main>
  );
};

export default Main;
