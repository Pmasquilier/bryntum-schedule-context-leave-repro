# ScheduleContext (hover) stays after the pointer leaves the time axis

Minimal repro for Bryntum support. Scheduler Pro 7.3.7, plain JS + Vite, `scheduleContext: { triggerEvent: 'hover' }`,
no events, 3 resources.

## Run

```sh
npm install   # needs access to npm.bryntum.com
npm run dev   # http://localhost:5193/
npm run repro # in another terminal, headless
```

## Steps

1. Hover the first day of any row: the cell is highlighted.
2. Move the pointer left onto the resource name (locked grid).

Expected: the highlight goes away.
Actual: it stays until the pointer comes back into the time axis.

Same when leaving below the last row, upwards onto the header, or out of the scheduler (`repro.mjs` checks the four exits, 4/4 on every run, 3 runs out of 3).

## Cause seen in the source

`Scheduler/view/mixin/TimelineDomEvents.js:149-153` listens to `mouseleave` on `timeAxisSubGridElement`, and
`handleScheduleLeaveEvent` (`:230-234`) calls `handleScheduleEvent(event)` again with the leave event instead of
clearing the context. We think the leave coordinates still resolve to the edge cell, so the context is kept.
