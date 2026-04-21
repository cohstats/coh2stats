// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Polyfills for Next.js 15 in jsdom environment
// Next.js 15 server utilities require these Web APIs which are not available in jsdom

import { TextEncoder, TextDecoder } from "util";

// TextEncoder/TextDecoder polyfill
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Polyfill Request, Response, Headers for Next.js 15
// Using a minimal implementation sufficient for Next.js internals during tests
if (typeof global.Request === "undefined") {
  global.Request = class Request {
    constructor(input, init) {
      this.url = typeof input === "string" ? input : input.url;
      this.method = init?.method || "GET";
      this.headers = new Headers(init?.headers);
      this.body = init?.body;
    }
  };
}

if (typeof global.Response === "undefined") {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body;
      this.status = init?.status || 200;
      this.statusText = init?.statusText || "";
      this.headers = new Headers(init?.headers);
      this.ok = this.status >= 200 && this.status < 300;
    }

    async json() {
      return typeof this.body === "string" ? JSON.parse(this.body) : this.body;
    }

    async text() {
      return typeof this.body === "string" ? this.body : JSON.stringify(this.body);
    }
  };
}

if (typeof global.Headers === "undefined") {
  global.Headers = class Headers {
    constructor(init) {
      this.map = new Map();
      if (init) {
        if (init instanceof Headers) {
          init.forEach((value, key) => this.map.set(key.toLowerCase(), value));
        } else if (Array.isArray(init)) {
          init.forEach(([key, value]) => this.map.set(key.toLowerCase(), value));
        } else {
          Object.entries(init).forEach(([key, value]) => {
            this.map.set(key.toLowerCase(), value);
          });
        }
      }
    }

    get(name) {
      return this.map.get(name.toLowerCase()) || null;
    }

    set(name, value) {
      this.map.set(name.toLowerCase(), String(value));
    }

    has(name) {
      return this.map.has(name.toLowerCase());
    }

    delete(name) {
      this.map.delete(name.toLowerCase());
    }

    forEach(callback, thisArg) {
      this.map.forEach((value, key) => callback.call(thisArg, value, key, this));
    }

    entries() {
      return this.map.entries();
    }

    keys() {
      return this.map.keys();
    }

    values() {
      return this.map.values();
    }

    append(name, value) {
      const existing = this.get(name);
      if (existing) {
        this.set(name, `${existing}, ${value}`);
      } else {
        this.set(name, value);
      }
    }
  };
}

if (typeof global.fetch === "undefined") {
  global.fetch = async function fetch(url, options) {
    return new Response(null, { status: 200 });
  };
}
