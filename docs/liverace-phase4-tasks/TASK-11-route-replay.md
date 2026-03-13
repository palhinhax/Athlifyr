# TASK-11: Athlete Route Replay (Basic Map)

## Summary

After a race is finished, display the race route on a map with start/finish markers
and basic information. This is the MVP version — full athlete-specific GPS replay
requires track persistence (future work beyond Phase 4).

---

## Type

`feat(results)`

## Priority

**Low** — Nice-to-have, limited by current architecture

## Estimate

3–5 Story Points

---

## User Story

> As an **athlete**, I want to see the race route on a map after the event finishes,
> so that I can review the course and share it.

---

## Acceptance Criteria

### MVP Scope (Route Display Only)

- [ ] Event result page shows the race route on a Mapbox map
- [ ] Route line drawn from `EventRoute.routePoints`
- [ ] Start checkpoint marked with green pin
- [ ] Finish checkpoint marked with red pin (checkered flag)
- [ ] Intermediate checkpoints shown with numbered markers
- [ ] Route info displayed: total distance, elevation gain
- [ ] Map fits to route bounds automatically
- [ ] Available on event public page when `liveStatus = FINISHED`

### NOT in MVP Scope (Deferred)

- ❌ Athlete-specific GPS track replay (requires persisting tracking points)
- ❌ Time-scrubbing animation
- ❌ Split times overlay on route
- ❌ Comparison between athletes

### Data Source

- [ ] Route points from `EventRoute.routePoints` (JSON array of `[lat, lng]`)
- [ ] Checkpoints from `RouteCheckpoint` model (name, type, lat/lng)
- [ ] Variant metadata from `EventVariant` (distance, elevation)

---

## Technical Implementation

### Component to Create

```
components/race-route-map.tsx
```

### Props

```typescript
interface RaceRouteMapProps {
  routePoints: [number, number][]; // [lat, lng] pairs
  checkpoints: {
    name: string;
    type: "START" | "FINISH" | "INTERMEDIATE";
    order: number;
    latitude: number;
    longitude: number;
  }[];
  distanceKm?: number;
  elevationGainM?: number;
}
```

### Placement

Add to the event public page when results exist:

```
app/[locale]/events/[slug]/page.tsx
```

Or as part of a dedicated results page:

```
app/[locale]/events/[slug]/results/page.tsx
```

### API for Route Data

Existing route data can be served via:

```
GET /api/events/[id]/route?variantId=...
```

Or fetched server-side in the page component.

### Map Implementation

Use Mapbox GL JS (already integrated in the project):

```typescript
// Draw route line
map.addSource("route", {
  type: "geojson",
  data: {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: routePoints.map(([lat, lng]) => [lng, lat]),
    },
  },
});

// Add checkpoint markers
checkpoints.forEach((cp) => {
  new mapboxgl.Marker({ color: getMarkerColor(cp.type) })
    .setLngLat([cp.longitude, cp.latitude])
    .setPopup(new mapboxgl.Popup().setText(cp.name))
    .addTo(map);
});
```

---

## Architectural Note — Future Track Replay

Currently, GPS tracking points are not persisted (in-memory only during live race).
For athlete-specific replay in the future, one of these approaches is needed:

1. **Persist simplified track** — before room teardown (60s grace period), export
   each athlete's GPS track as a simplified polyline to the database or file storage
2. **Real-time export** — stream GPS points to cold storage (S3/Backblaze) during
   the race for later replay
3. **Athlete-initiated download** — let athletes download their GPX track during
   the race via the mobile app

This is explicitly deferred to Phase 5+.

---

## Dependencies

- Mapbox GL JS (existing integration)
- `EventRoute.routePoints` (existing data)
- `RouteCheckpoint` model (existing)

## Blocked By

None

## Blocks

None

---

## Testing

- [ ] Map renders with route line
- [ ] START checkpoint shown with green marker
- [ ] FINISH checkpoint shown with red marker
- [ ] Intermediate checkpoints shown with numbered markers
- [ ] Route info (distance, elevation) displayed
- [ ] Map fits to route bounds
- [ ] Only shown when `liveStatus = FINISHED`
- [ ] Handles missing route data gracefully
- [ ] Mobile responsive (map resizes properly)
