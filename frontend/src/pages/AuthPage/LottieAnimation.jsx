import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import animationData from "./SignInSuccessful.lottie";

const LottieAnimation = ({ style }) => (
  <DotLottieReact src={animationData} autoplay />
);

export default LottieAnimation;
