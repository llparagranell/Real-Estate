# Exclusive Properties App API Documentation

## Overview
This document is for app frontend integration of user-facing exclusive properties.

Admin exclusive property APIs already exist separately.

---

## Base Path
`/api/v1/user/exclusive-properties`

---

## 1. Get Exclusive Properties (List)

**Endpoint:** `GET /api/v1/user/exclusive-properties`

**Auth Required:** No

**Description:**
Returns paginated exclusive properties for app listing/cards.

### Query Params
- `page` (optional, number, default: `1`)
- `limit` (optional, number, default: `10`, max: `100`)
- `status` (optional, string, default: `ACTIVE`)
  - Allowed: `ACTIVE`, `SOLD_OUT`, `ARCHIVED`
  - If invalid value is sent, API falls back to `ACTIVE`

### Example Request
```bash
curl -X GET "http://localhost:5000/api/v1/user/exclusive-properties?page=1&limit=10&status=ACTIVE"
```

### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "cm9x8abc123",
      "title": "Premium Lake View Apartment",
      "status": "ACTIVE",
      "listingPrice": 7800000,
      "city": "Bhopal",
      "locality": "Arera Colony",
      "subLocality": "Green Heights",
      "numberOfRooms": 3,
      "numberOfBathrooms": 2,
      "numberOfBalcony": 2,
      "numberOfFloors": 12,
      "furnishingStatus": "FullyFurnished",
      "fixedRewardGems": 300,
      "imageUrl": "https://your-cdn.com/exclusive/property-1.jpg",
      "createdAt": "2026-03-10T08:00:00.000Z",
      "updatedAt": "2026-03-12T09:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 24,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

### Empty Response (200)
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

### Error Response (500)
```json
{
  "message": "Internal server error"
}
```

---

## 2. Get Exclusive Property Detail

**Endpoint:** `GET /api/v1/user/exclusive-properties/:exclusivePropertyId`

**Auth Required:** No

**Description:**
Returns full details of a single exclusive property for detail screen.

Note: This endpoint currently returns only `ACTIVE` exclusive properties.

### Example Request
```bash
curl -X GET "http://localhost:5000/api/v1/user/exclusive-properties/cm9x8abc123"
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "cm9x8abc123",
    "title": "Premium Lake View Apartment",
    "description": "Spacious apartment with premium amenities",
    "propertyType": "FLAT",
    "status": "ACTIVE",
    "listingPrice": 7800000,
    "city": "Bhopal",
    "locality": "Arera Colony",
    "address": "A-401, Green Heights",
    "fixedRewardGems": 300,
    "media": [
      {
        "id": "cm9x9m1",
        "exclusivePropertyId": "cm9x8abc123",
        "url": "https://your-cdn.com/exclusive/property-1.jpg",
        "key": "exclusive/images/property-1.jpg",
        "mediaType": "IMAGE",
        "order": 0,
        "createdAt": "2026-03-10T08:00:00.000Z"
      }
    ],
    "createdAt": "2026-03-10T08:00:00.000Z",
    "updatedAt": "2026-03-12T09:30:00.000Z"
  }
}
```

### Not Found (404)
```json
{
  "message": "Exclusive property not found"
}
```

### Bad Request (400)
```json
{
  "message": "exclusivePropertyId is required"
}
```

### Error Response (500)
```json
{
  "message": "Internal server error"
}
```

---

## Frontend Notes

1. Listing API includes `imageUrl` for card thumbnail (first IMAGE media).
2. Detail API returns sorted `media` array by `order` ascending.
3. For app home/discovery use default status (ACTIVE) only.
4. If needed, app can fetch sold/archived tabs using `status=SOLD_OUT` and `status=ARCHIVED`.
