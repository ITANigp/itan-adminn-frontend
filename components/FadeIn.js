"use client";
import React from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  duration = 0.8,
  distance = 45,
  animateChildren = false,
  staggerChildren = 0.1,
  childrenDelay = 0.2,
  once = false, // Changed default to false so animations repeat
}) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: once,
    amount: 0.2, // Trigger slightly earlier
    margin: "0px 0px -50px 0px", // Adjusted margin
  });

  useEffect(() => {
    // Always animate to the appropriate state based on visibility
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden"); // Always reset when out of view
    }
  }, [isInView, controls]);

  // Elegant animations inspired by page turning/reading
  const mainVariants = {
    up: {
      hidden: { opacity: 0, y: distance },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "tween",
          duration: duration,
          delay: delay,
          ease: [0.27, 0.55, 0.17, 0.99], // Smooth, elegant easing
          when: "beforeChildren",
          staggerChildren: staggerChildren,
          delayChildren: childrenDelay,
        },
      },
    },
    down: {
      hidden: { opacity: 0, y: -distance },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "tween",
          duration: duration,
          delay: delay,
          ease: [0.27, 0.55, 0.17, 0.99],
          when: "beforeChildren",
          staggerChildren: staggerChildren,
          delayChildren: childrenDelay,
        },
      },
    },
    left: {
      hidden: { opacity: 0, x: -distance },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          type: "tween",
          duration: duration,
          delay: delay,
          ease: [0.27, 0.55, 0.17, 0.99],
          when: "beforeChildren",
          staggerChildren: staggerChildren,
          delayChildren: childrenDelay,
        },
      },
    },
    right: {
      hidden: { opacity: 0, x: distance },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          type: "tween",
          duration: duration,
          delay: delay,
          ease: [0.27, 0.55, 0.17, 0.99],
          when: "beforeChildren",
          staggerChildren: staggerChildren,
          delayChildren: childrenDelay,
        },
      },
    },
    fade: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          type: "tween",
          duration: duration,
          delay: delay,
          ease: [0.27, 0.55, 0.17, 0.99],
          when: "beforeChildren",
          staggerChildren: staggerChildren,
          delayChildren: childrenDelay,
        },
      },
    },
  };

  // Child animations that look great for text/elements
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        duration: 0.6,
        ease: [0.27, 0.55, 0.17, 0.99],
      },
    },
  };

  if (animateChildren) {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={mainVariants[direction]}
        className="overflow-hidden"
      >
        {/* Process children to animate each one independently */}
        {React.Children.map(children, (child, index) => {
          // Skip non-element children
          if (!React.isValidElement(child)) return child;

          // Clone and add animation properties
          return (
            <motion.div key={index} variants={childVariants}>
              {child}
            </motion.div>
          );
        })}
      </motion.div>
    );
  }

  // Standard animation (entire container)
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={mainVariants[direction]}
    >
      {children}
    </motion.div>
  );
}
