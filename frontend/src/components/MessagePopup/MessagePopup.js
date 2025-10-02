import React, {useState} from "react";

import "./MessagePopup.css";

function MessagePopup(props) {
  const { top, right, bottom, left, title, text, isTranslate } = props;
  const [isVisible, setIsVisible] = useState(true);

  const handlePopupClose = () => {
    setIsVisible(false);
    console.log(isVisible);
  }

  return (
    <div
      className={`message-popup ${isVisible ? "" : "message-popup_hidden"} ${isTranslate ? "message-popup_translated" : ""}`}
      style={{
        ...(top !== undefined && { top: `${top}` }),
        ...(right !== undefined && { right: `${right}` }),
        ...(bottom !== undefined && { bottom: `${bottom}` }),
        ...(left !== undefined && { left: `${left}` }),
      }}
    >
      <button type="button" className="message-popup__close-button" onClick={handlePopupClose} />
      <h2 className="message-popup__title">{title}</h2>
      <p className="message-popup__text">{text}</p>
    </div>
  );
}

export default MessagePopup;