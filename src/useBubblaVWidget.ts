import { ref, onMounted } from 'vue';

export interface BubblaVAPI {
  open: () => void;
  close: () => void;
  toggle: () => void;
  sendMessage: (message: string) => void;
}

declare global {
  interface Window {
    BubblaV?: BubblaVAPI;
  }
}

/**
 * Returns a reactive ref to the BubblaV widget API.
 *
 * The ref is null until the widget script has loaded.
 *
 * @example
 * const widget = useBubblaVWidget();
 * widget.value?.open();
 */
export function useBubblaVWidget() {
  const widget = ref<BubblaVAPI | null>(null);

  onMounted(() => {
    widget.value = window.BubblaV ?? null;
  });

  return widget;
}
