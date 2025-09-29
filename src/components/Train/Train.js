import Railway from "../Railway/Railway";
import {Marker, Popup} from "react-leaflet";
import L from "leaflet";
import classNames from "classnames";
import React, {useState, useRef, useContext} from "react";
import {MainContext} from "../Main/context";

const Train = ({ train, onClick }) => {
    const contextValue = useContext(MainContext);
    const [isShowPath, setIsShowPath] = useState(false);
    const ref = useRef(null);
    const handleClick = () => {
        setIsShowPath(!isShowPath);
        onClick(train);
    }
    return (
        <div>
            {isShowPath ? train.stations.map((station, index, array) => {
                return array[index + 1] ? (
                    <Railway
                        key={`${train.train_index} - ${station.station_id} - ${index}`}
                        citiesCoordinates={[[station.latitude, station.longitude], [array[index + 1].latitude, array[index + 1].longitude]]}
                    />
                ) : null;
                }
            ) : null}
            <div ref={ref}>
                <Marker
                    position={[train.latitude, train.longitude]}
                    icon={L.divIcon({
                        className: classNames('custom-marker', { 'selected-marker': contextValue.selectedTrain === train.train_index, }),
                        // html: `<div class="marker-content">${train.train_index}</div>`
                    })}
                    eventHandlers={{
                        click: handleClick,
                    }}
                >
                    <Popup>
                        <div>
                            <h3>Train {train.train_index}</h3>
                            <p>Current Station: {train.current_station_id}</p>
                            <p>Current Time: {train.current_time}</p>
                        </div>
                    </Popup>
                </Marker>
            </div>
        </div>
    )
}

export default Train;