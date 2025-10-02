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
  expanded
}) {
  const { setTestData, setRegions, setItpFilters, itpData } = useData();
  const [localData, setLocalData] = useState(null);
  const [byPoint, setByPoint] = useState(false);
  const [range, setRange] = useState(false);
  const [checkedState, setCheckedState] = useState({
    itp: true,
    mkd: true,
  });
  const [dispatcherSearchValue, setDispatcherSearchValue] = useState('');
  const [filteredDispatchers, setFilteredDispatchers] = useState([]);
  const [districtSearchValue, setDistrictSearchValue] = useState('');
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [regionSearchValue, setRegionSearchValue] = useState('');
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [idSearchValue, setIdSearchValue] = useState('');
  const [filteredIds, setFilteredIds] = useState([]);
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
  // const areas = useFetch(
  //   `https://apidata.mos.ru/v1/datasets/3305/features?api_key=${process.env.REACT_APP_MOS_API_KEY}`
  // );
  // const addresses = useFetch(
  //   `https://apidata.mos.ru/v1/datasets/3305/features?api_key=${process.env.REACT_APP_MOS_API_KEY}`
  // );
  // const cadastrals = useFetch(
  //   "http://178.20.44.143:8080/navigation/filters/cadastrals"
  // );
  const districts = useFetch("https://dora.team/api/region/districts");
  const regions = useFetch("https://dora.team/api/region/regions");
  const statuses = useFetch("https://dora.team/api/region/statuses");
  const dispatchers = useFetch("https://dora.team/api/region/dispatchers");
  // const crossingFilters = useFetch(
  //   "http://178.20.44.143:8080/crossing/filters/"
  // );

  // const areasData = useMemo(() => getOptionsAndMap(areas), [areas]);
  const districtData = useMemo(() => getOptionsAndMap(districts), [districts]);
  // const addressesData = useMemo(() => getOptionsAndMap(addresses), [addresses]);
  // const cadastralData = useMemo(
  //   () => getOptionsAndMap(cadastrals),
  //   [cadastrals]
  // );
  // const crossingFiltersData = useMemo(
  //   () => getFilterOptions(crossingFilters),
  //   [crossingFilters]
  // );

  const [filterValues, setFilterValues] = useState({});
  const [showToolTip, setShowToolTip] = useState(null);
  const refSetTimeout = useRef();
  
  // Состояние для выбранных фильтров
  const [selectedFilters, setSelectedFilters] = useState({
    id: '',
    district: '',
    region: '',
    dispatcher: '',
    status: []
  });

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

  // Функция для обновления параметров фильтрации ITP
  const updateITPData = (filters) => {
    // Сохраняем параметры фильтрации в контекст
    setItpFilters(filters);
  };

  const formik = useFormik({
    initialValues: {
      [FieldNames.areas]: [],
      [FieldNames.addresses]: [],
      [FieldNames.cadastrals]: [],
      [FieldNames.districts]: [],
      [FieldNames.crossingFilters]: {},
      dispatcher: [],
      statuses: [],
    },
    onSubmit: (values) => {
      const filtersData = {
        id: values[FieldNames.cadastrals] || [], // ID объекта - массив всех выбранных ID
        district: values[FieldNames.districts]?.[0] || '', // Округ
        region: values[FieldNames.addresses]?.[0] || '', // Район (из адресов)
        dispatcher: values.dispatcher?.[0] || '', // Диспетчер
        status: values.statuses || [] // Статусы
      };

      // Обновляем данные ITP с фильтрами
      updateITPData(filtersData);

      // Сохраняем старую логику для совместимости
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
      
      const tmp = {};
      setFilterNames(tmp);
      
      // try {
      //   fetch("https://dora.team/api/region/polygons", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(data),
      //   }).then((res) =>
      //     res.json().then((d) => {
      //       setLocalData(d);
      //     })
      //   );
      // } catch (error) {
      //   console.error("Error: ", error);
      // }
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

  // Фильтрация диспетчеров по введенному тексту
  useEffect(() => {
    if (Array.isArray(dispatchers.data)) {
      if (dispatcherSearchValue) {
        const filtered = dispatchers.data.filter(dispatcher => {
          const dispatcherValue = dispatcher.value || dispatcher;
          return dispatcherValue.toLowerCase().includes(dispatcherSearchValue.toLowerCase());
        });
        setFilteredDispatchers(filtered);
      } else {
        // Показываем всех диспетчеров по умолчанию
        setFilteredDispatchers(dispatchers.data);
      }
    } else {
      setFilteredDispatchers([]);
    }
  }, [dispatcherSearchValue, dispatchers.data]);

  // Фильтрация округов по введенному тексту
  useEffect(() => {
    if (Array.isArray(districts.data)) {
      if (districtSearchValue) {
        const filtered = districts.data.filter(district => {
          const districtValue = district.value || district;
          return districtValue.toLowerCase().includes(districtSearchValue.toLowerCase());
        });
        setFilteredDistricts(filtered);
      } else {
        // Показываем все округа по умолчанию
        setFilteredDistricts(districts.data);
      }
    } else {
      setFilteredDistricts([]);
    }
  }, [districtSearchValue, districts.data]);

  // Фильтрация районов по введенному тексту
  useEffect(() => {
    if (Array.isArray(regions.data)) {
      if (regionSearchValue) {
        const filtered = regions.data.filter(region => {
          const regionValue = region.value || region;
          return regionValue.toLowerCase().includes(regionSearchValue.toLowerCase());
        });
        setFilteredRegions(filtered);
      } else {
        // Показываем все районы по умолчанию
        setFilteredRegions(regions.data);
      }
    } else {
      setFilteredRegions([]);
    }
  }, [regionSearchValue, regions.data]);

  // Фильтрация ID объектов по введенному тексту из данных ITP
  useEffect(() => {
    if (idSearchValue && Array.isArray(itpData.data)) {
      const filtered = itpData.data.filter(item => {
        const idValue = item.id || '';
        return idValue.toLowerCase().includes(idSearchValue.toLowerCase());
      });
      setFilteredIds(filtered);
    } else {
      setFilteredIds([]);
    }
  }, [idSearchValue, itpData.data]);

  const handleCheckboxChange = (option, key, isChecked) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      [option]: {
        isChecked,
        value: isChecked ? 0 : null,
      },
    }));
    formik.setFieldValue(`crossingFilters?.${key}`, 0);
  };

  const handleRadioChange = (option, key, newValue) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      [option]: {
        ...prevValues[option],
        value: newValue,
      },
    }));
    formik.setFieldValue(`crossingFilters?.${key}`, newValue);
  };

  const card = (
    <React.Fragment >
      <Divider style={{ marginBottom: "20px" }} />
      <form
        onSubmit={formik.handleSubmit}
        className="form"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            formik.handleSubmit();
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            formik.resetForm();
          }
        }}
        style={{ 
          width: "100%", 
          padding: 0,
          marginBottom: '50px',
          display: "flex",
          flexDirection: "column",
          height: "100%"
        }}
      >
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          paddingBottom: "20px" 
        }}>

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
            sx={{
              "& .MuiAccordionSummary-content": {
              margin: 0,
              }
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <div style={{ textDecoration: "semibold", fontWeight: "700" }}>
                Статус объекта
              </div>
            </Stack>
          </AccordionSummary>
          <AccordionDetails 
          sx={{
              marginTop: '20px',
          }}
          >
            <FormGroup style={{gap: '10px'}}>
              {statuses.loading ? (
                <div>Загрузка статусов...</div>
              ) : Array.isArray(statuses.data) ? (
                statuses.data.map((status, index) => {
                  const statusValue = status.value || status;
                  const isChecked = formik.values.statuses?.includes(statusValue) || false;
                  
                  return (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={isChecked}
                          onChange={(e) => {
                            const currentStatuses = formik.values.statuses || [];
                            const newStatuses = e.target.checked
                              ? [...currentStatuses, statusValue]
                              : currentStatuses.filter(s => s !== statusValue);
                            formik.setFieldValue('statuses', newStatuses);
                          }}
                          sx={{
                            color: "#9E9E9E",
                            "&.Mui-checked": {
                              color: "#0D4CD3",
                            },
                          }}
                        />
                      }
                      labelPlacement="start"
                      label={statusValue}
                      sx={{
                        margin: 0,
                        justifyContent: "space-between",
                        "& .MuiFormControlLabel-label": {
                          color: isChecked ? "inherit" : "#9E9E9E",
                          transition: "color 0.2s",
                          fontSize: '14px',
                        },
                      }}
                    />
                  );
                })
              ) : (
                <div>Нет доступных статусов</div>
              )}
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
            aria-controls="panel-id-content"
            sx={{
              "& .MuiAccordionSummary-content": {
              margin: 0,
              }
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <div style={{ textDecoration: "semibold", fontWeight: "700" }}>
                ID объекта
              </div>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              placeholder="Введите ID объекта"
              value={idSearchValue || ''}
              onChange={(e) => {
                setIdSearchValue(e.target.value);
              }}
              sx={{
                marginTop: '10px',
                padding: 0,
                width: '100%',
                '& .MuiInputBase-root': {
                  height: '28px',
                  borderRadius: '50px',
                  backgroundColor: '#F9F7F7',
                  border: 'none',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
            
            {/* Список результатов поиска ID объектов */}
            <Box sx={{ mt: 1, maxHeight: '200px', overflowY: 'auto' }}>
              <FormGroup style={{ gap: '5px' }}>
                {filteredIds.length > 0 ? filteredIds.map((item, index) => {
                  const idValue = item.id || '';
                  const isSelected = formik.values[FieldNames.cadastrals]?.includes(idValue) || false;
                  
                  return (
                    <FormControlLabel
                      key={index}
                      labelPlacement="start"
                      control={
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => {
                            const currentIds = formik.values[FieldNames.cadastrals] || [];
                            const newIds = e.target.checked
                              ? [...currentIds, idValue]
                              : currentIds.filter(i => i !== idValue);
                            formik.setFieldValue(FieldNames.cadastrals, newIds);
                          }}
                          sx={{
                            color: "#9E9E9E",
                            "&.Mui-checked": {
                              color: "#0D4CD3",
                            },
                          }}
                        />
                      }
                      label={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: 'bold' }}>{idValue}</span>
                          <span style={{ fontSize: '12px', color: '#666' }}>
                            {item.district} • {item.region} • {item.status}
                          </span>
                        </div>
                      }
                      sx={{
                        margin: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        justifyContent: "space-between",
                        "& .MuiFormControlLabel-label": {
                          color: isSelected ? "inherit" : "#9E9E9E",
                          transition: "color 0.2s",
                          fontSize: '14px',
                        },
                      }}
                    />
                  );
                }) : (
                  <div style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    color: '#9E9E9E',
                    fontSize: '14px'
                  }}>
                    {itpData.loading ? 'Загрузка ID объектов...' : 
                     !Array.isArray(itpData.data) || itpData.data.length === 0 ? 'Нет доступных ID объектов' :
                     'Введите ID объекта для поиска'}
                  </div>
                )}
              </FormGroup>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Divider style={{ margin: "20px 0 20px 0" }} />

        {/* Date Range Picker "Период наблюдения" */}
          <Accordion style={{ 
            borderRadius: "20px", 
            margin: 0, 
            width: "100%",
            opacity: "0.3",
            backgroundColor: "#F9F7F7",
            cursor: "not-allowed",
          }} 
          disabled={true}
          >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-period-content"
            sx={{
              "& .MuiAccordionSummary-content": {
                // если Disabled
                marginLeft: "10px",
              },
            }}
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
            sx={{
              "& .MuiAccordionSummary-content": {
              margin: 0,
              }
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <div style={{ textDecoration: "semibold", fontWeight: "700" }}>
                Диспетчер объекта
              </div>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {/* Autocomplete с чекбоксами */}
                          <TextField
                fullWidth
               placeholder="Введите диспетчера"
               value={dispatcherSearchValue || ''}
               onChange={(e) => {
                  setDispatcherSearchValue(e.target.value);
                }}
                sx={{
                 marginTop: '10px',
                 padding: 0,
                  width: '100%',
                  '& .MuiInputBase-root': {
                    height: '28px',
                    borderRadius: '50px',
                    backgroundColor: '#F9F7F7',
                    border: 'none', // явно убираем border
                    '& fieldset': {
                      border: 'none', // убираем стандартную рамку outlined-варианта
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none',
                    },
                  },
                }}
              />
              
              {/* Список результатов поиска диспетчеров */}
              <Box sx={{ mt: 1, maxHeight: '200px', overflowY: 'auto' }}>
                <FormGroup style={{ gap: '5px' }}>
                  {filteredDispatchers.length > 0 ? filteredDispatchers.map((dispatcher, index) => {
                      const dispatcherValue = dispatcher.value || dispatcher;
                      const isSelected = formik.values.dispatcher?.includes(dispatcherValue) || false;
                      
                      return (
                        <FormControlLabel
                          key={index}
                          labelPlacement="start"
                          control={
                            <Checkbox
                              checked={isSelected}
                              onChange={(e) => {
                                const currentDispatchers = formik.values.dispatcher || [];
                                const newDispatchers = e.target.checked
                                  ? [...currentDispatchers, dispatcherValue]
                                  : currentDispatchers.filter(d => d !== dispatcherValue);
                                formik.setFieldValue('dispatcher', newDispatchers);
                              }}
                              sx={{
                                color: "#9E9E9E",
                                "&.Mui-checked": {
                                  color: "#0D4CD3",
                                },
                              }}
                            />
                          }
                          label={dispatcherValue}
                          sx={{
                            margin: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                            justifyContent: "space-between",
                            "& .MuiFormControlLabel-label": {
                              color: isSelected ? "inherit" : "#9E9E9E",
                              transition: "color 0.2s",
                              fontSize: '14px',
                            },
                          }}
                        />
                      );
                    }) : (
                      <div style={{ 
                        padding: '10px', 
                        textAlign: 'center', 
                        color: '#9E9E9E',
                        fontSize: '14px'
                      }}>
                        {dispatchers.loading ? 'Загрузка диспетчеров...' : 
                         !Array.isArray(dispatchers.data) || dispatchers.data.length === 0 ? 'Нет доступных диспетчеров' :
                         dispatcherSearchValue ? 'Диспетчеры не найдены' : 'Введите имя диспетчера для поиска'}
                      </div>
                    )}
                  </FormGroup>
                </Box>
          </AccordionDetails>
        </Accordion>
        <Divider style={{ margin: "20px 0 20px 0" }} />
        {/* Новый блок "Округ" по аналогии с "Статус объекта" */}
        <Accordion style={{ borderRadius: "20px", margin: 0, width: "100%" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-district-content"
            sx={{
              "& .MuiAccordionSummary-content": {
              margin: 0,
              }
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <div style={{ textDecoration: "semibold", fontWeight: "700" }}>
                Округ
              </div>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              placeholder="Введите округ"
              value={districtSearchValue || ''}
              onChange={(e) => {
                setDistrictSearchValue(e.target.value);
              }}
              sx={{
                marginTop: '10px',
                padding: 0,
                width: '100%',
                '& .MuiInputBase-root': {
                  height: '28px',
                  borderRadius: '50px',
                  backgroundColor: '#F9F7F7',
                  border: 'none',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
            
            {/* Список результатов поиска округов */}
            <Box sx={{ mt: 1, maxHeight: '200px', overflowY: 'auto' }}>
              <FormGroup style={{ gap: '5px' }}>
                {filteredDistricts.length > 0 ? filteredDistricts.map((district, index) => {
                    const districtValue = district.value || district;
                    const isSelected = formik.values[FieldNames.districts]?.includes(districtValue) || false;
                    
                    return (
                      <FormControlLabel
                        key={index}
                        labelPlacement="start"
                        control={
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) => {
                              const currentDistricts = formik.values[FieldNames.districts] || [];
                              const newDistricts = e.target.checked
                                ? [...currentDistricts, districtValue]
                                : currentDistricts.filter(d => d !== districtValue);
                              formik.setFieldValue(FieldNames.districts, newDistricts);
                            }}
                            sx={{
                              color: "#9E9E9E",
                              "&.Mui-checked": {
                                color: "#0D4CD3",
                              },
                            }}
                          />
                        }
                        label={districtValue}
                        sx={{
                          margin: 0,
                          paddingTop: 0,
                          paddingBottom: 0,
                          justifyContent: "space-between",
                          "& .MuiFormControlLabel-label": {
                            color: isSelected ? "inherit" : "#9E9E9E",
                            transition: "color 0.2s",
                            fontSize: '14px',
                          },
                        }}
                      />
                    );
                  }) : (
                    <div style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      color: '#9E9E9E',
                      fontSize: '14px'
                    }}>
                      {districts.loading ? 'Загрузка округов...' : 
                       !Array.isArray(districts.data) || districts.data.length === 0 ? 'Нет доступных округов' :
                       districtSearchValue ? 'Округа не найдены' : 'Введите название округа для поиска'}
                    </div>
                  )}
                </FormGroup>
              </Box>
          </AccordionDetails>
        </Accordion>
        <Divider style={{ margin: "20px 0 20px 0" }} />

        {/* Новый блок "Район" по аналогии с "Диспетчер объекта" */}
        <Accordion style={{ borderRadius: "20px", margin: 0, width: "100%" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-rayon-content"
            sx={{
              "& .MuiAccordionSummary-content": {
              margin: 0,
              }
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <div style={{ textDecoration: "semibold", fontWeight: "700" }}>
                Район
              </div>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              placeholder="Введите район"
              value={regionSearchValue || ''}
              onChange={(e) => {
                setRegionSearchValue(e.target.value);
              }}
              sx={{
                marginTop: '10px',
                padding: 0,
                width: '100%',
                '& .MuiInputBase-root': {
                  height: '28px',
                  borderRadius: '50px',
                  backgroundColor: '#F9F7F7',
                  border: 'none',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
            
            {/* Список результатов поиска районов */}
            <Box sx={{ mt: 1, maxHeight: '200px', overflowY: 'auto' }}>
              <FormGroup style={{ gap: '5px' }}>
                {filteredRegions.length > 0 ? filteredRegions.map((region, index) => {
                    const regionValue = region.value || region;
                    const isSelected = formik.values[FieldNames.addresses]?.includes(regionValue) || false;
                    
                    return (
                      <FormControlLabel
                        key={index}
                        labelPlacement="start"
                        control={
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) => {
                              const currentRegions = formik.values[FieldNames.addresses] || [];
                              const newRegions = e.target.checked
                                ? [...currentRegions, regionValue]
                                : currentRegions.filter(r => r !== regionValue);
                              formik.setFieldValue(FieldNames.addresses, newRegions);
                            }}
                            sx={{
                              color: "#9E9E9E",
                              "&.Mui-checked": {
                                color: "#0D4CD3",
                              },
                            }}
                          />
                        }
                        label={regionValue}
                        sx={{
                          margin: 0,
                          paddingTop: 0,
                          paddingBottom: 0,
                          justifyContent: "space-between",
                          "& .MuiFormControlLabel-label": {
                            color: isSelected ? "inherit" : "#9E9E9E",
                            transition: "color 0.2s",
                            fontSize: '14px',
                          },
                        }}
                      />
                    );
                  }) : (
                    <div style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      color: '#9E9E9E',
                      fontSize: '14px'
                    }}>
                      {regions.loading ? 'Загрузка районов...' : 
                       !Array.isArray(regions.data) || regions.data.length === 0 ? 'Нет доступных районов' :
                       regionSearchValue ? 'Районы не найдены' : 'Введите название района для поиска'}
                    </div>
                  )}
                </FormGroup>
              </Box>
          </AccordionDetails>
        </Accordion>
        <Divider style={{ margin: "20px 0 20px 0" }} />
        {/* Новый блок "Адрес" по аналогии с "ID объекта" */}
        <Accordion
          style={{
            borderRadius: "20px",
            margin: 0,
            width: "100%",
            opacity: "0.3",
            backgroundColor: "#F9F7F7",
            cursor: "not-allowed",
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
              value={''}
              loading={false}
              addresses={[]}
              options={[]}
            />
          </AccordionDetails>
        </Accordion>
        </div>
      </form>
        {/* Фиксированные кнопки управления фильтрами */}
        {expanded && (
        <Box 
        className="submit-animate-container"
        sx={{ 
          flex: 1,
          display: 'flex', 
          position: 'absolute',
          left: '16px',
          width: 'calc(100% - 32px)',
          bottom: '1px',
          gap: 2, 
          justifyContent: 'space-between',
          padding: '16px 0',
          backgroundColor: '#fff',
          zIndex: 1,
          animation: 'fadeIn 0.5s ease-in-out forwards',
        }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            onClick={() => {
              formik.handleSubmit();
            }}
            sx={{
              minWidth: 120,
              height: '36px',
              backgroundColor: '#0D4CD3',
              borderRadius: '50px',
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              '&:hover': {
                backgroundColor: '#0B3BA8',
              },
            }}
          >
            Применить
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              formik.resetForm();
              setFilterValues({});
              setCheckedState({
                itp: true,
                mkd: true,
              });
              setDateRange([0, 5]);
              setPeriodType("месяц");
              setDispatcherSearchValue('');
              setDistrictSearchValue('');
              setRegionSearchValue('');
              setIdSearchValue('');
              // Сбрасываем выбранные фильтры
              setSelectedFilters({
                id: '',
                district: '',
                region: '',
                dispatcher: '',
                status: []
              });
              // Отправляем GET запрос с пустыми параметрами как при старте приложения
              updateITPData({});
            }}
            sx={{
              minWidth: 120,
              borderColor: '#9CA3AF',
              color: '#9CA3AF',
              height: '36px',
              borderRadius: '50px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              '&:hover': {
                borderColor: '#0D4CD3',
                backgroundColor: 'rgba(13, 76, 211, 0.04)',
              },
            }}
          >
            Сбросить всё
          </Button>
        </Box>
      )}
      <div style={{ position: 'relative' }} id='filters-block-wrapper'/>
    </React.Fragment>
  );

  return <Box className="filters">{card}</Box>;
}
export default Filters;
