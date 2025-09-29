import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';

import "./Filter.css";
import {useFormik} from "formik";
import { AddressesField } from "./components/AddressesField/AddressesField"
import useFetch from "../../hooks/useFetch";
import {useMemo, useState, useEffect, useRef} from "react";
import {CadastralsField} from "./components/CadastralField/CadastralField";
import {AreaField} from "./components/AreaField/AreaField";
import {DistrictField} from "./components/DistrictField/DistrictField";
import { getOptionsAndMap, getFilterOptions, formatCrossingFilters} from "./utils";
import {FieldNames} from "./constant";
import { useData } from './components/DataContext/DataContext';
import {Slider, Switch} from "@mui/material";

 function Filters({coordinatesPoint, setSelectedCrossingFilters, setFilterNames}) {
    const { setTestData } = useData()
    const [localData, setLocalData] = useState(null)
     const [byPoint, setByPoint] = useState(false)
     const [range, setRange] = useState(false)

    const [submitCode, setSubmitCode] = useState(null);
    const areas = useFetch('http://178.20.44.143:8080/navigation/filters/areas');
    const addresses = useFetch('http://178.20.44.143:8080/navigation/filters/addresses');
    const cadastrals = useFetch('http://178.20.44.143:8080/navigation/filters/cadastrals');
    const districts = useFetch('http://178.20.44.143:8080/navigation/filters/districts');
    const crossingFilters = useFetch('http://178.20.44.143:8080/crossing/filters/')
    
    const areasData = useMemo(() => getOptionsAndMap(areas), [areas]);
    const districtData = useMemo(() => getOptionsAndMap(districts), [districts]);
    const addressesData = useMemo(() => getOptionsAndMap(addresses), [addresses]);
    const cadastralData = useMemo(() => getOptionsAndMap(cadastrals), [cadastrals]);
    const crossingFiltersData = useMemo(() => getFilterOptions(crossingFilters), [crossingFilters]);

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
            const res = await fetch('http://178.20.44.143:8080/polygons/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: submitCode,
            });
            if (!res.ok) {
                throw new Error('Response is not ok')
            }
            const data = await res.json()
            setLocalData(data)
        } catch (error) {
            console.error('Error: ', error)
        }
    }
    
    const formik = useFormik({
        initialValues: {
            [FieldNames.areas]: [],
            [FieldNames.addresses]: [],
            [FieldNames.cadastrals]: [],
            [FieldNames.districts]: [],
            [FieldNames.crossingFilters]: {},
        },
        onSubmit: (values) => {
            const data = byPoint ? {...values, radiusSearch: {lon: coordinatesPoint.lng, lat: coordinatesPoint.lat, radius: Number(range)/111111}} : values
            setSelectedCrossingFilters(data.crossingFilters)
            const tmp = {}
            crossingFiltersData.map.forEach((value, key) => {
                tmp[value.key] = key
            })
            setFilterNames(tmp)
            try {
                fetch('http://178.20.44.143:8080/polygons/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }).then((res) => res.json().then((d) => {
                    setLocalData(d);
                }))
            } catch (error) {
                console.error('Error: ', error)
            }
        }
    });

    useEffect(() => {
        if (submitCode) {
            sendPostRequest(submitCode)
        }
    }, [submitCode])

    useEffect(() => {
        setTestData(localData)
    }, [localData])

    const handleCheckboxChange = (option, key, isChecked) => {
        setFilterValues(prevValues => ({
          ...prevValues,
          [option]: {
            isChecked,
            value: isChecked ? 0 : null
          }
        }));
        formik.setFieldValue(`crossingFilters.${key}`, 0)
    };

    const handleRadioChange = (option, key, newValue) => {
        setFilterValues(prevValues => ({
          ...prevValues,
          [option]: {
            ...prevValues[option],
            value: newValue
          }
        }));
        formik.setFieldValue(`crossingFilters.${key}`, newValue)
      };

    const card = (
        <React.Fragment>
            <form onSubmit={formik.handleSubmit} className='form'>
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
                                formik.setFieldValue(FieldNames.districts, newValue)
                            }}
                            options={districtData.options}
                            loading={districts.loading}
                            areas={districtData.map}
                        />
                        {/* <label htmlFor="areas">Поиск по округам</label> */}
                        <AreaField
                            values={formik.values.areas}
                            onChange={(_, newValue) => {
                                formik.setFieldValue(FieldNames.areas, newValue)
                            }}
                            options={areasData.options}
                            loading={areas.loading}
                            areas={areasData.map}
                        />
                    </div>
                    
                    <div className="form-field-group">
                        <p className="form-field-group-title">Пересечения с территориями</p>
                        {crossingFiltersData.options.map(option => {
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
                                            onChange={(e) => handleCheckboxChange(option, key, e.target.checked)}
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
                                    {isChecked &&
                                        <div className="form-field-group-radios">
                                            <div>
                                                <label className="form-field-group-radio-label">
                                                    <p className="form-field-group-text">Строгое исключение</p>
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
                                                    <p className="form-field-group-text">Допустимое пересечение</p>
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
                                                    <p className="form-field-group-text">Отсутствие влияния</p>
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
                                    }
                                </div>
                            );
                        })}
                    </div>

                    <div className="form-field-group">
                        <Box display={'flex'} style={{alignItems: "center"}}>
                            <p className="form-field-group-title">Поиск по точке</p>
                            <Switch value={byPoint} onChange={(_, newValue) => {setByPoint(newValue)}}/>
                        </Box>
                        {byPoint && <Box>
                            Координаты точки:
                            <Box>
                                <p className='by-point-coords'><span style={{fontWeight: "600", color: "#2196F3"}}>[lng]</span> {coordinatesPoint.lng}</p>
                                <p className='by-point-coords'><span style={{fontWeight: "600", color: "#2196F3"}}>[lat]</span> {coordinatesPoint.lat}</p>
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
                        </Box>}
                    </div>
                    
                    <div class="form-button-container">
                        <Button variant="contained" class="form-button" type="submit">Найти участки</Button>
                    </div>
                    {/* <button class="form-button" type="submit">Submit</button> */}
                </Box>
            </form>
        </React.Fragment>
    );

    return (
        <Box className="filters">
            <Card className="filters-card" variant="outlined">{card}</Card>
        </Box>
    );
}
export default Filters;