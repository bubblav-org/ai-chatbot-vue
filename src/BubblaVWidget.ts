import { defineComponent, onMounted, onUnmounted, h } from 'vue';

const WIDGET_SRC = 'https://www.bubblav.com/widget.js';
const SCRIPT_ATTR = 'data-bubblav-widget';

/**
 * BubblaVWidget — injects the BubblaV chat widget script into the page.
 *
 * Place this component once in your root layout or App component.
 *
 * @example
 * <BubblaVWidget website-id="your-website-id" />
 */
export const BubblaVWidget = defineComponent({
  name: 'BubblaVWidget',
  props: {
    websiteId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    onMounted(() => {
      if (typeof document === 'undefined') return;

      // Avoid injecting the script twice
      if (document.querySelector(`script[${SCRIPT_ATTR}]`)) return;

      const script = document.createElement('script');
      script.src = WIDGET_SRC;
      script.async = true;
      script.setAttribute('data-site-id', props.websiteId);
      script.setAttribute(SCRIPT_ATTR, 'true');
      document.body.appendChild(script);
    });

    onUnmounted(() => {
      const s = document.querySelector<HTMLScriptElement>(`script[${SCRIPT_ATTR}]`);
      if (s) s.remove();
    });

    return () => h('div', { style: 'display:none' });
  },
});

export default BubblaVWidget;
