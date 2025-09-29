import React from "react";
import { Link } from "react-router-dom";
import profile from "../../images/header/profile_icon.png";
import "./Header.css";
import { MAIN_HEADER_MENU } from "../../const/const";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../../const/const";
import { useUserProfile } from "../../store/UserProfile";

const Header = () => {
  const location = useLocation();
  const { data } = useUserProfile();

  return (
    <div className="header__container">
      <div className="pages">
        {MAIN_HEADER_MENU.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              textDecoration:
                location.pathname === item.path ? "underline" : "none",
              color: "inherit",
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <Link
        to={ROUTES.ACCOUNT}
        style={{
          textDecoration:
            location.pathname === ROUTES.ACCOUNT ? "underline" : "none",
          color: "inherit",
        }}
      >
        <div className="profile">
          <p>{data?.name}</p>
          <img src={profile} alt="profile icon" />
        </div>
      </Link>
    </div>
  );
};

export default Header;
