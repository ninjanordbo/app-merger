import { useWindowScroll } from "@vueuse/core";

export function scrollToAnchor(
  anchor: string,
  scrollOffset?: number,
  elementHeight?: number,
) {
  const { y: windowScrollTop } = useWindowScroll();
  const element = document.querySelector(anchor);
  if (!element) return;

  const elementPosition =
    element.getBoundingClientRect().top + windowScrollTop.value;
  window.scrollTo({
    top: elementPosition - (elementHeight || 0) - (scrollOffset || 0),
    behavior: "smooth",
  });
}
