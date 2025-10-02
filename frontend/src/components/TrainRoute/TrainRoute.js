import trainRouteArrow from "../../images/train-route-arrow.svg";
import TrainRouteListItem from "../TrainRouteListItem/TrainRouteListItem";
import "./TrainRoute.css";

function TrainRoute(props) {
  const { train } = props;
  return (
    <div className="train-route">
      { Object.keys(train).length && (
        <>
          <h2 className="train-route__title">{train.train_index}</h2>
          <div className="train-route__way">
            <p className="train-route__way-point">{`Станция ${train.stations[0].station_id}`}</p>
            <img className="train-route__arrow" src={trainRouteArrow} alt="Стрелка" />
            <p className="train-route__way-point">{`Станция ${train.stations[train.stations.length - 1].station_id}`}</p>
          </div>
          <div className="train-route-separator"></div>
          <div className="train-route__list-container">
            <ul className="train-route__list">
              {train.stations.map((station) => {
                return <TrainRouteListItem station={station} />;
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default TrainRoute;
