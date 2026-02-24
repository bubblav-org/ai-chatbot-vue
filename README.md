# @bubblav/ai-chatbot-vue

Official Vue 3 package for the [BubblaV](https://www.bubblav.com) AI chatbot widget.

## Installation

```bash
npm install @bubblav/ai-chatbot-vue
```

## Usage

```vue
<script setup>
import { BubblaVWidget } from '@bubblav/ai-chatbot-vue';
</script>

<template>
  <BubblaVWidget website-id="your-website-id" />
</template>
```

Get your `website-id` from the [BubblaV dashboard](https://www.bubblav.com/dashboard).

## Programmatic control

```vue
<script setup>
import { useBubblaVWidget } from '@bubblav/ai-chatbot-vue';
const widget = useBubblaVWidget();
</script>

<template>
  <button @click="widget?.open()">Chat with us</button>
</template>
```

## Documentation

Full guide: [docs.bubblav.com/user-guide/installation](https://docs.bubblav.com/user-guide/installation)
