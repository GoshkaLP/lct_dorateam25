import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import doraTeam from "../../images/android-chrome-512x512.png";
import style from "./style.module.css";
import LottieAnimation from "./LottieAnimation";
import { useUserProfile } from "../../store/UserProfile";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const { setIsAuth, isAuth } = useUserProfile();
  const navigate = useNavigate();
  const [showLottie, setShowLottie] = useState(false);
  const [wrapperCn, setWrapperCn] = useState(style.authpage);
  const [avatarCn, setAvatarCn] = useState(
    `${style.pulse} ${style["pulse-animated"]}`
  );
  const [avatarAnimDuration, setAvatarAnimDuration] = useState("3s");
  const handleClickAuth = () => {
    setAvatarCn(`${style.pulse} ${style["fade-unmount-exit"]}`);
    setTimeout(() => setShowLottie(true), 200);
    setTimeout(
      () => setWrapperCn(`${style.authpage} ${style["fade-unmount-exit"]}`),
      3000
    );
    setAvatarAnimDuration("500ms");
    setTimeout(() => {
      navigate("/", { replace: true });
      setIsAuth(true);
    }, 4000);
  };

  return (
    <div className={wrapperCn} style={{ animationDuration: `3000ms` }}>
      {showLottie ? (
        <div className={style["lottie-wrapper"]}>
          <LottieAnimation style={{ width: 128, height: 128 }} />
        </div>
      ) : (
        <div
          className={avatarCn}
          style={{ animationDuration: avatarAnimDuration }}
        >
          <Avatar
            alt="Dorateam"
            src={doraTeam}
            sx={{
              width: 256,
              height: 256,
              position: "absolute",
              left: 0,
              top: 0,
            }}
            onClick={handleClickAuth}
          />
        </div>
      )}
    </div>
  );
};

export default AuthPage;
