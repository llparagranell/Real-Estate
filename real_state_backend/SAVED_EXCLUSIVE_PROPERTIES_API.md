# Saved Exclusive Properties API Documentation

## Overview
The Saved Exclusive Properties API allows users to save/bookmark exclusive properties to their favorites list and retrieve them later.

## Base URL
```
/api/v1/saved-exclusive-properties
```

---

## Endpoints

### 1. Save an Exclusive Property
**POST** `/api/v1/saved-exclusive-properties/`

**Authentication:** Required

**Description:** Save an exclusive property to the user's favorites/bookmarks.

#### Request Body
```json
{
  "propertyId": "cmmoz62uc0000s0ij5k2xe7wd"
}
```

#### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| propertyId | string | Yes | ID of the exclusive property to save |

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Property saved successfully",
  "data": {
    "id": "cmsaved123",
    "userId": "cmuser123",
    "exclusivePropertyId": "cmmoz62uc0000s0ij5k2xe7wd",
    "createdAt": "2026-03-14T10:30:00.000Z",
    "exclusiveProperty": {
      "id": "cmmoz62uc0000s0ij5k2xe7wd",
      "title": "Exclusive 3BHK Apartment",
      "status": "ACTIVE",
      "listingPrice": 8500000,
      "city": "Mumbai",
      "state": "Maharashtra",
      "locality": "Bandra West",
      "fixedRewardGems": 100,
      "media": [
        {
          "id": "cmmedia1",
          "exclusivePropertyId": "cmmoz62uc0000s0ij5k2xe7wd",
          "url": "https://...",
          "key": "exclusive/media/key-1",
          "mediaType": "IMAGE",
          "order": 0,
          "createdAt": "2026-03-14T10:30:00.000Z"
        }
      ]
    }
  }
}
```

#### Error Response (400 Bad Request)
```json
{
  "message": "Property already saved",
  "data": {
    "id": "cmsaved123",
    "userId": "cmuser123",
    "exclusivePropertyId": "cmmoz62uc0000s0ij5k2xe7wd",
    "createdAt": "2026-03-14T10:30:00.000Z"
  }
}
```

#### Error Response (404 Not Found)
```json
{
  "message": "Property not found"
}
```

---

### 2. Get All Saved Exclusive Properties
**GET** `/api/v1/saved-exclusive-properties/`

**Authentication:** Required

**Description:** Get all exclusive properties saved by the logged-in user.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10, max: 100) |

#### Example Request
```
GET /api/v1/saved-exclusive-properties/?page=1&limit=10
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "cmsaved123",
      "userId": "cmuser123",
      "exclusivePropertyId": "cmmoz62uc0000s0ij5k2xe7wd",
      "createdAt": "2026-03-14T10:30:00.000Z",
      "exclusiveProperty": {
        "id": "cmmoz62uc0000s0ij5k2xe7wd",
        "title": "Exclusive 3BHK Apartment",
        "description": "Premium exclusive inventory",
        "status": "ACTIVE",
        "listingPrice": 8500000,
        "city": "Mumbai",
        "state": "Maharashtra",
        "locality": "Bandra West",
        "fixedRewardGems": 100,
        "media": [
          {
            "id": "cmmedia1",
            "exclusivePropertyId": "cmmoz62uc0000s0ij5k2xe7wd",
            "url": "https://...",
            "key": "exclusive/media/key-1",
            "mediaType": "IMAGE",
            "order": 0,
            "createdAt": "2026-03-14T10:30:00.000Z"
          }
        ]
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalCount": 15,
    "limit": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

### 3. Remove Saved Exclusive Property (Unsave)
**DELETE** `/api/v1/saved-exclusive-properties/:propertyId`

**Authentication:** Required

**Description:** Remove an exclusive property from the user's saved list.

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| propertyId | string | Exclusive property ID to remove |

#### Example Request
```
DELETE /api/v1/saved-exclusive-properties/cmmoz62uc0000s0ij5k2xe7wd
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Property removed from saved list"
}
```

#### Error Response (404 Not Found)
```json
{
  "message": "Saved property not found"
}
```

---

### 4. Check if Exclusive Property is Saved
**GET** `/api/v1/saved-exclusive-properties/check/:propertyId`

**Authentication:** Required

**Description:** Check if a specific exclusive property is saved by the user.

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| propertyId | string | Exclusive property ID to check |

#### Example Request
```
GET /api/v1/saved-exclusive-properties/check/cmmoz62uc0000s0ij5k2xe7wd
```

#### Success Response - Property is Saved (200 OK)
```json
{
  "success": true,
  "isSaved": true,
  "data": {
    "id": "cmsaved123",
    "userId": "cmuser123",
    "exclusivePropertyId": "cmmoz62uc0000s0ij5k2xe7wd",
    "createdAt": "2026-03-14T10:30:00.000Z"
  }
}
```

#### Success Response - Property is Not Saved (200 OK)
```json
{
  "success": true,
  "isSaved": false,
  "data": null
}
```

---

## Database Schema

```prisma
model SavedExclusiveProperty {
  id                  String            @id @default(cuid())
  userId              String
  exclusivePropertyId String
  user                User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  exclusiveProperty   ExclusiveProperty @relation(fields: [exclusivePropertyId], references: [id], onDelete: Cascade)
  createdAt           DateTime          @default(now())

  @@unique([userId, exclusivePropertyId])
  @@index([userId])
  @@index([exclusivePropertyId])
  @@map("saved_exclusive_properties")
}
```

### Key Features
- Unique constraint on `(userId, exclusivePropertyId)` prevents duplicate saves.
- Cascade delete keeps data clean when user or exclusive property is deleted.
- Indexed fields support fast lookup and pagination.

---

## Frontend Integration Notes

1. `propertyId` in request means the **exclusive property ID**.
2. Use this API only for exclusive property cards/details.
3. Normal property saves continue to use `/api/v1/saved-properties`.
4. Use `/check/:propertyId` for bookmark icon state on card load.
