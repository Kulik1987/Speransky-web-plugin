import React from "react";

/**
 * @description функция динамически меняет высоту textarea в зависимости от контента
 */
export function autoResize(ev: React.ChangeEvent<HTMLTextAreaElement>) {
  resizeTextarea(ev.target);
}

/**
 * @description применяет autoResize напрямую к элементу textarea (используется при инициализации)
 */
export function resizeTextarea(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}
