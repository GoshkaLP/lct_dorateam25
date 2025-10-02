import * as React from "react";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
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
  const districts = useFetch("http://5.129.195.176:8080/api/region/districts");
  const regions = useFetch("http://5.129.195.176:8080/api/region/regions");
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
                aria-controls="panel-id-content"
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <div
                    style={{ textDecoration: "semibold", fontWeight: "700" }}
                  >
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
          </AccordionDetails>
        </Accordion>
        <Divider style={{ margin: "20px 0 20px 0" }} />

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
        <Divider style={{ margin: "20px 0 20px 0" }} />
        {/* Блок "Диспетчер объекта" в самом конце */}
        <Accordion style={{ borderRadius: "20px", margin: 0, width: "100%" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-dispatcher-content"
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <div style={{ textDecoration: "semibold", fontWeight: "700" }}>
                Диспетчер объекта
              </div>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {/* Autocomplete с чекбоксами */}
            <Autocomplete
              multiple
              options={["Иванов", "Петров", "Сидоров", "Смирнов"]}
              disableCloseOnSelect
              getOptionLabel={(option) => option}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  {option}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Выберите диспетчера"
                  placeholder="Диспетчер"
                />
              )}
              sx={{ width: "100%" }}
            />
          </AccordionDetails>
        </Accordion>
        <Divider style={{ margin: "20px 0 20px 0" }} />
        {/* Новый блок "Округ" по аналогии с "Статус объекта" */}
        <Accordion style={{ borderRadius: "20px", margin: 0, width: "100%" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-district-content"
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <div style={{ textDecoration: "semibold", fontWeight: "700" }}>
                Округ
              </div>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {Array.isArray(districts.data)
                ? districts.data.map((okrug) => (
                    <FormControlLabel
                      key={okrug.value}
                      control={<Checkbox defaultChecked />}
                      labelPlacement="start"
                      label={okrug.value}
                      sx={{ margin: 0, justifyContent: "space-between" }}
                    />
                  ))
                : null}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        <Divider style={{ margin: "20px 0 20px 0" }} />

        {/* Новый блок "Район" по аналогии с "Диспетчер объекта" */}
        <Accordion style={{ borderRadius: "20px", margin: 0, width: "100%" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-rayon-content"
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <div style={{ textDecoration: "semibold", fontWeight: "700" }}>
                Район
              </div>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {/* Autocomplete с чекбоксами для районов из API */}
            <Autocomplete
              multiple
              options={
                Array.isArray(regions.data)
                  ? regions.data.map((r) => r.value || r)
                  : []
              }
              disableCloseOnSelect
              getOptionLabel={(option) => option}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  {option}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Выберите район"
                  placeholder="Район"
                />
              )}
              sx={{ width: "100%" }}
              loading={regions.loading}
            />
          </AccordionDetails>
        </Accordion>
        <Divider style={{ margin: "20px 0 20px 0" }} />
        {/* Новый блок "Адрес" по аналогии с "ID объекта" */}
        <Accordion
          style={{
            borderRadius: "20px",
            margin: 0,
            width: "100%",
          }}
          disabled={true}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-address-content"
            sx={{
              "& .MuiAccordionSummary-content": {
                marginLeft: "10px",
              },
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <div style={{ textDecoration: "semibold", fontWeight: "700" }}>
                Адрес
              </div>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <AddressesField
              value={formik.values.addresses}
              onChange={(_, newValue) =>
                formik.setFieldValue(FieldNames.addresses, newValue)
              }
              loading={addresses.loading}
              addresses={addressesData.map}
              options={addressesData.options}
            />
          </AccordionDetails>
        </Accordion>
      </form>
    </React.Fragment>
  );

  return <Box className="filters">{card}</Box>;
}
export default Filters;
