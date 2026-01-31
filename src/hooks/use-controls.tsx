import { useEffect, useRef } from "react";

export type KeyHandler =
  | ((e: KeyboardEvent) => void)
  | {
      onPress?: (e: KeyboardEvent) => void;
      onRelease?: (e: KeyboardEvent) => void;
    };

export type ControlSchema = {
  keyboard?: Record<string, KeyHandler>;
  touch?: {
    onTouchStart?: (e: TouchEvent) => void;
    onTouchMove?: (e: TouchEvent) => void;
    onTouchEnd?: (e: TouchEvent) => void;
  };
};

export function useControls(schema: ControlSchema) {
  const pressedKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const handler = schema.keyboard?.[e.key];
      if (!handler) return;

      // If key is already pressed (and holding), don't trigger again
      if (pressedKeys.current.has(e.key)) return;
      pressedKeys.current.add(e.key);

      if (typeof handler === "function") {
        handler(e);
      } else {
        handler.onPress?.(e);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const handler = schema.keyboard?.[e.key];
      if (!handler) return;

      pressedKeys.current.delete(e.key);

      if (typeof handler !== "function") {
        handler.onRelease?.(e);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      schema.touch?.onTouchStart?.(e);
    };

    const handleTouchMove = (e: TouchEvent) => {
      schema.touch?.onTouchMove?.(e);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      schema.touch?.onTouchEnd?.(e);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    if (schema.touch?.onTouchStart) {
      window.addEventListener("touchstart", handleTouchStart);
    }
    if (schema.touch?.onTouchMove) {
      window.addEventListener("touchmove", handleTouchMove);
    }
    if (schema.touch?.onTouchEnd) {
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (schema.touch?.onTouchStart) {
        window.removeEventListener("touchstart", handleTouchStart);
      }
      if (schema.touch?.onTouchMove) {
        window.removeEventListener("touchmove", handleTouchMove);
      }
      if (schema.touch?.onTouchEnd) {
        window.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [schema]);
}
