import LRUCache from "./lru.js";

// Helpers to inspect internal linked list state
const lruKey = (cache) => cache.head.next?.key ?? null;
const mruKey = (cache) => cache.tail.prev?.key ?? null;

describe("get", () => {
  test("returns -1 for a missing key on an empty cache", () => {
    const cache = new LRUCache(3);
    expect(cache.get("x")).toBe(-1);
  });

  test("returns -1 for a key that was never inserted", () => {
    const cache = new LRUCache(3);
    cache.put("a", 1);
    expect(cache.get("z")).toBe(-1);
  });

  test("returns the correct value for an existing key", () => {
    const cache = new LRUCache(3);
    cache.put("a", 42);
    expect(cache.get("a")).toBe(42);
  });

  test("marks the accessed key as MRU", () => {
    const cache = new LRUCache(3);
    cache.put("a", 1);
    cache.put("b", 2);
    cache.put("c", 3);
    // order: a(LRU) → b → c(MRU)
    cache.get("a");
    expect(mruKey(cache)).toBe("a");
    expect(lruKey(cache)).toBe("b");
  });

  test("on the current MRU leaves order unchanged", () => {
    const cache = new LRUCache(3);
    cache.put("a", 1);
    cache.put("b", 2);
    cache.get("b"); // b is already MRU
    expect(mruKey(cache)).toBe("b");
    expect(lruKey(cache)).toBe("a");
  });

  test("on a middle entry promotes it to MRU", () => {
    const cache = new LRUCache(4);
    cache.put("a", 1);
    cache.put("b", 2);
    cache.put("c", 3);
    cache.put("d", 4);
    // order: a → b → c → d(MRU)
    cache.get("b");
    expect(mruKey(cache)).toBe("b");
    expect(lruKey(cache)).toBe("a");
  });
});

describe("put", () => {
  test("inserts the first entry correctly", () => {
    const cache = new LRUCache(3);
    cache.put("a", 1);
    expect(cache.get("a")).toBe(1);
    expect(cache.mapping.size).toBe(1);
  });

  test("inserts multiple entries up to capacity", () => {
    const cache = new LRUCache(3);
    cache.put("a", 1);
    cache.put("b", 2);
    cache.put("c", 3);
    expect(cache.get("a")).toBe(1);
    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
    expect(cache.mapping.size).toBe(3);
  });

  test("updating an existing key changes its value", () => {
    const cache = new LRUCache(3);
    cache.put("a", 1);
    cache.put("a", 99);
    expect(cache.get("a")).toBe(99);
  });

  test("updating an existing key marks it as MRU", () => {
    const cache = new LRUCache(3);
    cache.put("a", 1);
    cache.put("b", 2);
    cache.put("a", 10);
    expect(mruKey(cache)).toBe("a");
    expect(lruKey(cache)).toBe("b");
  });

  test("updating an existing key does not increase occupancy", () => {
    const cache = new LRUCache(3);
    cache.put("a", 1);
    cache.put("b", 2);
    cache.put("a", 10);
    expect(cache.mapping.size).toBe(2);
  });
});

describe("eviction", () => {
  test("evicts the LRU entry when capacity is exceeded", () => {
    const cache = new LRUCache(3);
    cache.put("a", 1);
    cache.put("b", 2);
    cache.put("c", 3);
    cache.put("d", 4); // should evict "a"
    expect(cache.get("a")).toBe(-1);
    expect(cache.get("d")).toBe(4);
  });

  test("removes evicted key from the mapping", () => {
    const cache = new LRUCache(3);
    cache.put("a", 1);
    cache.put("b", 2);
    cache.put("c", 3);
    cache.put("d", 4); // evicts "a"
    expect(cache.mapping.has("a")).toBe(false);
  });

  test("get before put affects which entry is evicted", () => {
    const cache = new LRUCache(3);
    cache.put("a", 1);
    cache.put("b", 2);
    cache.put("c", 3);
    cache.get("a"); // a is now MRU; b is now LRU
    cache.put("d", 4); // should evict "b"
    expect(cache.get("b")).toBe(-1);
    expect(cache.get("a")).toBe(1);
    expect(cache.get("d")).toBe(4);
  });

  test("occupancy does not exceed capacity after eviction", () => {
    const cache = new LRUCache(3);
    cache.put("a", 1);
    cache.put("b", 2);
    cache.put("c", 3);
    cache.put("d", 4);
    expect(cache.mapping.size).toBe(3);
  });
});

describe("capacity = 1", () => {
  test("first put works", () => {
    const cache = new LRUCache(1);
    cache.put("a", 1);
    expect(cache.get("a")).toBe(1);
  });

  test("second put evicts the first", () => {
    const cache = new LRUCache(1);
    cache.put("a", 1);
    cache.put("b", 2);
    expect(cache.get("a")).toBe(-1);
    expect(cache.get("b")).toBe(2);
  });

  test("update in place does not evict", () => {
    const cache = new LRUCache(1);
    cache.put("a", 1);
    cache.put("a", 99);
    expect(cache.get("a")).toBe(99);
  });
});

describe("spec example", () => {
  test("matches the exact sequence from the spec", () => {
    const cache = new LRUCache(3);
    cache.put("a", 1);
    cache.put("b", 2);
    cache.put("c", 3);
    // order: a(LRU) → b → c(MRU)

    expect(cache.get("a")).toBe(1); // a promoted to MRU; b is now LRU

    cache.put("d", 4); // evict b
    expect(cache.get("b")).toBe(-1);
    expect(cache.get("c")).toBe(3);
    expect(cache.get("a")).toBe(1);
    expect(cache.get("d")).toBe(4);
  });
});
