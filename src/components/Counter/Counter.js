import "./Counter.css";

function Counter(props) {
  const { quantity } = props;

  let color;
  if (quantity > 100) {
    color = "red";
  } else if (quantity > 50) {
    color = "purple";
  } else {
    color = "blue";
  }

  return (
    <div className="counter">
      <p className={`counter__quantity counter__quantity_color_${color}`}>{ quantity }</p>
      <p className="counter__text">поездов в пути</p>
    </div>
  );
}

export default Counter;
