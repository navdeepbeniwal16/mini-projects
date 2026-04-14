# mini-projects

Implementations of algorithms, data structures and other fundamental building blocks of modern software systems that I want to actually understand, e.g. LRU caches, rate limiters, that kind of thing. All in vanilla JavaScript.

With modern frameworks, now followed by AI Assisted coding, it's easier to get lost on shipping more and more features without taking a pause to understand how some of the things work. Also, I got tired of knowing _what_ these things do without being able to build one from scratch. So this is me fixing that!

## Rules I've set for myself

- No LLMs writing code for me. I'm only using AI for specs, tests, and as a tutor while I'm stuck — not to write the implementation.
- Start from a spec, build it, test it.
- Think about time and space complexity as I go.

## Projects

| Project             | Description                                 |
| ------------------- | ------------------------------------------- |
| [LRU Cache](./lru/) | Doubly linked list + Map. O(1) get and put. |

## Tests

```bash
npx jest lru/   # run/test an individual project
npx jest        # run/test all projects
```
