import React, { useState } from "react";
import MainSection from "../../components/Main/Main";
import Filters from "../../components/Filters/Filters";
import { RightSidebar } from "../../components";

const Main = () => {
  const [coordinatesPoint, setCoordinatesPoint] = useState({
    lng: 37.4155,
    lat: 55.7022,
  });
  const [selectedCrossingFilters, setSelectedCrossingFilters] = useState(null);
  const [filterNames, setFilterNames] = useState({});

  return (
    <main style={{ position: "relative" }}>
      <Filters
        coordinatesPoint={coordinatesPoint}
        setSelectedCrossingFilters={setSelectedCrossingFilters}
        setFilterNames={setFilterNames}
      />
      <MainSection
        setCoordinatesPoint={setCoordinatesPoint}
        selectedCrossingFilters={selectedCrossingFilters}
        filterNames={filterNames}
      />
      <RightSidebar />
    </main>
  );
};

export default Main;
