# Property Search API

## Search Properties Endpoint
Search for properties by title and location. Returns only **ACTIVE** status properties.

### Endpoint
```
GET /api/properties/search
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | No | Universal search text - searches across title, state, city, locality, subLocality, area, and address (case-insensitive, partial match) |
| sortBy | enum | No | Sort results: `price_asc`, `price_desc`, `created_desc` (default), `created_asc` |
| page | number | No | Page number for pagination (default: 1, min: 1) |
| limit | number | No | Number of results per page (default: 10, min: 1, max: 100) |

### Features
- **Universal Search**: Single `query` parameter searches across title AND all location fields (state, city, locality, subLocality, area, address) using OR logic
- **Smart Matching**: Searches "Bhopal" will find properties with "Bhopal" in title, city, locality, or address
- **Active Properties Only**: Automatically filters to show only properties with `ACTIVE` status
- **Pagination**: Built-in pagination support
- **Sorting**: Sort by price or creation date in ascending/descending order

### Example Requests

#### Search by title
```bash
GET /api/v1/property/search?query=Villa
```

#### Search by location (anywhere in address fields)
```bash
GET /api/v1/property/search?query=Bhopal
# This will find properties where "Bhopal" appears in city, state, locality, address, etc.
```

#### Search for specific locality
```bash
GET /api/v1/property/search?query=Arera%20Colony
# This will match properties with "Arera Colony" in locality, subLocality, or address
```

#### Universal search with sorting
```bash
GET /api/v1/property/search?query=Apartment&sortBy=price_asc
# Finds "Apartment" in any field (title or locations) sorted by price
```

#### Search with pagination
```bash
GET /api/v1/property/search?query=2BHK&page=2&limit=20
```

#### Get all active properties
```bash
GET /api/v1/property/search
# No query parameter returns all ACTIVE properties
```

### Response Format

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx...",
      "title": "Beautiful 3BHK Apartment",
      "description": "Spacious apartment with modern amenities",
      "propertyType": "FLAT",
      "status": "ACTIVE",
      "listingPrice": 5000000,
      "state": "Madhya Pradesh",
      "city": "Bhopal",
      "locality": "Arera Colony",
      "subLocality": "Green Valley Society",
      "address": "123 Main Street",
      "latitude": 23.2599,
      "longitude": 77.4126,
      "carpetArea": 1200,
      "carpetAreaUnit": "SQFT",
      "category": "Residential",
      "furnishingStatus": "SemiFurnished",
      "numberOfRooms": 3,
      "numberOfBathrooms": 2,
      "numberOfBalcony": 1,
      "amenities": ["Parking", "Gym", "Swimming Pool"],
      "createdAt": "2026-02-25T10:00:00.000Z",
      "updatedAt": "2026-02-25T10:00:00.000Z",
      "userId": "clyyyy...",
      "media": [
        {
          "id": "clzzz...",
          "url": "https://...",
          "key": "properties/...",
          "mediaType": "IMAGE",
          "order": 0
        }
      ],
      "user": {
        "id": "clyyyy...",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+911234567890",
        "avatar": "https://..."
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 50,
    "limit": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

#### Error Response (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Notes
- **Universal Search**: The `query` parameter searches across title, state, city, locality, subLocality, area, and address fields
- **OR Logic**: Matches if the query appears in ANY of the searchable fields (not all)
- **Case-Insensitive**: All searches ignore case
- **Partial Matching**: Searches use substring matching (e.g., "Bho" will match "Bhopal")
- **Active Only**: Automatically filters out non-active properties (DRAFT, UNLISTED, SOLDOFFLINE, etc.)
- **Pagination**: Maximum limit per page is 100 items
- **Complete Data**: Results include property media and owner information

### Use Cases
1. **Smart Search**: Users can search for anything - property titles, locations, localities all in one search box
2. **Location Discovery**: Search "Bhopal" and get all properties in Bhopal (city, locality, or address)
3. **Property Type Search**: Search "Villa", "Apartment", "2BHK" to find matching properties
4. **Combined Search**: Search "Luxury Villa Bhopal" to find properties matching any of these terms
5. **Browse Active Listings**: Get all active properties without any filters
