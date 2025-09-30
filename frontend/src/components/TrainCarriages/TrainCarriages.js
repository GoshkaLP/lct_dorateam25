import TrainCarriagesListItem from "../TrainCarriagesListItem/TrainCarriagesListItem";
import "./TrainCarriages.css";

function TrainCarriages(props) {
  const { train } = props;

  return (
    <div className="train-carriages">
      { Object.keys(train).length && (
        <>
          <div className="train-carriages__general-info">
            <p className="train-carriages__title">Вагоны: {train.carriage.length}</p>
            <p className="train-carriages__text">Общий вес: 100 тонн</p>
          </div>
          <div className="train-carriages-separator"></div>
          <div className="train-carriages__list-container">
            <ul className="train-carriages__list">
              {train.carriage.map((carriage) => {
                return <TrainCarriagesListItem carriage={carriage} />;
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default TrainCarriages;
