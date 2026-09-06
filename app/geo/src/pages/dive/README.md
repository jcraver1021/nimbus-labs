# A Dive Through Deep Time

A scrollable dive from today down to the formation of Earth. One of the
[geo app's pages](../../../README.md#pages).

## How to read it

1. **Scroll down to dig into the past.** The top of the page is the surface — today — and every
   block below it is older than the one above. The floor, 4.6 billion years down, is where the rock
   record runs out.
2. **The block crossing the depth marker is the active one.** The marker is the faint line a third
   of the way down the column; the active block's card lifts and slides slightly right.
3. **The rail on the far left jumps and scrubs.** Drag the slider to travel anywhere in the 4.6
   billion years, or use the buttons to land on the present, the start of any eon, or the very
   bottom.
4. **The panel on the right describes wherever the marker is.** It follows the active block.

## Layout

```text
┌────────────┬───────────────────────────────────┬──────────────────────┐
│   DEPTH    │            STRATA                 │     EARTH STATE      │
├────────────┼───────────────────────────────────┼──────────────────────┤
│            │  Today · the surface              │ The world at         │
│  slider    │ ┌───────────────────────────────┐ │ 79.8M years ago      │
│    │       │ │ PHANEROZOIC › CENOZOIC › …    │ │                      │
│    ●       │ │ Paleocene                     │ │ Late Cretaceous      │
│    │       │ │ The world just after the …    │ │                      │
│    │       │ └───────────────────────────────┘ │ Water coverage  85%  │
│            │ ─────────── depth marker ───────  │ Sea level  +250 m    │
│  Present   │ ┌───────────────────────────────┐ │ Land  Laurasia, …    │
│  Phanero…  │ │ Late Cretaceous               │ │ Atmosphere  26% O₂ … │
│  Protero…  │ │ Peak flooding — shallow seas  │ │ Temperature  25 °C   │
│  Archean   │ └───────────────────────────────┘ │ Day length  23.6 h   │
│  Hadean    │             ⋮                     │ Moon  0.52° across   │
│  Earth …   │  Earth forms · 4.60B years ago    │                      │
└────────────┴───────────────────────────────────┴──────────────────────┘
```

## The spine

The geologic time scale overlaps by design: an eon, its eras, their periods, and their epochs are
all separate divisions covering the same years. A scroll through it has to pick one level per
stretch of time, which `buildDiveSpine` does by walking from the present to Earth's formation and
taking the finest division defined at each step:

| Stretch                               | Level used | Why                                                  |
| ------------------------------------- | ---------- | ---------------------------------------------------- |
| Phanerozoic, except the Carboniferous | Epoch      | Epochs are defined throughout                        |
| Carboniferous                         | Sub-epoch  | Divided into Mississippian/Pennsylvanian, not epochs |
| Proterozoic                           | Period     | Nothing finer is defined                             |
| Archean                               | Era        | Nothing finer is defined                             |
| Hadean                                | Eon        | Undivided                                            |

That comes to 48 blocks with no gaps and no overlaps, which the tests assert directly.

## Depth is a block count, not a time axis

The Holocene lasted 11,700 years and the Hadean lasted 600 million. A scroll scaled to duration
would make all but a handful of blocks invisible, so every block is the same height instead. The
consequence worth knowing: **vertical distance is not proportional to time**. The slider is a
position in the sequence, not a date.

Two things fall out of that choice, both in `utils/diveLayout.ts`:

- The surface band above the first block is exactly as tall as the depth marker's offset into the
  viewport, and the floor below the last block is the rest of it. That makes scroll offset and depth
  the same measurement — the top of the scroll is the present, the bottom is Earth's formation, and
  nothing has to measure the DOM to convert between them.
- All the geometry is pure arithmetic over the block index, so the slider, the jump buttons, and the
  active-block logic are unit-testable without a layout engine.

## Facts, and where they come from

The curated per-division facts — water coverage, sea level, continents, atmosphere, temperature —
come from [`@nimbus-labs/deeptime`](../../../../../lib/deeptime/EARTH_STATE.md), resolved so that a
block inherits anything it doesn't record itself from the divisions containing it. When that happens
the panel says so.

The sky is different: day length, days per year, and the Moon's distance and apparent size are
computed from the _exact_ time under the marker rather than from the block, so they shift
continuously as you scroll instead of jumping at each boundary.

## Colors

Every block's band is the division's own International Commission on Stratigraphy color, blended
into its neighbours' so the column reads as one continuous core sample rather than a stack of cards.
A dark overlay deepens with depth, which is what makes the dive feel like digging — and why the
block cards carry their own light background, so their text stays readable four billion years down.
