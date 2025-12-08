import { useEffect, useState } from "react";
import Button from "../components/Button";
import { useCharacterAnimations } from "../context/CharAnimation";

const Interface = () => {
  const { isPlayButton, animations, setAnimationIndex } =
    useCharacterAnimations();
  const [showComponents, setShowComponents] = useState(false);

  useEffect(() => {
    // let timeout: NodeJS.Timeout;
    let timeout: ReturnType<typeof setTimeout>;
    if (isPlayButton) {
      timeout = setTimeout(() => {
        setShowComponents(true);
      }, 6000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isPlayButton]);

  const renderButtonLabel = (animation: string) => {
    switch (animation) {
      case "Hi":
        return "Say Hi";
      case "Dance":
        return "Let's Dance";
      case "moonwalk":
        return "How to use the site?";
      default:
        return animation;
    }
  };

  const displayIndices = [0, 1, 5];

  return (
    <div
      className={`relative w-full flex justify-center transition-opacity duration-1000 ${
        showComponents ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="grid grid-cols-2 grid-flow-row gap-4">
        {displayIndices.map((index, idx) => (
          <Button
            key={animations[index]}
            onClick={() => setAnimationIndex(index)}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition ${
              idx === 2 ? "col-span-2 text-center mb-4" : ""
            }`}
          >
            {renderButtonLabel(animations[index])}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Interface;
