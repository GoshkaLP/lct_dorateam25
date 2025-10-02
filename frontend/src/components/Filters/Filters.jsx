import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import "./Filter.css";
import { useFormik } from "formik";
import { AddressesField } from "./components/AddressesField/AddressesField";
import useFetch from "../../hooks/useFetch";
import { useMemo, useState, useEffect, useRef } from "react";
import { CadastralsField } from "./components/CadastralField/CadastralField";
import { AreaField } from "./components/AreaField/AreaField";
import { DistrictField } from "./components/DistrictField/DistrictField";
import {
  getOptionsAndMap,
  getFilterOptions,
  formatCrossingFilters,
} from "./utils";
import { FieldNames } from "./constant";
import { useData } from "./components/DataContext/DataContext";
import { Slider, Switch } from "@mui/material";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";

function Filters({
  coordinatesPoint,
  setSelectedCrossingFilters,
  setFilterNames,
}) {
  const { setTestData } = useData();
  const [localData, setLocalData] = useState(null);
  const [byPoint, setByPoint] = useState(false);
  const [range, setRange] = useState(false);
  const [checkedState, setCheckedState] = useState({
    itp: true,
    mkd: true,
  });
  // Date Range Picker state
  const [periodType, setPeriodType] = useState("месяц");
  const [dateRange, setDateRange] = useState([0, 5]); // default: 6 месяцев

  // Period options
  const periodOptions = [
    { label: "Месяц", value: "месяц" },
    { label: "Неделя", value: "неделя" },
    { label: "Сутки", value: "сутки" },
    { label: "Смена", value: "смена" },
  ];

  // Slider config by period type
  const getSliderConfig = () => {
    switch (periodType) {
      case "месяц":
        return {
          min: 0,
          max: 5,
          step: 1,
          marks: Array.from({ length: 6 }, (_, i) => ({
            value: i,
            label: `${i + 1} мес`,
          })),
        };
      case "неделя":
        return {
          min: 0,
          max: 25,
          step: 1,
          marks: Array.from({ length: 26 }, (_, i) => ({
            value: i,
            label: `${i + 1} нед`,
          })),
        };
      case "сутки":
        return {
          min: 0,
          max: 23,
          step: 1,
          marks: Array.from({ length: 24 }, (_, i) => ({
            value: i,
            label: `${i + 1} ч`,
          })),
        };
      case "смена":
        return {
          min: 0,
          max: 59,
          step: 1,
          marks: Array.from({ length: 60 }, (_, i) => ({
            value: i,
            label: `${i + 1} см`,
          })),
        };
      default:
        return { min: 0, max: 5, step: 1, marks: [] };
    }
  };

  const [submitCode, setSubmitCode] = useState(null);
  const areas = useFetch(
    `https://apidata.mos.ru/v1/datasets/3305/features?api_key=${process.env.REACT_APP_MOS_API_KEY}`
  );
  const addresses = useFetch(
    `https://apidata.mos.ru/v1/datasets/3305/features?api_key=${process.env.REACT_APP_MOS_API_KEY}`
  );
  const cadastrals = useFetch(
    "http://178.20.44.143:8080/navigation/filters/cadastrals"
  );
  const districts = useFetch(
    "http://178.20.44.143:8080/navigation/filters/districts"
  );
  const crossingFilters = useFetch(
    "http://178.20.44.143:8080/crossing/filters/"
  );

  const areasData = useMemo(() => getOptionsAndMap(areas), [areas]);
  const districtData = useMemo(() => getOptionsAndMap(districts), [districts]);
  const addressesData = useMemo(() => getOptionsAndMap(addresses), [addresses]);
  const cadastralData = useMemo(
    () => getOptionsAndMap(cadastrals),
    [cadastrals]
  );
  const crossingFiltersData = useMemo(
    () => getFilterOptions(crossingFilters),
    [crossingFilters]
  );

  const [filterValues, setFilterValues] = useState({});
  const [showToolTip, setShowToolTip] = useState(null);
  const refSetTimeout = useRef();

  const onMouseEnterHandler = (option) => {
    refSetTimeout.current = setTimeout(() => {
      setShowToolTip(option);
    }, 750);
  };

  const onMouseLeaveHandler = () => {
    clearTimeout(refSetTimeout.current);
    setShowToolTip(null);
  };

  const sendPostRequest = async () => {
    try {
      const res = await fetch("http://178.20.44.143:8080/polygons/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: submitCode,
      });
      if (!res.ok) {
        throw new Error("Response is not ok");
      }
      const data = await res.json();
      setLocalData(data);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      [FieldNames.areas]: [],
      [FieldNames.addresses]: [],
      [FieldNames.cadastrals]: [],
      [FieldNames.districts]: [],
      [FieldNames.crossingFilters]: {},
    },
    onSubmit: (values) => {
      const data = byPoint
        ? {
            ...values,
            radiusSearch: {
              lon: coordinatesPoint.lng,
              lat: coordinatesPoint.lat,
              radius: Number(range) / 111111,
            },
          }
        : values;
      setSelectedCrossingFilters(data.crossingFilters);
      const tmp = {};
      crossingFiltersData.map.forEach((value, key) => {
        tmp[value.key] = key;
      });
      setFilterNames(tmp);
      try {
        fetch("http://178.20.44.143:8080/polygons/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }).then((res) =>
          res.json().then((d) => {
            setLocalData(d);
          })
        );
      } catch (error) {
        console.error("Error: ", error);
      }
    },
  });

  useEffect(() => {
    if (submitCode) {
      sendPostRequest(submitCode);
    }
  }, [submitCode]);

  useEffect(() => {
    setTestData(localData);
  }, [localData]);

  const handleCheckboxChange = (option, key, isChecked) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      [option]: {
        isChecked,
        value: isChecked ? 0 : null,
      },
    }));
    formik.setFieldValue(`crossingFilters.${key}`, 0);
  };

  const handleRadioChange = (option, key, newValue) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      [option]: {
        ...prevValues[option],
        value: newValue,
      },
    }));
    formik.setFieldValue(`crossingFilters.${key}`, newValue);
  };

  const card = (
    <React.Fragment>
      <Divider style={{ marginBottom: "20px" }} />
      <form
        onSubmit={formik.handleSubmit}
        className="form"
        style={{ width: "100%", padding: 0 }}
      >
        <Accordion
          style={{
            borderRadius: "20px",
            margin: 0,
            width: "100%",
            // "&::before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <div style={{ textDecoration: "semibold", fontWeight: "700" }}>
                Тип объекта
              </div>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    checked={checkedState.itp}
                    onChange={(e) =>
                      setCheckedState((prev) => ({
                        ...prev,
                        itp: e.target.checked,
                      }))
                    }
                    sx={{
                      color: "#9E9E9E",
                      "&.Mui-checked": {
                        color: "#0D4CD3",
                      },
                    }}
                  />
                }
                labelPlacement="start"
                label="ИТП"
                sx={{
                  margin: 0,
                  justifyContent: "space-between",
                  "& .MuiFormControlLabel-label": {
                    color: checkedState.itp ? "inherit" : "#9E9E9E",
                    transition: "color 0.2s",
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    checked={checkedState.mkd}
                    onChange={(e) =>
                      setCheckedState((prev) => ({
                        ...prev,
                        mkd: e.target.checked,
                      }))
                    }
                    sx={{
                      color: "#9E9E9E",
                      "&.Mui-checked": {
                        color: "#0D4CD3",
                      },
                    }}
                  />
                }
                labelPlacement="start"
                label="МКД"
                sx={{
                  margin: 0,
                  justifyContent: "space-between",
                  "& .MuiFormControlLabel-label": {
                    color: checkedState.mkd ? "inherit" : "#9E9E9E",
                    transition: "color 0.2s",
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    checked={checkedState.uspd}
                    onChange={(e) =>
                      setCheckedState((prev) => ({
                        ...prev,
                        uspd: e.target.checked,
                      }))
                    }
                    sx={{
                      color: "#9E9E9E",
                      "&.Mui-checked": {
                        color: "#0D4CD3",
                      },
                    }}
                  />
                }
                labelPlacement="start"
                label="УСПД"
                sx={{
                  margin: 0,
                  justifyContent: "space-between",
                  "& .MuiFormControlLabel-label": {
                    color: checkedState.uspd ? "inherit" : "#9E9E9E",
                    transition: "color 0.2s",
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    checked={checkedState.odpu_gvs}
                    onChange={(e) =>
                      setCheckedState((prev) => ({
                        ...prev,
                        odpu_gvs: e.target.checked,
                      }))
                    }
                    sx={{
                      color: "#9E9E9E",
                      "&.Mui-checked": {
                        color: "#0D4CD3",
                      },
                    }}
                  />
                }
                labelPlacement="start"
                label="ОДПУ ГВС"
                sx={{
                  margin: 0,
                  justifyContent: "space-between",
                  "& .MuiFormControlLabel-label": {
                    color: checkedState.odpu_gvs ? "inherit" : "#9E9E9E",
                    transition: "color 0.2s",
                  },
                }}
              />
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        <Divider style={{ margin: "20px 0 20px 0" }} />
        <Accordion
          style={{
            borderRadius: "20px",
            margin: 0,
            width: "100%",
            // "&::before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <div style={{ textDecoration: "semibold", fontWeight: "700" }}>
                Статус объекта
              </div>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    checked={checkedState.оранжевый}
                    onChange={(e) =>
                      setCheckedState((prev) => ({
                        ...prev,
                        оранжевый: e.target.checked,
                      }))
                    }
                    sx={{
                      color: "#9E9E9E",
                      "&.Mui-checked": {
                        color: "#0D4CD3",
                      },
                    }}
                  />
                }
                labelPlacement="start"
                label="Оранжевый"
                sx={{
                  margin: 0,
                  justifyContent: "space-between",
                  "& .MuiFormControlLabel-label": {
                    color: checkedState.оранжевый ? "inherit" : "#9E9E9E",
                    transition: "color 0.2s",
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    checked={checkedState.жёлтый}
                    onChange={(e) =>
                      setCheckedState((prev) => ({
                        ...prev,
                        жёлтый: e.target.checked,
                      }))
                    }
                    sx={{
                      color: "#9E9E9E",
                      "&.Mui-checked": {
                        color: "#0D4CD3",
                      },
                    }}
                  />
                }
                labelPlacement="start"
                label="Жёлтый"
                sx={{
                  margin: 0,
                  justifyContent: "space-between",
                  "& .MuiFormControlLabel-label": {
                    color: checkedState.жёлтый ? "inherit" : "#9E9E9E",
                    transition: "color 0.2s",
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    checked={checkedState.Зёленый}
                    onChange={(e) =>
                      setCheckedState((prev) => ({
                        ...prev,
                        Зёленый: e.target.checked,
                      }))
                    }
                    sx={{
                      color: "#9E9E9E",
                      "&.Mui-checked": {
                        color: "#0D4CD3",
                      },
                    }}
                  />
                }
                labelPlacement="start"
                label="Зёленый"
                sx={{
                  margin: 0,
                  justifyContent: "space-between",
                  "& .MuiFormControlLabel-label": {
                    color: checkedState.Зёленый ? "inherit" : "#9E9E9E",
                    transition: "color 0.2s",
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    checked={checkedState.unknown}
                    onChange={(e) =>
                      setCheckedState((prev) => ({
                        ...prev,
                        unknown: e.target.checked,
                      }))
                    }
                    sx={{
                      color: "#9E9E9E",
                      "&.Mui-checked": {
                        color: "#0D4CD3",
                      },
                    }}
                  />
                }
                labelPlacement="start"
                label="Неизвестный"
                sx={{
                  margin: 0,
                  justifyContent: "space-between",
                  "& .MuiFormControlLabel-label": {
                    color: checkedState.unknown ? "inherit" : "#9E9E9E",
                    transition: "color 0.2s",
                  },
                }}
              />
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        <Divider style={{ margin: "20px 0 20px 0" }} />
        <Accordion
          style={{
            borderRadius: "20px",
            margin: 0,
            width: "100%",
            // "&::before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <div style={{ textDecoration: "semibold", fontWeight: "700" }}>
                ID объекта
              </div>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <CadastralsField
              value={formik.values.cadastrals}
              onChange={(_, newValue) =>
                formik.setFieldValue(FieldNames.cadastrals, newValue)
              }
              loading={cadastrals.loading}
              cadastrals={cadastralData.map}
              options={cadastralData.options}
            />
          </AccordionDetails>
        </Accordion>

        {/* Date Range Picker "Период наблюдения" */}
        <Accordion style={{ borderRadius: "20px", margin: 0, width: "100%" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-period-content"
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <div style={{ textDecoration: "semibold", fontWeight: "700" }}>
                Период наблюдения
              </div>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={2}>
                {periodOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={
                      periodType === opt.value ? "contained" : "outlined"
                    }
                    onClick={() => setPeriodType(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </Stack>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  width: "100%",
                  marginTop: 2.5,
                }}
              >
                <Slider
                  value={dateRange}
                  onChange={(_, v) => setDateRange(v)}
                  valueLabelDisplay="auto"
                  min={getSliderConfig().min}
                  max={getSliderConfig().max}
                  step={getSliderConfig().step}
                  marks={[
                    {
                      value: getSliderConfig().min,
                      label: getSliderConfig().min,
                    },
                    {
                      value: getSliderConfig().max,
                      label: getSliderConfig().max,
                    },
                  ]}
                  sx={{ width: "90%" }}
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </form>
      {/* Удалён неиспользуемый блок {false && (...)} для устранения ошибок компиляции */}
      <Box className="form-container">
        <div className="form-field-group">
          {/* <label htmlFor="addresses">Поиск по адресу</label> */}
          <AddressesField
            value={formik.values.addresses}
            onChange={(_, newValue) =>
              formik.setFieldValue(FieldNames.addresses, newValue)
            }
            loading={addresses.loading}
            addresses={addressesData.map}
            options={addressesData.options}
          />
          {/* <label htmlFor="cadastrals">Поиск по кадастру</label> */}
          <CadastralsField
            value={formik.values.cadastrals}
            onChange={(_, newValue) =>
              formik.setFieldValue(FieldNames.cadastrals, newValue)
            }
            loading={cadastrals.loading}
            cadastrals={cadastralData.map}
            options={cadastralData.options}
          />
          {/* <label htmlFor="areas">Поиск по районам</label> */}
          <DistrictField
            values={formik.values.districts}
            onChange={(_, newValue) => {
              formik.setFieldValue(FieldNames.districts, newValue);
            }}
            options={districtData.options}
            loading={districts.loading}
            areas={districtData.map}
          />
          {/* <label htmlFor="areas">Поиск по округам</label> */}
          <AreaField
            values={formik.values.areas}
            onChange={(_, newValue) => {
              formik.setFieldValue(FieldNames.areas, newValue);
            }}
            options={areasData.options}
            loading={areas.loading}
            areas={areasData.map}
          />
        </div>

        <div className="form-field-group">
          <p className="form-field-group-title">Пересечения с территориями</p>
          {crossingFiltersData.options.map((option) => {
            const { description, key } = crossingFiltersData.map.get(option);
            const isChecked = filterValues[option]?.isChecked || false;
            const radioValue = filterValues[option]?.value;
            return (
              <div>
                <label className="form-field-group-checkbox-label">
                  <p className="form-field-group-text">{option}</p>
                  {/* <p className="tooltip-question" onMouseEnter={() => onMouseEnterHandler(option)} onMouseLeave={onMouseLeaveHandler}>?</p> */}
                  <Checkbox
                    className="form-field-group-checkbox"
                    checked={isChecked}
                    onChange={(e) =>
                      handleCheckboxChange(option, key, e.target.checked)
                    }
                  />
                  {/* <input
                                            type="checkbox"
                                            onChange={(e) => handleCheckboxChange(option, key, e.target.checked)}
                                            checked={isChecked}
                                        /> */}
                  {/* <div className="tooltip">
                                            {showToolTip &&
                                                <div className="tooltiptext">{description}</div>
                                            }
                                        </div> */}
                </label>
                {isChecked && (
                  <div className="form-field-group-radios">
                    <div>
                      <label className="form-field-group-radio-label">
                        <p className="form-field-group-text">
                          Строгое исключение
                        </p>
                        <Radio
                          size="small"
                          className="form-field-group-radio"
                          checked={radioValue === 0}
                          onChange={() => handleRadioChange(option, key, 0)}
                          value={0}
                          name={option}
                        />
                        {/* <input 
                                                        type="radio"
                                                        name={option}
                                                        value={0}    
                                                        checked={radioValue === 0}
                                                        onChange={() => handleRadioChange(option, key, 0)}
                                                    /> */}
                      </label>
                    </div>
                    <div>
                      <label className="form-field-group-radio-label">
                        <p className="form-field-group-text">
                          Допустимое пересечение
                        </p>
                        <Radio
                          size="small"
                          className="form-field-group-radio"
                          checked={radioValue === 1}
                          onChange={() => handleRadioChange(option, key, 1)}
                          value={1}
                          name={option}
                        />
                        {/* <input 
                                                        type="radio"
                                                        name={option}
                                                        value={1}    
                                                        checked={radioValue  === 1}
                                                        onChange={() => handleRadioChange(option, key, 1)}
                                                    /> */}
                      </label>
                    </div>
                    <div>
                      <label className="form-field-group-radio-label">
                        <p className="form-field-group-text">
                          Отсутствие влияния
                        </p>
                        <Radio
                          size="small"
                          className="form-field-group-radio"
                          checked={radioValue === 2}
                          onChange={() => handleRadioChange(option, key, 2)}
                          value={2}
                          name={option}
                        />
                        {/* <input 
                                                        type="radio"
                                                        name={option}
                                                        value={2}    
                                                        checked={radioValue === 2}
                                                        onChange={() => handleRadioChange(option, key, 2)}
                                                    /> */}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="form-field-group">
          <Box display={"flex"} style={{ alignItems: "center" }}>
            <p className="form-field-group-title">Поиск по точке</p>
            <Switch
              value={byPoint}
              onChange={(_, newValue) => {
                setByPoint(newValue);
              }}
            />
          </Box>
          {byPoint && (
            <Box>
              Координаты точки:
              <Box>
                <p className="by-point-coords">
                  <span style={{ fontWeight: "600", color: "#2196F3" }}>
                    [lng]
                  </span>{" "}
                  {coordinatesPoint.lng}
                </p>
                <p className="by-point-coords">
                  <span style={{ fontWeight: "600", color: "#2196F3" }}>
                    [lat]
                  </span>{" "}
                  {coordinatesPoint.lat}
                </p>
              </Box>
              Радиус, м:
              <Slider
                aria-label="range"
                defaultValue={5}
                valueLabelDisplay={range}
                shiftStep={1}
                step={100}
                min={0}
                max={10000}
                onChange={(_, v) => setRange(v)}
              />
            </Box>
          )}
        </div>

        <div className="form-button-container">
          <Button variant="contained" className="form-button" type="submit">
            Найти участки
            <Box sx={{ mb: 2 }}>
              <div style={{ marginBottom: 8 }}>Выберите период:</div>
              <Stack direction="row" spacing={2}>
                {periodOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={
                      periodType === opt.value ? "contained" : "outlined"
                    }
                    onClick={() => setPeriodType(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </Stack>
            </Box>
            <div style={{ marginBottom: 8 }}>Диапазон:</div>
            <Slider
              value={dateRange}
              onChange={(_, v) => setDateRange(v)}
              valueLabelDisplay="auto"
              min={getSliderConfig().min}
              max={getSliderConfig().max}
              step={getSliderConfig().step}
              marks={getSliderConfig().marks}
            />
            <div style={{ marginTop: 16 }}>Радиус, м:</div>
            <Slider
              aria-label="range"
              defaultValue={5}
              valueLabelDisplay={range}
              shiftStep={1}
              step={100}
              min={0}
              max={10000}
              onChange={(_, v) => setRange(v)}
            />
          </Button>
        </div>
        {/* <button class="form-button" type="submit">Submit</button> */}
      </Box>
    </React.Fragment>
  );

  return <Box className="filters">{card}</Box>;
}
export default Filters;
