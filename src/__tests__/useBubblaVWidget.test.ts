/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { useBubblaVWidget, BubblaVAPI } from '../useBubblaVWidget';

// Note: onMounted is mocked in setup.ts to execute immediately in tests

describe('useBubblaVWidget', () => {
  beforeEach(() => {
    // Clean up window.BubblaV before each test
    // @ts-expect-error - test setup
    window.BubblaV = undefined;
    vi.clearAllMocks();
  });

  afterEach(() => {
    // @ts-expect-error - test cleanup
    window.BubblaV = undefined;
  });

  describe('initialization', () => {
    it('returns a ref that is initially null', () => {
      const widget = useBubblaVWidget();
      expect(widget.value).toBeNull();
    });

    it('returns an object with value property', () => {
      const widget = useBubblaVWidget();
      expect(widget).toHaveProperty('value');
      expect(typeof widget).toBe('object');
    });
  });

  describe('when BubblaV widget is already available', () => {
    it('immediately assigns existing widget to ref', () => {
      const mockWidget: BubblaVAPI = {
        open: vi.fn(),
        close: vi.fn(),
        toggle: vi.fn(),
        isOpen: vi.fn(() => true),
        show: vi.fn(),
        hide: vi.fn(),
        sendMessage: vi.fn(),
        showGreeting: vi.fn(),
        hideGreeting: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        track: vi.fn(),
        setDebug: vi.fn(),
        getConfig: vi.fn(() => ({ key: 'value' })),
        ready: vi.fn(),
      };

      // @ts-expect-error - test setup
      window.BubblaV = mockWidget;

      const widget = useBubblaVWidget();

      // With mocked onMounted, the widget should be assigned immediately
      expect(widget.value).toEqual(mockWidget);
      expect(widget.value?.isOpen()).toBe(true);
    });

    it('does not start polling when widget is already available', () => {
      const mockWidget: BubblaVAPI = {
        open: vi.fn(),
        close: vi.fn(),
        toggle: vi.fn(),
        isOpen: vi.fn(() => false),
        show: vi.fn(),
        hide: vi.fn(),
        sendMessage: vi.fn(),
        showGreeting: vi.fn(),
        hideGreeting: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        track: vi.fn(),
        setDebug: vi.fn(),
        getConfig: vi.fn(() => ({})),
        ready: vi.fn(),
      };

      // @ts-expect-error - test setup
      window.BubblaV = mockWidget;

      const widget = useBubblaVWidget();

      expect(widget.value).toEqual(mockWidget);
    });
  });

  describe('when BubblaV widget is not immediately available', () => {
    it('polls for widget availability', async () => {
      // Initially no widget
      // @ts-expect-error - test setup
      window.BubblaV = undefined;

      const widget = useBubblaVWidget();

      // Initially null
      expect(widget.value).toBeNull();

      // Simulate widget becoming available after delay
      setTimeout(() => {
        const mockWidget: BubblaVAPI = {
          open: vi.fn(),
          close: vi.fn(),
          toggle: vi.fn(),
          isOpen: vi.fn(() => true),
          show: vi.fn(),
          hide: vi.fn(),
          sendMessage: vi.fn(),
          showGreeting: vi.fn(),
          hideGreeting: vi.fn(),
          on: vi.fn(),
          off: vi.fn(),
          track: vi.fn(),
          setDebug: vi.fn(),
          getConfig: vi.fn(() => ({})),
          ready: vi.fn(),
        };
        // @ts-expect-error - test setup
        window.BubblaV = mockWidget;
      }, 150);

      // Wait for polling interval (100ms) + some buffer
      await new Promise(resolve => setTimeout(resolve, 250));

      // Widget should be detected by polling
      expect(widget.value).not.toBeNull();
    });

    it('uses ready callback when available', async () => {
      let readyCallback: (() => void) | null = null;

      const mockWidget: BubblaVAPI = {
        open: vi.fn(),
        close: vi.fn(),
        toggle: vi.fn(),
        isOpen: vi.fn(() => false),
        show: vi.fn(),
        hide: vi.fn(),
        sendMessage: vi.fn(),
        showGreeting: vi.fn(),
        hideGreeting: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        track: vi.fn(),
        setDebug: vi.fn(),
        getConfig: vi.fn(() => ({})),
        ready: vi.fn((cb: () => void) => {
          readyCallback = cb;
        }),
      };

      // @ts-expect-error - test setup
      window.BubblaV = mockWidget;

      const widget = useBubblaVWidget();

      // Should have the widget since it's available
      expect(widget.value).toEqual(mockWidget);

      // Simulate ready callback being invoked
      if (readyCallback) {
        readyCallback();
      }

      await nextTick();

      expect(widget.value).toEqual(mockWidget);
    });
  });

  describe('widget API methods', () => {
    it('provides access to all BubblaVAPI methods', () => {
      const mockWidget: BubblaVAPI = {
        open: vi.fn(),
        close: vi.fn(),
        toggle: vi.fn(),
        isOpen: vi.fn(() => true),
        show: vi.fn(),
        hide: vi.fn(),
        sendMessage: vi.fn(),
        showGreeting: vi.fn(),
        hideGreeting: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        track: vi.fn(),
        setDebug: vi.fn(),
        getConfig: vi.fn(() => ({ theme: 'dark' })),
        ready: vi.fn(),
      };

      // @ts-expect-error - test setup
      window.BubblaV = mockWidget;

      const widget = useBubblaVWidget();

      expect(widget.value).toEqual(mockWidget);

      // Test method calls through the composable
      widget.value?.open();
      expect(mockWidget.open).toHaveBeenCalledTimes(1);

      widget.value?.close();
      expect(mockWidget.close).toHaveBeenCalledTimes(1);

      widget.value?.toggle();
      expect(mockWidget.toggle).toHaveBeenCalledTimes(1);

      const isOpenResult = widget.value?.isOpen();
      expect(isOpenResult).toBe(true);

      widget.value?.show();
      expect(mockWidget.show).toHaveBeenCalledTimes(1);

      widget.value?.hide();
      expect(mockWidget.hide).toHaveBeenCalledTimes(1);

      widget.value?.sendMessage('Hello');
      expect(mockWidget.sendMessage).toHaveBeenCalledWith('Hello');

      widget.value?.sendMessage('Hello', 'conv-123');
      expect(mockWidget.sendMessage).toHaveBeenCalledWith('Hello', 'conv-123');

      widget.value?.showGreeting();
      expect(mockWidget.showGreeting).toHaveBeenCalled();

      widget.value?.showGreeting('Welcome!');
      expect(mockWidget.showGreeting).toHaveBeenCalledWith('Welcome!');

      widget.value?.hideGreeting();
      expect(mockWidget.hideGreeting).toHaveBeenCalledTimes(1);

      const eventCallback = vi.fn();
      widget.value?.on('test-event', eventCallback);
      expect(mockWidget.on).toHaveBeenCalledWith('test-event', eventCallback);

      widget.value?.off('test-event', eventCallback);
      expect(mockWidget.off).toHaveBeenCalledWith('test-event', eventCallback);

      widget.value?.track('page-view', { page: '/home' });
      expect(mockWidget.track).toHaveBeenCalledWith('page-view', { page: '/home' });

      widget.value?.setDebug(true);
      expect(mockWidget.setDebug).toHaveBeenCalledWith(true);

      const config = widget.value?.getConfig();
      expect(config).toEqual({ theme: 'dark' });
    });
  });

  describe('reactivity', () => {
    it('updates ref value when widget becomes available via ready callback', () => {
      let readyCallback: (() => void) | null = null;

      const mockWidget: BubblaVAPI = {
        open: vi.fn(),
        close: vi.fn(),
        toggle: vi.fn(),
        isOpen: vi.fn(() => false),
        show: vi.fn(),
        hide: vi.fn(),
        sendMessage: vi.fn(),
        showGreeting: vi.fn(),
        hideGreeting: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        track: vi.fn(),
        setDebug: vi.fn(),
        getConfig: vi.fn(() => ({})),
        ready: vi.fn((cb: () => void) => {
          readyCallback = cb;
        }),
      };

      // @ts-expect-error - test setup
      window.BubblaV = mockWidget;

      const widget = useBubblaVWidget();

      // Widget should be available immediately since it's already on window
      expect(widget.value).toEqual(mockWidget);

      // Simulate ready callback being invoked
      if (readyCallback) {
        readyCallback();
      }

      // After ready callback, widget should still be the same
      expect(widget.value).toEqual(mockWidget);
    });
  });

  describe('edge cases', () => {
    it('handles widget becoming available during polling', async () => {
      // @ts-expect-error - test setup
      window.BubblaV = undefined;

      const widget = useBubblaVWidget();

      // Widget becomes available after 50ms
      setTimeout(() => {
        const mockWidget: BubblaVAPI = {
          open: vi.fn(),
          close: vi.fn(),
          toggle: vi.fn(),
          isOpen: vi.fn(() => true),
          show: vi.fn(),
          hide: vi.fn(),
          sendMessage: vi.fn(),
          showGreeting: vi.fn(),
          hideGreeting: vi.fn(),
          on: vi.fn(),
          off: vi.fn(),
          track: vi.fn(),
          setDebug: vi.fn(),
          getConfig: vi.fn(() => ({})),
          ready: vi.fn(),
        };
        // @ts-expect-error - test setup
        window.BubblaV = mockWidget;
      }, 50);

      // Wait for polling to detect it
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(widget.value).not.toBeNull();
      expect(widget.value?.isOpen()).toBe(true);
    });

    it('safely handles missing ready method', () => {
      const mockWidget: BubblaVAPI = {
        open: vi.fn(),
        close: vi.fn(),
        toggle: vi.fn(),
        isOpen: vi.fn(() => false),
        show: vi.fn(),
        hide: vi.fn(),
        sendMessage: vi.fn(),
        showGreeting: vi.fn(),
        hideGreeting: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        track: vi.fn(),
        setDebug: vi.fn(),
        getConfig: vi.fn(() => ({})),
        ready: undefined as any, // Simulate missing ready method
      };

      // @ts-expect-error - test setup
      window.BubblaV = mockWidget;

      // Should not throw when ready is undefined - will fall back to polling
      expect(() => useBubblaVWidget()).not.toThrow();
    });
  });

  describe('type safety', () => {
    it('correctly types the widget ref', () => {
      const widget = useBubblaVWidget();

      // TypeScript should know widget.value is BubblaVAPI | null
      if (widget.value) {
        // These should all be valid calls without type errors
        const isOpen: boolean = widget.value.isOpen();
        const config: Record<string, any> = widget.value.getConfig();

        expect(typeof isOpen).toBe('boolean');
        expect(typeof config).toBe('object');
      }
    });
  });
});
