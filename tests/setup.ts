import '@testing-library/jest-dom';

// Mock IntersectionObserver
class MockIntersectionObserver {
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe() {}
  unobserve() {}
  disconnect() {}

  // Helper to trigger intersection
  triggerIntersection(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting, target: document.createElement('div') } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Mock image loading
Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', {
  get() { return 800; },
});

Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', {
  get() { return 600; },
});

// Simulate images loading — intercept both setAttribute('src', ...) and direct .src= assignment
const originalSetAttribute = HTMLImageElement.prototype.setAttribute;
HTMLImageElement.prototype.setAttribute = function(name: string, value: string) {
  originalSetAttribute.call(this, name, value);
  if (name === 'src' && value) {
    setTimeout(() => {
      Object.defineProperty(this, 'complete', { value: true, configurable: true });
      this.dispatchEvent(new Event('load'));
    }, 0);
  }
};

const srcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
if (srcDescriptor) {
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    set(value: string) {
      srcDescriptor.set?.call(this, value);
      if (value) {
        setTimeout(() => {
          Object.defineProperty(this, 'complete', { value: true, configurable: true });
          this.dispatchEvent(new Event('load'));
        }, 0);
      }
    },
    get() {
      return srcDescriptor.get?.call(this) ?? '';
    },
    configurable: true,
  });
}
