import React from 'react';
import './LinePopup.css';

const LinePopup = ({ lineData, isSelected = false }) => {
  // Функция для получения класса статуса
  const getStatusClass = (status) => {
    if (!status) return 'status-неизвестно';
    return `status-${status.toLowerCase()}`;
  };

  const statusClass = getStatusClass(lineData.status);

  return (
    <div className={`line-popup ${statusClass}`}>
      <div className={`line-popup-header ${statusClass}`}>
        <h3 className="line-popup-title">Участок</h3>
        <div className="line-popup-id">ID: {lineData.id}</div>
      </div>
      
      <div className="line-popup-content">
        <div className="line-info-row">
          <span className="line-label">ITP ID:</span>
          <span className="line-value">{lineData.itp_id || 'Не указан'}</span>
        </div>
        
        <div className="line-info-row">
          <span className="line-label">Статус:</span>
          <span className="line-value" style={{ color: getStatusColor(lineData.status) }}>
            {lineData.status || 'Неизвестно'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Функция для получения цвета статуса
const getStatusColor = (status) => {
  const statusColors = {
    'Зеленый': '#28a745',
    'Оранжевый': '#fd7e14',
    'Желтый': '#F6C84E',
    'Красный': '#dc3545',
    'Синий': '#007bff',
    'Неизвестно': 'rgb(108, 117, 125)'
  };
  return statusColors[status] || statusColors['Неизвестно'];
};

export default LinePopup;
