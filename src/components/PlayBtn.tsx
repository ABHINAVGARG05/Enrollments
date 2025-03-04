import React from "react";
import "../components/PlayBtn.css";
import { useCharacterAnimations } from "../context/CharAnimation";


const PlayBtn: React.FC = () => {
  const { isPlayButton, setIsPlayButton, setAnimationIndex } =
    useCharacterAnimations();

  const handlePlayBtnClick = () => {
    setIsPlayButton(true);
    setTimeout(() => {
      setAnimationIndex(7);
    }, 100);
  };

  return (
    <div
      className={`playBtn ${isPlayButton ? "hidden" : "opacity-100"}`}
      onClick={handlePlayBtnClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" id="play" width="119.91" height="119.91">
        <path
          fill="#CECECE"
          d="M58.8 10.8c-27.77 0-50.3 22.5-50.3 50.3 0 27.78 22.53 50.3 50.3 50.3 27.8 0 50.32-22.52 50.32-50.3 0-27.8-22.53-50.3-50.3-50.3zm0 97.97c-26.32 0-47.66-21.34-47.66-47.67 0-26.34 21.34-47.68 47.67-47.68 26.37 0 47.7 21.34 47.7 47.67 0 26.3-21.33 47.64-47.66 47.64z"
        />
        <path
          fill="#CECECE"
          d="M58.8 21.12c-22.07 0-39.97 17.9-39.97 39.98s17.9 39.98 39.98 39.98c22.1 0 40-17.9 40-39.98s-17.9-39.98-40-39.98zm3.52 50.7L43.77 82.47l.04-21.37.07-21.37 18.5 10.72 18.5 10.72L62.3 71.82z"
        />
      </svg>
    </div>
  );
};

export default PlayBtn;


