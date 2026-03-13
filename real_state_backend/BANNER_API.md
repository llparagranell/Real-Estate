# Banner API Documentation

## Overview
This document is for the app frontend team to integrate user-facing banners.

Admin banner APIs are already available separately. The endpoint below is for app display.

---

## User App Banner Endpoint

### Get Active Banners
**GET** `/api/v1/user/banners`

**Auth Required:** No

**Description:**
Returns all active banners that should be shown in the app.

**Sorting:**
- Ordered by `updatedAt` in descending order (latest updated first)

### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "cm9x8abc123",
      "title": "Summer Property Deals",
      "image": "https://your-cdn.com/banners/summer-deals.jpg",
      "createdAt": "2026-03-12T10:20:30.000Z",
      "updatedAt": "2026-03-13T08:45:00.000Z"
    },
    {
      "id": "cm9x8xyz456",
      "title": "Premium Homes Week",
      "image": "https://your-cdn.com/banners/premium-homes.jpg",
      "createdAt": "2026-03-10T09:00:00.000Z",
      "updatedAt": "2026-03-11T12:00:00.000Z"
    }
  ]
}
```

### Empty State Response (200)
```json
{
  "success": true,
  "data": []
}
```

### Error Response (500)
```json
{
  "message": "Internal server error"
}
```

---

## Banner Object Fields

- `id` (string): Banner unique id
- `title` (string | null): Optional title for display
- `image` (string): Banner image URL
- `createdAt` (string): ISO datetime
- `updatedAt` (string): ISO datetime

---

## Frontend Integration Notes

1. Use `data` array directly for app carousel/slider.
2. If `title` is null, hide title text UI for that slide.
3. If `data` is empty, hide banner section or show fallback UI.
4. This API only returns `ACTIVE` banners.

---

## Suggested TypeScript Type

```ts
export type AppBanner = {
  id: string;
  title: string | null;
  image: string;
  createdAt: string;
  updatedAt: string;
};
```
