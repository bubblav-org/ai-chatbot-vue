import { ref, onMounted } from 'vue';

export interface BubblaVAPI {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
  show: () => void;
  hide: () => void;
  sendMessage: (message: string, conversationId?: string) => void;
  showGreeting: (message?: string) => void;
  hideGreeting: () => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
  track: (eventName: string, properties?: Record<string, any>) => void;
  setDebug: (enabled: boolean) => void;
  getConfig: () => Record<string, any>;
  ready: (callback: () => void) => void;
}

declare global {
  interface Window {
    BubblaV?: BubblaVAPI;
  }
}

/**
 * Returns a reactive ref to the BubblaV widget API.
 *
 * The ref is null during SSR and until the widget script has loaded.
 * Once the widget is ready, the ref updates automatically.
 *
 * @example
 * const widget = useBubblaVWidget();
 * widget.value?.open();
 */
export function useBubblaVWidget() {
  const widget = ref<BubblaVAPI | null>(null);

  onMounted(() => {
    if (typeof window === 'undefined') return;

    // Check if widget is already available
    if (window.BubblaV) {
      widget.value = window.BubblaV;
      return;
    }

    // Widget not ready yet, poll for availability
    const checkWidget = () => {
      if (window.BubblaV) {
        widget.value = window.BubblaV;
        return true;
      }
      return false;
    };

    // If ready method exists, use it
    const currentApi = window.BubblaV;
    if (currentApi?.ready) {
      currentApi.ready(() => {
        widget.value = window.BubblaV!;
      });
    } else {
      // Poll for widget availability
      const interval = setInterval(() => {
        if (checkWidget()) {
          clearInterval(interval);
        }
      }, 100);
    }
  });

  return widget;
}
