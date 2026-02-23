/**
 * @bubblav/ai-chatbot-vue
 *
 * Vue component for embedding the BubblaV AI chatbot widget.
 *
 * @example
 * ```vue
 * <script setup>
 * import { BubblaVWidget } from '@bubblav/ai-chatbot-vue';
 * </script>
 *
 * <template>
 *   <BubblaVWidget
 *     website-id="your-website-id"
 *     bubble-color="#3b82f6"
 *   />
 * </template>
 * ```
 */

// Main component export
export { default as BubblaVWidget } from './BubblaVWidget.vue';

// Type exports
export type {
  BubblaVWidgetProps,
  BubblaVWidgetSDK,
  BubblaVSDK,
} from './types';

// Composable exports
export {
  useBubblaVWidget,
  useBubblaVEvent,
  useBubblaVWidgetState,
} from './composables';

// Utility exports
export {
  propsToDataAttributes,
  getWidgetScriptUrl,
  validateWebsiteId,
  getConfigProps,
  isBrowser,
  isScriptLoaded,
} from './utils';
