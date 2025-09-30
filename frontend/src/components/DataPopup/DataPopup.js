import "./DataPopup.css";

function DataPopup(props) {
  const { position, isVisible, markup } = props;

  return (
    <div className={`data-popup data-popup_position_${position} ${isVisible ? "" : "data-popup__hidden"}`}>
      {markup}
    </div>
  );
}

export default DataPopup;
