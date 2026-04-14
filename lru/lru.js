// LRU Cache — O(1) get/put via doubly linked list + Map.
// Recency order: head.next = LRU, tail.prev = MRU.
export default class LRUCache {
  DEFAULT_CAPACITY = 5;
  head = {
    key: null,
    value: null,
    prev: null,
    next: null,
  };
  tail = {
    key: null,
    value: null,
    prev: null,
    next: null,
  };

  mapping = new Map();

  constructor(capacity) {
    this.capacity = capacity != null ? capacity : this.DEFAULT_CAPACITY;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _removeEntry(entry) {
    const prev = entry.prev;
    const next = entry.next;
    prev.next = next;
    next.prev = prev;
    entry.prev = null;
    entry.next = null;

    return entry;
  }

  _appendEntryAtTail(entry) {
    const tailPrev = this.tail.prev;
    entry.prev = tailPrev;
    entry.next = this.tail;
    tailPrev.next = entry;
    this.tail.prev = entry;
  }

  _markRecentlyUsed(entry) {
    const removedEntry = this._removeEntry(entry);
    this._appendEntryAtTail(removedEntry);
  }

  get(key) {
    const exists = this.mapping.has(key);
    if (!exists) {
      return -1;
    }

    const entryRef = this.mapping.get(key);
    this._markRecentlyUsed(entryRef);
    return entryRef.value;
  }

  put(key, value) {
    const exists = this.mapping.has(key);
    if (exists) {
      const entryRef = this.mapping.get(key);
      entryRef.value = value;
      this._markRecentlyUsed(entryRef);
    } else {
      const entry = {
        key: key,
        value: value,
        prev: null,
        next: null,
      };

      if (this.mapping.size >= this.capacity) {
        // Evict LRU to make room
        const removedEntry = this._removeEntry(this.head.next);
        this.mapping.delete(removedEntry.key);
      }

      this._appendEntryAtTail(entry);
      this.mapping.set(key, entry);
    }
  }

  peek() {
    const lru = this.head.next;
    return lru;
  }
}
