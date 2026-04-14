// LURCache
export default class LRUCache {
  capacity = 5; // Default capacity
  occupancy = 0;
  head = {
    key: null,
    value: null,
    prev: null,
    next: null,
  }; // head.next is the LRU (least recently used element)
  tail = {
    key: null,
    value: null,
    prev: null,
    next: null,
  }; // tail.prev is the MRU (most recently used element)

  mapping = new Map(); // key to entry object reference mapping

  constructor(capacity) {
    if (capacity != null && capacity != undefined) {
      this.capacity = capacity;
    }

    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  getCapacity() {
    return this.capacity;
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
      // entry already present
      const entryRef = this.mapping.get(key);
      entryRef.value = value;
      this._markRecentlyUsed(entryRef);
    } else {
      // create a new entry
      const entry = {
        key: key,
        value: value,
        prev: null,
        next: null,
      };

      if (this.occupancy < this.capacity) {
        // occupancy available - add new entry as MRU
        this._appendEntryAtTail(entry);
        this.occupancy += 1;
      } else {
        // no occupancy available - remove lru, and add new entry as mru
        const removedEntry = this._removeEntry(this.head.next);
        this._appendEntryAtTail(entry);

        this.mapping.delete(removedEntry.key); // remove removed entry from mapping
      }

      this.mapping.set(key, entry); // update entry ref in mapping
    }
  }

  peek() {
    const lru = this.head.next;
    console.log(`LRU: (${lru.key}, ${lru.value})`);
  }

  dllIterate() {
    let ref = this.head.next;
    while (ref != this.tail) {
      console.log(`Key ${ref.key}, Value: ${ref.value}`);
      ref = ref.next;
    }
  }
}
