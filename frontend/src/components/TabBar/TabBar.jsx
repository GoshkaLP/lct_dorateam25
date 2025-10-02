import React from 'react';
import './TabBar.css';
import houseIcon from '../../images/maps-markers/house_icon.svg';
import itpIcon from '../../images/maps-markers/itp_icon.svg';
import AltRouteIcon from '@mui/icons-material/AltRoute';

const TabBar = ({ activeLayers, onLayerToggle }) => {
  return (
    <div className="tabbar-container">
      <div className="tabbar">
        <button
          className={`tab-button ${activeLayers.itp ? 'active' : ''}`}
          onClick={() => onLayerToggle('itp')}
        >
          <div className="tab-icon itp-icon">
            <img src={itpIcon} alt="ITP" />
          </div>
          <span className="tab-label">ИТП</span>
        </button>
                <button
          className={`tab-button ${activeLayers.lines ? 'active' : ''}`}
          onClick={() => onLayerToggle('lines')}
        >
          <div className="tab-icon lines-icon" style={{rotate: '90deg'}}>
          <AltRouteIcon/>
          </div>
          {/* <span className="tab-label">Участки</span> */}
        </button>
        <button
          className={`tab-button ${activeLayers.mkd ? 'active' : ''}`}
          onClick={() => onLayerToggle('mkd')}
        >
          <div className="tab-icon mkd-icon">
            <img src={houseIcon} alt="MKD" />
          </div>
          <span className="tab-label">МКД</span>
        </button>
        

      </div>
    </div>
  );
};

export default TabBar;
