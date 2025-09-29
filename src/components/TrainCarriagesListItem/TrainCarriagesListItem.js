import trainCarriagesListItemArrow from "../../images/train-carriages-list-item-arrow.svg";
import "./TrainCarriagesListItem.css";

function TrainCarriagesListItem(props) {
  const { carriage } = props;

  return (
    <li className="train-carriages__list-item">
      <h3 className="train-carriages__list-item-title">{`Вагон ${carriage.carriage_id}`}</h3>

      <div className="train-carriages__list-item-way">
        <p className="train-carriages__list-item-way-point">{`Станция ${carriage.station_from_id}`}</p>
        <img className="train-carriages__list-item-arrow" src={trainCarriagesListItemArrow} alt="Стрелка" />
        <p className="train-carriages__list-item-way-point">{`Станция ${carriage.station_to_id}`}</p>
      </div>
    </li>
  );
}

export default TrainCarriagesListItem;