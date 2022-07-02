import { useEffect, useState } from "react";

export const useHtmlWidth = () => {
  const [htmlWidth, setHtmlWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const onResize = () => {
    const width = window.innerWidth;
    setHtmlWidth(width);
  };

  return { htmlWidth };
};
