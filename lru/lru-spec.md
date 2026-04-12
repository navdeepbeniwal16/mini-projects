# Project: LRU Cache

An LRU (Least Recently Used) cache is a fixed-size data structure that evicts the least recently accessed item when it reaches capacity. It is one of the most common caching strategies in production systems — used in database query caches, CDNs, and in-memory stores like Redis.

The constraint that makes it interesting: both `get` and `put` must run in **O(1) time**. A plain array or object alone won't get you there. The classic solution is a doubly linked list combined with a hash map.

---

## Your Task

Implement an `LRUCache` class in plain JavaScript with no built-in LRU structures.

---

## Requirements

Implement the following:

### `LRUCache(capacity)`

Constructor that accepts a positive integer `capacity` — the maximum number of entries the cache can hold.

### `get(key)`

- Return the value associated with `key` if it exists in the cache
- Mark that key as the most recently used
- Return `-1` if the key does not exist

### `put(key, value)`

- Insert the key-value pair into the cache
- If the key already exists, update its value and mark it as most recently used
- If inserting a new key would exceed capacity, evict the least recently used entry first
- Then insert the new entry

### Constraints

- All `get` and `put` operations must run in **O(1)** time
- Implement using a **doubly linked list** and a **Map** — do not use arrays, `.sort()`, or any structure that requires iteration to find or remove entries

---

## Stretch Goals

Once the core is working, try these in order:

1. **`peek(key)`** — return the value without updating the recency order. Return `-1` if not found.
2. **`getOrSet(key, fetchFn)`** — if the key exists, return its cached value. If not, call `fetchFn()`, store the result under `key`, and return it.
3. **TTL support** — `put(key, value, ttlMs)` — entries expire after `ttlMs` milliseconds. A `get` on an expired key should return `-1` and clean up the entry.

---

## Example Behaviour

```js
const cache = new LRUCache(3);

cache.put("a", 1);
cache.put("b", 2);
cache.put("c", 3);
// cache: a(1), b(2), c(3) — a is LRU

cache.get("a");
// returns 1 — a is now MRU
// cache order: b(2), c(3), a(1) — b is now LRU

cache.put("d", 4);
// capacity exceeded — evict b
// cache: c(3), a(1), d(4)

cache.get("b");
// returns -1 — b was evicted
```

---

## Hints (read only if stuck)

<details>
<summary>Hint 1 — Why a doubly linked list?</summary>

You need to remove a node from the middle of a list in O(1). A singly linked list requires traversal to find the previous node before you can remove. A doubly linked list gives you `prev` and `next` on each node, so removal is instant.

</details>

<details>
<summary>Hint 2 — How the Map fits in</summary>

The Map stores `key → node` pairs, where each node is a node in your doubly linked list. This gives you O(1) lookup of any node by key, so you can jump straight to it and then manipulate its pointers.

</details>

<details>
<summary>Hint 3 — Dummy head and tail</summary>

Most clean implementations use two sentinel nodes — a dummy `head` and a dummy `tail` — that never hold real data. All real nodes sit between them. This eliminates a lot of null-checking edge cases when inserting or removing at the boundaries.

</details>

---

## What to Think About

Before writing any code, ask yourself:

- What does "most recently used" mean structurally in my linked list — head or tail?
- When I `get` a key that exists, what two things do I need to do?
- When I `put` a key that already exists vs a new key, what is different?
- What does eviction look like in terms of both the list and the Map?
- Where could I accidentally introduce an O(n) operation without realising?

---

## When You're Done

Run through this checklist before calling it finished:

- [ ] `get` on a missing key returns `-1`
- [ ] `get` on an existing key updates its recency position
- [ ] `put` on an existing key updates the value and recency
- [ ] `put` on a new key when at capacity evicts the correct (least recently used) entry
- [ ] The evicted key is also removed from the Map, not just the list
- [ ] Capacity of 1 works correctly
- [ ] A single-entry cache (get → put → get) works correctly
