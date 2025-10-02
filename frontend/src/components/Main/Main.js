import DataPopup from "../DataPopup/DataPopup";
import Map from "../Map/Map";
import TrainCarriages from "../TrainCarriages/TrainCarriages";
import TrainRoute from "../TrainRoute/TrainRoute";
import "./Main.css";
import React, {useMemo, useState} from "react";
import {useClickOutside} from "../../hooks/useClickOutside";
import {MainContext} from "./context";
import { useData } from "../Filters/components/DataContext/DataContext";

function Main({setCoordinatesPoint, selectedCrossingFilters, filterNames}) {
  const [train, setTrain] = useState({});
  const { testData } = useData()

    const handleMapClick = () => {
        if (Object.keys(train).length) {
          setTrain({});
        }
    }

   const ref = useClickOutside(handleMapClick);

    const handleTrainClick = (train) => {
      setTrain(train);
  }

  const contextValue = useMemo(() => ({ selectedTrain: train.train_index }), [train.train_index]);

  return (
    <main className="main">
        <MainContext.Provider value={contextValue}>
          <Map 
            data={testData} 
            handleTrainClick={handleTrainClick} 
            handleMapClick={handleMapClick} 
            setCoordinatesPoint={setCoordinatesPoint}
            selectedCrossingFilters={selectedCrossingFilters}
            filterNames={filterNames}
          />
        </MainContext.Provider>
        <div ref={ref}>
            <DataPopup
              position="left"
              isVisible={(Object.keys(train).length !== 0) ? true : false}
              markup={ <TrainRoute train={train} /> }
            />
            <DataPopup
              position="right"
              isVisible={(Object.keys(train).length !== 0) ? true : false}
              markup={<TrainCarriages train={train} />}
            />
        </div>
    </main>
  );
}

export default React.memo(Main);
