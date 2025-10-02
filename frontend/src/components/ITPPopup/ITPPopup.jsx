import React from 'react';
import './ITPPopup.css';

const ITPPopup = ({ itpData }) => {
  // Функция для получения класса статуса
  const getStatusClass = (status) => {
    if (!status) return 'status-неизвестно';
    return `status-${status.toLowerCase()}`;
  };

  const statusClass = getStatusClass(itpData.status);

  return (
    <div className={`itp-popup ${statusClass}`}>
      <div className={`itp-popup-header ${statusClass}`}>
        <h3 className="itp-popup-title">ИТП</h3>
        <div className="itp-popup-id">ID: {itpData.id}</div>
      </div>
      
      <div className="itp-popup-content">
        <div className="itp-info-row">
          <span className="itp-label">Район:</span>
          <span className="itp-value">{itpData.district}</span>
        </div>
        
        <div className="itp-info-row">
          <span className="itp-label">Регион:</span>
          <span className="itp-value">{itpData.region}</span>
        </div>
        
        <div className="itp-info-row">
          <span className="itp-label">Диспетчер:</span>
          <span className="itp-value">{itpData.dispatcher}</span>
        </div>
        
        <div className="itp-info-row">
          <span className="itp-label">Статус:</span>
          <span className="itp-value" style={{ color: getStatusColor(itpData.status) }}>
            {itpData.status}
          </span>
        </div>
        
        <div className="itp-coordinates">
          <div className="itp-coordinate">
            <span className="itp-coord-label">Широта:</span>
            <span className="itp-coord-value">{itpData.latitude.toFixed(6)}</span>
          </div>
          <div className="itp-coordinate">
            <span className="itp-coord-label">Долгота:</span>
            <span className="itp-coord-value">{itpData.longitude.toFixed(6)}</span>
          </div>
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

export default ITPPopup;
