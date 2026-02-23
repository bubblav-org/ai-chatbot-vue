<script setup lang="ts">
/**
 * BubblaVWidget Vue Component
 */
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { BubblaVWidgetSDK } from './types';
import {
  propsToDataAttributes,
  getWidgetScriptUrl,
  validateWebsiteId,
  getConfigProps,
  isBrowser,
  isScriptLoaded,
} from './utils';

// Props definition
interface Props {
  /** Required: Your website ID from the BubblaV dashboard */
  websiteId: string;

  /** Optional: Custom API URL (defaults to production) */
  apiUrl?: string;

  /** Optional: Bubble button color (hex) */
  bubbleColor?: string;

  /** Optional: Bubble icon color (hex) */
  bubbleIconColor?: string;

  /** Optional: Desktop position */
  desktopPosition?: 'bottom-left' | 'bottom-right';

  /** Optional: Mobile position */
  mobilePosition?: 'bottom-left' | 'bottom-right';

  /** Optional: Show/hide powered by branding */
  poweredByVisible?: boolean;

  /** Optional: Custom bot name */
  botName?: string;

  /** Optional: Greeting message shown when widget opens */
  greetingMessage?: string;

  /** Optional: Placeholder text for input field */
  textboxPlaceholder?: string;

  /** Optional: Whether to show action buttons */
  showActionButtons?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  apiUrl: undefined,
  bubbleColor: undefined,
  bubbleIconColor: undefined,
  desktopPosition: undefined,
  mobilePosition: undefined,
  poweredByVisible: undefined,
  botName: undefined,
  greetingMessage: undefined,
  textboxPlaceholder: undefined,
  showActionButtons: undefined,
});

// Internal state
const isInitialized = ref(false);
let scriptElement: HTMLScriptElement | null = null;
const sdk = ref<BubblaVWidgetSDK | null>(null);

// Initialize widget
function initWidget() {
  // Skip if not in browser (SSR)
  if (!isBrowser()) {
    return;
  }

  // Prevent double initialization
  if (isInitialized.value) {
    return;
  }

  // Validate website ID
  if (!validateWebsiteId(props.websiteId)) {
    console.warn(
      `[BubblaV] Invalid website ID format: "${props.websiteId}". ` +
      `Please check your website ID in the BubblaV dashboard.`
    );
    return;
  }

  // Get script URL
  const scriptUrl = getWidgetScriptUrl(props.apiUrl);

  // Check if script is already loaded
  if (isScriptLoaded(scriptUrl)) {
    console.warn(
      `[BubblaV] Widget script already loaded. ` +
      `Only one widget instance should be active.`
    );
    // Use existing SDK
    if (window.BubblaV) {
      sdk.value = window.BubblaV;
    }
    return;
  }

  // Mark as initialized
  isInitialized.value = true;

  // Create script element
  const script = document.createElement('script');
  script.src = scriptUrl;
  script.async = true;
  script.defer = true;

  // Set data attributes
  script.setAttribute('data-site-id', props.websiteId);

  // Set optional config as data attributes
  const config = getConfigProps(props);
  const dataAttrs = propsToDataAttributes(config);
  for (const [key, value] of Object.entries(dataAttrs)) {
    script.setAttribute(key, value);
  }

  // Handle load event
  script.onload = () => {
    // SDK should be available now
    if (window.BubblaV) {
      sdk.value = window.BubblaV;
    }
  };

  // Handle error event
  script.onerror = () => {
    console.error(
      `[BubblaV] Failed to load widget script from ${scriptUrl}. ` +
      `Please check your network connection and ensure the URL is correct.`
    );
    isInitialized.value = false;
  };

  // Add script to document
  document.body.appendChild(script);
  scriptElement = script;
}

// Cleanup widget
function cleanupWidget() {
  if (scriptElement && scriptElement.parentNode) {
    scriptElement.parentNode.removeChild(scriptElement);
  }
  scriptElement = null;
  sdk.value = null;
  isInitialized.value = false;
}

// Expose SDK methods
defineExpose({
  get open() {
    return sdk.value?.open ?? (() => false);
  },
  get close() {
    return sdk.value?.close ?? (() => false);
  },
  get toggle() {
    return sdk.value?.toggle ?? (() => false);
  },
  get isOpen() {
    return sdk.value?.isOpen ?? (() => false);
  },
  get sendMessage() {
    return sdk.value?.sendMessage ?? (() => {});
  },
  get showGreeting() {
    return sdk.value?.showGreeting ?? (() => {});
  },
  get hideGreeting() {
    return sdk.value?.hideGreeting ?? (() => {});
  },
  get getConfig() {
    return sdk.value?.getConfig ?? (() => ({}));
  },
  get setDebug() {
    return sdk.value?.setDebug ?? (() => {});
  },
});

// Initialize on mount
onMounted(() => {
  initWidget();
});

// Cleanup on unmount
onUnmounted(() => {
  cleanupWidget();
});

// Watch for websiteId changes (re-init if changes)
watch(() => props.websiteId, () => {
  cleanupWidget();
  initWidget();
});
</script>

<template>
  <!-- Component renders nothing (script-only widget) -->
</template>
