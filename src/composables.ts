/**
 * Vue composables for @bubblav/ai-chatbot-vue
 */

import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import type { BubblaVSDK } from './types';
import { isBrowser } from './utils';

/**
 * Composable to access the BubblaV SDK programmatically
 * Returns null until the widget is ready
 */
export function useBubblaVWidget(): Ref<BubblaVSDK | null> {
  const sdk = ref<BubblaVSDK | null>(() => {
    // Check if SDK is already available
    if (isBrowser() && window.BubblaV) {
      return window.BubblaV;
    }
    return null;
  });

  let interval: ReturnType<typeof setInterval> | null = null;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  onMounted(() => {
    // If SDK already available, no need to set up listener
    if (sdk.value) return;

    // Poll for SDK availability
    interval = setInterval(() => {
      if (isBrowser() && window.BubblaV) {
        sdk.value = window.BubblaV;
        if (interval) clearInterval(interval);
      }
    }, 100);

    // Cleanup interval after 5 seconds
    timeout = setTimeout(() => {
      if (interval) clearInterval(interval);
    }, 5000);
  });

  onUnmounted(() => {
    if (interval) clearInterval(interval);
    if (timeout) clearTimeout(timeout);
  });

  return sdk;
}

/**
 * Composable to listen to widget events
 *
 * @example
 * ```vue
 * <script setup>
 * import { useBubblaVEvent } from '@bubblav/ai-chatbot-vue';
 *
 * useBubblaVEvent('widget_opened', () => {
 *   console.log('Widget opened!');
 * });
 * </script>
 * ```
 */
export function useBubblaVEvent(
  eventName: string,
  callback: (...args: unknown[]) => void
): void {
  const listener = callback;

  onMounted(() => {
    const sdk = isBrowser() ? window.BubblaV : null;
    if (!sdk) return;

    sdk.on(eventName, listener);
  });

  onUnmounted(() => {
    const sdk = isBrowser() ? window.BubblaV : null;
    if (!sdk) return;

    sdk.off(eventName, listener);
  });
}

/**
 * Composable to get widget open/closed state
 */
export function useBubblaVWidgetState(): Ref<boolean> {
  const isOpen = ref(false);

  useBubblaVEvent('widget_opened', () => {
    isOpen.value = true;
  });

  useBubblaVEvent('widget_closed', () => {
    isOpen.value = false;
  });

  return isOpen;
}
