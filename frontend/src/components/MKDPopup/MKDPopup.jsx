import React from 'react';
import './MKDPopup.css';

const MKDPopup = ({ mkdData }) => {
  // Функция для получения класса статуса
  const getStatusClass = (status) => {
    if (!status) return 'status-неизвестно';
    return `status-${status.toLowerCase()}`;
  };

  const statusClass = getStatusClass(mkdData.status);

  return (
    <div className={`mkd-popup ${statusClass}`}>
      <div className={`mkd-popup-header ${statusClass}`}>
        <h3 className="mkd-popup-title">МКД</h3>
        <div className="mkd-popup-id">ID: {mkdData.id}</div>
      </div>
      
      <div className="mkd-popup-content">
        <div className="mkd-info-row">
          <span className="mkd-label">Район:</span>
          <span className="mkd-value">{mkdData.district}</span>
        </div>
        
        <div className="mkd-info-row">
          <span className="mkd-label">Регион:</span>
          <span className="mkd-value">{mkdData.region}</span>
        </div>
        
        <div className="mkd-info-row">
          <span className="mkd-label">Адрес:</span>
          <span className="mkd-value">{mkdData.street} {mkdData.house_number}</span>
        </div>
        
        <div className="mkd-info-row">
          <span className="mkd-label">Индекс:</span>
          <span className="mkd-value">{mkdData.index}</span>
        </div>
        
        <div className="mkd-stats">
          <div className="mkd-stat-item">
            <div className="mkd-stat-value">{mkdData.residents_amount}</div>
            <div className="mkd-stat-label">Жителей</div>
          </div>
          
          <div className="mkd-stat-item">
            <div className="mkd-stat-value">{mkdData.floors_amount}</div>
            <div className="mkd-stat-label">Этажей</div>
          </div>
        </div>
        
        <div className="mkd-coordinates">
          <div className="mkd-coordinate">
            <span className="mkd-coord-label">Широта:</span>
            <span className="mkd-coord-value">{mkdData.latitude.toFixed(6)}</span>
          </div>
          <div className="mkd-coordinate">
            <span className="mkd-coord-label">Долгота:</span>
            <span className="mkd-coord-value">{mkdData.longitude.toFixed(6)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MKDPopup;
