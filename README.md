# @bubblav/ai-chatbot-vue

Vue component for embedding the BubblaV AI chatbot widget in your Vue application.

## Installation

```bash
npm install @bubblav/ai-chatbot-vue
# or
yarn add @bubblav/ai-chatbot-vue
# or
pnpm add @bubblav/ai-chatbot-vue
```

## Usage

### Basic Usage

```vue
<script setup>
import { BubblaVWidget } from '@bubblav/ai-chatbot-vue';
</script>

<template>
  <BubblaVWidget
    website-id="your-website-id"
  />
</template>
```

### With Custom Styling

```vue
<script setup>
import { BubblaVWidget } from '@bubblav/ai-chatbot-vue';
</script>

<template>
  <BubblaVWidget
    website-id="your-website-id"
    bubble-color="#3b82f6"
    bubble-icon-color="#ffffff"
    desktop-position="bottom-right"
    mobile-position="bottom-right"
  />
</template>
```

### With Template Ref for SDK Access

```vue
<script setup>
import { ref } from 'vue';
import { BubblaVWidget } from '@bubblav/ai-chatbot-vue';

const widgetRef = ref(null);

const openWidget = () => {
  widgetRef.value?.open();
};
</script>

<template>
  <button @click="openWidget">Open Chat</button>
  <BubblaVWidget
    ref="widgetRef"
    website-id="your-website-id"
  />
</template>
```

### Using Composables

```vue
<script setup>
import { useBubblaVWidget } from '@bubblav/ai-chatbot-vue';

const widget = useBubblaVWidget();

const handleClick = () => {
  widget.value?.sendMessage('Hello, I need help!');
};
</script>

<template>
  <button @click="handleClick">Send Message</button>
</template>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `website-id` | `string` | Yes | - | Your website ID from the BubblaV dashboard |
| `api-url` | `string` | No | Production API | Custom API URL (for self-hosted deployments) |
| `bubble-color` | `string` | No | - | Bubble button color (hex) |
| `bubble-icon-color` | `string` | No | - | Bubble icon color (hex) |
| `desktop-position` | `'bottom-left' \| 'bottom-right'` | No | `'bottom-right'` | Desktop position |
| `mobile-position` | `'bottom-left' \| 'bottom-right'` | No | `'bottom-right'` | Mobile position |
| `powered-by-visible` | `boolean` | No | `true` | Show/hide powered by branding |
| `bot-name` | `string` | No | `'Bot'` | Custom bot name |
| `greeting-message` | `string` | No | - | Greeting message when widget opens |
| `textbox-placeholder` | `string` | No | - | Input placeholder text |
| `show-action-buttons` | `boolean` | No | `true` | Show/hide action buttons |

## SDK Methods (via Ref)

| Method | Description |
|--------|-------------|
| `open()` | Open the widget |
| `close()` | Close the widget |
| `toggle()` | Toggle widget open/close |
| `isOpen()` | Check if widget is open |
| `sendMessage(text, conversationId?)` | Send a message programmatically |
| `showGreeting(message?)` | Show greeting message |
| `hideGreeting()` | Hide greeting message |
| `getConfig()` | Get current widget configuration |
| `setDebug(enabled)` | Enable/disable debug mode |

## Composables

### `useBubblaVWidget()`

Returns a ref containing the BubblaV SDK instance when ready, or `null` while loading.

```vue
<script setup>
import { useBubblaVWidget } from '@bubblav/ai-chatbot-vue';

const widget = useBubblaVWidget();
</script>
```

### `useBubblaVEvent(eventName, callback)`

Listen to widget events.

```vue
<script setup>
import { useBubblaVEvent } from '@bubblav/ai-chatbot-vue';

useBubblaVEvent('widget_opened', () => {
  console.log('Widget opened!');
});
</script>
```

### `useBubblaVWidgetState()`

Get the current open/closed state of the widget as a ref.

```vue
<script setup>
import { useBubblaVWidgetState } from '@bubblav/ai-chatbot-vue';

const isOpen = useBubblaVWidgetState();
</script>

<template>
  <div v-if="isOpen">Widget is open</div>
</template>
```

## Getting Your Website ID

1. Go to [bubblav.com/dashboard](https://www.bubblav.com/dashboard)
2. Select your website
3. Go to **Installation**
4. Copy your website ID

## Server-Side Rendering (SSR)

This component is SSR-safe. The widget script only loads in the browser.

## TypeScript

This package is written in TypeScript and includes full type definitions.

## License

MIT

## Support

- Documentation: [docs.bubblav.com](https://docs.bubblav.com)
- Issues: [GitHub Issues](https://github.com/tonnguyen/botcanchat/issues)
