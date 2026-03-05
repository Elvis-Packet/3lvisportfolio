import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "../lib/utils";

const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = typeof words === 'string' ? words.split(" ") : [];

  useEffect(() => {
    // Only animate if there are words to animate
    if (wordsArray.length > 0 && scope.current) {
      animate(
        "span",
        {
          opacity: 0.6,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration,
          delay: stagger(0.2),
        }
      ).catch(() => {
        // Silently handle animation errors
      });
    }
  }, [scope.current, wordsArray.length, animate, filter, duration]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="dark:text-white text-black opacity-0"
            style={{
              filter: filter ? "blur(10px)" : "none",
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-cascadia", className)}>
      <div className="mt-4">
        <div className="dark:text-white text-black text-md leading-snug tracking-wide sm:text-center md:text-center lg:text-left">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};

export default TextGenerateEffect;
