import React, { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { useData } from "../Filters/components/DataContext/DataContext";
import style from "./style.module.css";
import { Divider } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';

const Analytics = () => {
  const { rectangle, itpData, selectedObjects } = useData();
  const [selectedCount, setSelectedCount] = useState(0);
  const [statusStats, setStatusStats] = useState({});
  const [categoryStats, setCategoryStats] = useState({});

  // Функция для проверки, находится ли точка внутри прямоугольника
  const isPointInRectangle = (point, rect) => {
    if (!rect || !point) return false;
    
    const { _southWest, _northEast } = rect;
    const { latitude, longitude } = point;
    
    return (
      latitude >= _southWest.lat &&
      latitude <= _northEast.lat &&
      longitude >= _southWest.lng &&
      longitude <= _northEast.lng
    );
  };

  // Функция для группировки статусов по категориям
  const getStatusCategory = (status) => {
    switch (status) {
      case 'Зеленый':
        return 'normal';
      case 'Желтый':
        return 'deviations';
      case 'Оранжевый':
        return 'actions';
      default:
        return 'unknown';
    }
  };

  // Подсчет объектов внутри прямоугольника и статистики по статусам
  useEffect(() => {
    if (rectangle && itpData.data && Array.isArray(itpData.data)) {
      const selectedObjects = itpData.data.filter(item => {
        if (!item.latitude || !item.longitude) return false;
        return isPointInRectangle(
          { latitude: item.latitude, longitude: item.longitude },
          rectangle
        );
      });
      
      setSelectedCount(selectedObjects.length);
      
      // Подсчет статистики по статусам
      const stats = {};
      selectedObjects.forEach(item => {
        const status = item.status || 'Неизвестно';
        stats[status] = (stats[status] || 0) + 1;
      });
      setStatusStats(stats);
      
      // Подсчет статистики по категориям
      const categories = {
        normal: 0,      // Зеленый - в норме
        deviations: 0,  // Желтый - отклонения
        actions: 0,     // Оранжевый - требуют действий
        unknown: 0      // Остальные
      };
      
      selectedObjects.forEach(item => {
        const status = item.status || 'Неизвестно';
        const category = getStatusCategory(status);
        categories[category]++;
      });
      
      // Вычисляем проценты
      const total = selectedObjects.length;
      const categoryPercentages = {};
      Object.keys(categories).forEach(category => {
        categoryPercentages[category] = total > 0 ? Math.round((categories[category] / total) * 100) : 0;
      });
      
      setCategoryStats(categoryPercentages);
    } else {
      setSelectedCount(0);
      setStatusStats({});
      setCategoryStats({});
    }
  }, [rectangle, itpData.data]);

  // Подготовка данных для диаграммы
  const chartData = useMemo(() => {
    return [
      {
        name: 'В норме',
        value: categoryStats.normal || 0,
        fill: '#15AD70'
      },
      {
        name: 'Отклонения',
        value: categoryStats.deviations || 0,
        fill: '#F6C84E'
      },
      {
        name: 'Требуют действий',
        value: categoryStats.actions || 0,
        fill: '#E15E42'
      },
      {
        name: 'Неизвестно',
        value: categoryStats.unknown || 0,
        fill: '#6c757d'
      }
    ].filter(item => item.value > 0); // Показываем только категории с данными
  }, [categoryStats]);

  // Подготовка данных для линейного графика потребления воды
  const waterConsumptionChartData = useMemo(() => {
    if (!rectangle || !itpData.data || !Array.isArray(itpData.data)) {
      return [];
    }

    // Получаем выбранные ИТП с данными о потреблении воды
    const selectedItpObjects = itpData.data.filter(item => {
      if (!item.latitude || !item.longitude) return false;
      return isPointInRectangle(
        { latitude: item.latitude, longitude: item.longitude },
        rectangle
      );
    });

    if (selectedItpObjects.length === 0) {
      return [];
    }

    // Фильтруем только объекты с данными о потреблении воды
    const objectsWithWaterData = selectedItpObjects.filter(item => item.water_consumption);
    
    if (objectsWithWaterData.length === 0) {
      return [];
    }

    // Создаем массив дат: от -3 дней до +3 дней от текущей даты
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Сбрасываем время для корректного сравнения дат
    
    const generateDateRange = () => {
      const dates = [];
      
      // Добавляем 3 дня назад до 3 дней вперед
      for (let i = -3; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
      }
      
      return dates;
    };

    const dates = generateDateRange();
    
    const chartData = dates.map(date => {
      const dateStr = date.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit' 
      });
      const dataPoint = { date: dateStr };
      const isFuture = date > today;
      
      objectsWithWaterData.forEach((itp, index) => {
        const itpKey = `ИТП ${itp.id || index + 1}`;
        
        if (isFuture) {
          // Для будущих дат не показываем фактические данные
          dataPoint[itpKey] = null;
        } else {
          // Для исторических дат генерируем фактические данные
          const seed = (itp.id || index + 1).toString().charCodeAt(0);
          const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
          const randomFactor = Math.sin(seed + dayOfYear) * 0.03 + 0.97; // от 0.94 до 1.0 (меньший разброс)
          
          // Базовое потребление зависит от дня недели (выходные меньше)
          const dayOfWeek = date.getDay();
          const baseConsumption = dayOfWeek === 0 || dayOfWeek === 6 ? 0.18 : 0.22; // Ближе друг к другу
          
          const consumption = baseConsumption * randomFactor;
          dataPoint[itpKey] = Math.round(consumption * 1000) / 1000;
        }
      });
      
      return dataPoint;
    });

    // Вычисляем скользящую среднюю и прогноз для каждой линии ИТП
    const addTrendLines = (data) => {
      const trendData = [...data];
      
      objectsWithWaterData.forEach((itp, index) => {
        const itpKey = `ИТП ${itp.id || index + 1}`;
        const trendKey = `Тренд ${itp.id || index + 1}`;
        
        for (let i = 0; i < data.length; i++) {
          const currentDate = dates[i];
          const isFuture = currentDate > today;
          const isToday = currentDate.getTime() === today.getTime();
          
          if (isFuture || isToday) {
            // Для текущей и будущих дат генерируем прогноз на основе исторических данных
            const historicalData = data.slice(0, i).map(d => d[itpKey]).filter(val => val !== null);
            
            if (historicalData.length >= 2) {
              // Простой линейный тренд на основе последних данных
              const recentData = historicalData.slice(-3); // Берем последние 3 точки
              const avg = recentData.reduce((sum, val) => sum + val, 0) / recentData.length;
              
              // Добавляем небольшую случайную вариацию для реалистичности
              const seed = (itp.id || index + 1).toString().charCodeAt(0);
              const dayOfYear = Math.floor((currentDate - new Date(currentDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
              const variation = Math.sin(seed + dayOfYear) * 0.02; // ±2% вариация (меньший разброс)
              
              // Учитываем день недели для прогноза
              const dayOfWeek = currentDate.getDay();
              const dayFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.9 : 1.0; // Меньшая разница между выходными и буднями
              
              trendData[i][trendKey] = Math.round((avg * (1 + variation) * dayFactor) * 1000) / 1000;
            } else {
              // Если нет исторических данных, используем базовое значение
              const dayOfWeek = currentDate.getDay();
              const baseConsumption = dayOfWeek === 0 || dayOfWeek === 6 ? 0.18 : 0.22; // Ближе друг к другу
              trendData[i][trendKey] = Math.round(baseConsumption * 1000) / 1000;
            }
          } else {
            // Для исторических данных не показываем тренды (только фактические данные)
            trendData[i][trendKey] = null;
          }
        }
      });
      
      // Добавляем общую линию тренда, выходящую из последней точки
      const addOverallTrendLine = (data) => {
        const trendData = [...data];
        
        // Находим последнюю точку с данными (текущая дата)
        const lastDataIndex = data.findIndex(d => d.date === today.toLocaleDateString('ru-RU', { 
          day: '2-digit', 
          month: '2-digit' 
        }));
        
        if (lastDataIndex !== -1) {
          // Вычисляем средний расход за предыдущие сутки для всех ИТП
          const historicalData = data.slice(0, lastDataIndex + 1);
          const allHistoricalValues = [];
          
          historicalData.forEach(dataPoint => {
            objectsWithWaterData.forEach((itp, index) => {
              const itpKey = `ИТП ${itp.id || index + 1}`;
              if (dataPoint[itpKey] !== null) {
                allHistoricalValues.push(dataPoint[itpKey]);
              }
            });
          });
          
          if (allHistoricalValues.length > 0) {
            const avgConsumption = allHistoricalValues.reduce((sum, val) => sum + val, 0) / allHistoricalValues.length;
            
            // Создаем прямую линию тренда, выходящую из последней точки
            for (let i = lastDataIndex; i < data.length; i++) {
              const currentDate = dates[i];
              const daysFromLast = i - lastDataIndex;
              
              // Простой линейный тренд: среднее значение + небольшой наклон
              const trendValue = avgConsumption + (daysFromLast * 0.001); // Небольшой наклон
              trendData[i]['Общий тренд'] = Math.round(trendValue * 1000) / 1000;
            }
          }
        }
        
        return trendData;
      };
      
      return addOverallTrendLine(trendData);
    };

    return addTrendLines(chartData);
  }, [rectangle, itpData.data]);

  // Расчет масштаба графика на основе данных выбранных ИТП
  const chartScale = useMemo(() => {
    if (waterConsumptionChartData.length === 0) {
      return { min: 0, max: 1 };
    }

    let minValue = Infinity;
    let maxValue = -Infinity;

    // Находим минимальное и максимальное значения среди всех данных
    waterConsumptionChartData.forEach(dataPoint => {
      Object.keys(dataPoint).forEach(key => {
        if (key !== 'date' && typeof dataPoint[key] === 'number') {
          minValue = Math.min(minValue, dataPoint[key]);
          maxValue = Math.max(maxValue, dataPoint[key]);
        }
      });
    });

    // Добавляем отступы для лучшего отображения (10% сверху и снизу)
    const padding = (maxValue - minValue) * 0.1;
    const adjustedMin = Math.max(0, minValue - padding);
    const adjustedMax = maxValue + padding;

    return {
      min: Math.round(adjustedMin * 1000) / 1000,
      max: Math.round(adjustedMax * 1000) / 1000
    };
  }, [waterConsumptionChartData]);

  // Цвета для линий графика
  const lineColors = ['#0D4CD3', '#15AD70', '#F6C84E', '#E15E42', '#6c757d', '#9C27B0', '#FF5722', '#795548'];
  const overallTrendColor = '#FF6B35'; // Оранжевый цвет для общей линии тренда


  return (
    <Box className={style.analytics}>
      <Typography component="span" gutterBottom style={{ fontSize: "14px", color: "#9E9E9E" }}>
        {selectedCount === 0 ? "Ничего не выбрано" :
         selectedCount === 1 ? (
           <>Выбран <span style={{ color: "#0D4CD3", fontWeight: "bold" }}>{selectedCount}</span> объект</>
         ) :
         selectedCount > 4 ? (
           <>Выбрано <span style={{ color: "#0D4CD3", fontWeight: "bold" }}>{selectedCount}</span> объектов</>
         ) : 
         <>Выбрано <span style={{ color: "#0D4CD3", fontWeight: "bold" }}>{selectedCount}</span> объекта</>
        } 
      </Typography>
       <Divider style={{ margin: "20px 0 20px 0" }} />
        {rectangle && (
          <Box>
            <Typography variant="body2" color="text.secondary" style={{ marginBottom: "16px" }}>
              Распределение по статусам
            </Typography>
            <Grid container spacing={2} style={{ minHeight: "250px" }}>
              <Grid item xs={7.2} style={{ width: "60%", paddingLeft: 0, display: "flex" }} 
              id="analytics-diagramm-block-diagramm">
                <Box style={{ height: "100%", width: "100%", padding: "0", minHeight: "200px" }}>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{
                          top: 10,
                          right: 10,
                          left: 10,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={{ stroke: '#e0e0e0' }}
                          tickLine={{ stroke: '#e0e0e0' }}
                          height={30}
                          tick={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 11 }}
                          axisLine={{ stroke: '#e0e0e0' }}
                          tickLine={{ stroke: '#e0e0e0' }}
                          width={30}
                          domain={[0, 100]}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Процент']}
                          labelStyle={{ color: '#333' }}
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center" 
                      height="100%"
                      color="#9E9E9E"
                      fontSize="14px"
                    >
                      Нет данных для отображения
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={4.8} style={{ width: "40%" }} 
              id="analytics-diagramm-block-status-list">
                <Box style={{ 
                  minHeight: "100px"
                }}>
                    <Box>
                      {categoryStats.normal > 0 && (
                        <Typography variant="body2" style={{ 
                          marginBottom: "8px", 
                          fontSize: "12px",
                          color: "#000000"
                        }}>
                          <span style={{ color: "#28a745", fontWeight: "bold" }}>{categoryStats.normal}%</span> объектов в норме
                        </Typography>
                      )}
                      {categoryStats.deviations > 0 && (
                        <Typography variant="body2" style={{ 
                          marginBottom: "8px", 
                          fontSize: "12px",
                          color: "#000000"
                        }}>
                          <span style={{ color: "#F6C84E", fontWeight: "bold" }}>{categoryStats.deviations}%</span> объектов с обнаруженными отклонениями
                        </Typography>
                      )}
                      {categoryStats.actions > 0 && (
                        <Typography variant="body2" style={{ 
                          marginBottom: "8px", 
                          fontSize: "12px",
                          color: "#000000"
                        }}>
                          <span style={{ color: "#fd7e14", fontWeight: "bold" }}>{categoryStats.actions}%</span> объектов требуют действий
                        </Typography>
                      )}
                      {categoryStats.unknown > 0 && (
                        <Typography variant="body2" style={{ 
                          marginBottom: "8px", 
                          fontSize: "12px",
                          color: "#000000"
                        }}>
                          <span style={{ color: "#6c757d", fontWeight: "bold" }}>{categoryStats.unknown}%</span> объектов с неизвестным статусом
                        </Typography>
                      )}
                    </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Блок "Прогноз потребления" */}
        {rectangle && waterConsumptionChartData.length > 0 && (
          <Box style={{ marginTop: "30px" }}>
            <Typography variant="body2" color="text.secondary" style={{ marginBottom: "16px" }}>
              Прогноз потребления воды
            </Typography>
            <Box style={{ 
              height: "300px", 
              width: "100%", 
              backgroundColor: "#fafafa", 
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              padding: "0"
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={waterConsumptionChartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={{ stroke: '#e0e0e0' }}
                    tickLine={{ stroke: '#e0e0e0' }}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    axisLine={{ stroke: '#e0e0e0' }}
                    tickLine={{ stroke: '#e0e0e0' }}
                    tick={{ fontSize: 11 }}
                    domain={[chartScale.min, chartScale.max]}
                    // label={{ value: 'м³/ч', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${value} м³/день`, name]}
                    labelStyle={{ color: '#333' }}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  {waterConsumptionChartData.length > 0 && Object.keys(waterConsumptionChartData[0])
                    .filter(key => key !== 'date')
                    .map((key, index) => {
                      const isTrendLine = key.startsWith('Тренд');
                      const isOverallTrend = key === 'Общий тренд';
                      const originalIndex = Math.floor(index / 2);
                      
                      return (
                        <Line
                          key={key}
                          type="linear"
                          dataKey={key}
                          stroke={isOverallTrend ? overallTrendColor : lineColors[originalIndex % lineColors.length]}
                          strokeWidth={isOverallTrend ? 3 : (isTrendLine ? 2 : 2)}
                          strokeDasharray={isOverallTrend ? "0" : (isTrendLine ? "5 5" : "0")}
                          dot={isOverallTrend ? { r: 5 } : (isTrendLine ? { r: 3 } : { r: 4 })}
                          activeDot={isOverallTrend ? { r: 7 } : (isTrendLine ? { r: 5 } : { r: 6 })}
                          opacity={isOverallTrend ? 1 : (isTrendLine ? 0.8 : 1)}
                          connectNulls={isTrendLine || isOverallTrend} // Для трендов соединяем null значения
                        />
                      );
                    })
                  }
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}
    </Box>
  );
};

export default Analytics;
