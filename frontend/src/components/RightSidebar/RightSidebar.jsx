import React, { useState } from "react";
import style from "./style.module.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
const boxActionStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const boxCorrectStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

function todayWithWeek() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDays = (today - startOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);

  const dateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
  return { date: dateStr, week: weekNumber };
}

function SimpleAlert() {
  return (
    <Alert
      icon={<CheckIcon fontSize="inherit" />}
      severity="success"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      Вызов дежурной бригады по ИТП-Западный отправлен
    </Alert>
  );
}

const RightSidebar = () => {
  const [modal, setModal] = React.useState({ action: false, correct: false });
  const [showAlert, setShowAlert] = useState(false);
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleOpenModal = (name, status) => {
    setModal((p) => ({ ...p, [name]: status }));
    setShowAlert(false);
  };

  return (
    <aside className={style.wrapper}>
      <Modal
        id="dispatcher-action-modal"
        open={modal.action}
        onClose={() => handleOpenModal("action", false)}
      >
        {showAlert ? (
          <SimpleAlert />
        ) : (
          <Box sx={boxActionStyle}>
            <IconButton
              aria-label="закрыть"
              onClick={() => handleOpenModal("action", false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="h2">
              Предпримите следующие дейсвтвия:
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Оповестите аварийную службу и отправьте бригаду на место.
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="error"
                startIcon={<CallOutlinedIcon />}
                onClick={() => setShowAlert(true)}
              >
                Бригада
              </Button>
              <Button
                variant="contained"
                startIcon={<CallOutlinedIcon />}
                onClick={() => handleOpenModal("action", false)}
              >
                Старший смены
              </Button>
            </Stack>
          </Box>
        )}
      </Modal>
      <Modal
        id="dispatcher-correct-modal"
        open={modal.correct}
        onClose={() => handleOpenModal("correct", false)}
      >
        <Box sx={boxCorrectStyle}>
          <IconButton
            aria-label="закрыть"
            onClick={() => handleOpenModal("correct", false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="h2">
            Выберите причину корректировки прогноза:
          </Typography>
          <FormControl fullWidth style={{ marginTop: 16 }}>
            <InputLabel id="demo-simple-select-label">Причина</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Причина"
              onChange={handleChange}
            >
              <MenuItem value={0}>Нет заморозков</MenuItem>
              <MenuItem value={1}>Плановое отключение</MenuItem>
              <MenuItem value={2}>Механический отказ датчиков</MenuItem>
              <MenuItem value={3}>Требуется плановая инспекция</MenuItem>
            </Select>
          </FormControl>
          <Stack direction="row" sx={{ justifyContent: "end", marginTop: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleOpenModal("correct", false)}
            >
              Пересчитать прогноз
            </Button>
          </Stack>
        </Box>
      </Modal>
      <div className={style.header}>
        <p>Список прогнозов до {todayWithWeek().date}</p>
      </div>
      <hr />
      <div className={style.danger}>
        <p>Зона риска</p>
        <ol>
          <li>
            <div className={style["aprove-wrapper"]}>
              <Button
                startIcon={<ReportProblemIcon />}
                variant="contained"
                color="warning"
                onClick={() => handleOpenModal("action", true)}
              />
              ИТП-Западный
              <Button
                startIcon={<ThumbDownOffAltIcon />}
                variant="contained"
                color="info"
                onClick={() => handleOpenModal("correct", true)}
              />
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
