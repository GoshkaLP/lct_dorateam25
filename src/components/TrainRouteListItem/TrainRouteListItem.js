import "./TrainRouteListItem.css";

function TrainRouteListItem(props) {
  const { station } = props;
  return (
    <li className="train-route__list-item">
      <p className="train-route__list-item-time">{station.station_time.substring(station.station_time.length - 8, station.station_time.length - 3)}</p>
      <div>
        <h3 className="train-route__list-item-title">{`Станция ${station.station_id}`}</h3>
        <p className="train-route__list-item-railway">Путь 1</p>
      </div>
    </li>
  );
}

export default TrainRouteListItem;
