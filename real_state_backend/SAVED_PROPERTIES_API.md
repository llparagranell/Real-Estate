# Saved Properties API Documentation

## Overview
The Saved Properties API allows users to save/bookmark properties to their favorites list and retrieve them later. This feature enables users to keep track of properties they're interested in.

## Base URL
```
/api/v1/saved-properties
```

---

## Endpoints

### 1. Save a Property
**POST** `/api/v1/saved-properties/`

**Authentication:** Required

**Description:** Save a property to the user's favorites/bookmarks

#### Request Body
```json
{
  "propertyId": "clxyz123..."
}
```

#### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| propertyId | string | Yes | ID of the property to save |

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Property saved successfully",
  "data": {
    "id": "saved_id_123",
    "userId": "user123",
    "propertyId": "property123",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "property": {
      "id": "property123",
      "title": "Luxury 3BHK Apartment",
      "description": "Spacious apartment with modern amenities",
      "propertyType": "FLAT",
      "status": "ACTIVE",
      "listingPrice": 8500000,
      "state": "Maharashtra",
      "city": "Mumbai",
      "locality": "Bandra West",
      "address": "Hill View Society, Bandra West, Mumbai",
      "carpetArea": 1200,
      "carpetAreaUnit": "SQFT",
      "category": "Residential",
      "furnishingStatus": "FullyFurnished",
      "numberOfRooms": 3,
      "numberOfBathrooms": 2,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "media": [
        {
          "id": "media1",
          "url": "https://...",
          "key": "s3-key",
          "mediaType": "IMAGE",
          "order": 0
        }
      ],
      "user": {
        "id": "owner123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+919876543210",
        "avatar": "https://..."
      }
    }
  }
}
```

#### Error Response (400 Bad Request)
```json
{
  "message": "Property already saved",
  "data": {
    "id": "saved_id_123",
    "userId": "user123",
    "propertyId": "property123",
    "createdAt": "2024-01-15T10:30:00.000Z"
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

### 2. Get All Saved Properties
**GET** `/api/v1/saved-properties/`

**Authentication:** Required

**Description:** Get all properties saved by the logged-in user

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10, max: 100) |

#### Example Request
```
GET /api/v1/saved-properties/?page=1&limit=10
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "saved_id_123",
      "userId": "user123",
      "propertyId": "property123",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "property": {
        "id": "property123",
        "title": "Luxury 3BHK Apartment",
        "description": "Spacious apartment with modern amenities",
        "propertyType": "FLAT",
        "status": "ACTIVE",
        "listingPrice": 8500000,
        "state": "Maharashtra",
        "city": "Mumbai",
        "locality": "Bandra West",
        "address": "Hill View Society, Bandra West, Mumbai",
        "latitude": 19.0596,
        "longitude": 72.8295,
        "carpetArea": 1200,
        "carpetAreaUnit": "SQFT",
        "category": "Residential",
        "furnishingStatus": "FullyFurnished",
        "availabilityStatus": "ReadyToMove",
        "ageOfProperty": "OneToThree",
        "numberOfRooms": 3,
        "numberOfBathrooms": 2,
        "numberOfBalcony": 2,
        "propertyFacing": "East",
        "amenities": ["Swimming Pool", "Gym", "Parking"],
        "coveredParking": 1,
        "uncoveredParking": 0,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "media": [
          {
            "id": "media1",
            "url": "https://...",
            "key": "s3-key",
            "mediaType": "IMAGE",
            "order": 0,
            "createdAt": "2024-01-15T10:30:00.000Z"
          }
        ],
        "user": {
          "id": "owner123",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "phone": "+919876543210",
          "avatar": "https://..."
        }
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCount": 25,
    "limit": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

### 3. Remove Saved Property (Unsave)
**DELETE** `/api/v1/saved-properties/:propertyId`

**Authentication:** Required

**Description:** Remove a property from the user's saved list

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| propertyId | string | ID of the property to remove |

#### Example Request
```
DELETE /api/v1/saved-properties/property123
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

### 4. Check if Property is Saved
**GET** `/api/v1/saved-properties/check/:propertyId`

**Authentication:** Required

**Description:** Check if a specific property is saved by the user

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| propertyId | string | ID of the property to check |

#### Example Request
```
GET /api/v1/saved-properties/check/property123
```

#### Success Response - Property is Saved (200 OK)
```json
{
  "success": true,
  "isSaved": true,
  "data": {
    "id": "saved_id_123",
    "userId": "user123",
    "propertyId": "property123",
    "createdAt": "2024-01-15T10:30:00.000Z"
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
model SavedProperty {
  id         String   @id @default(cuid())
  userId     String
  propertyId String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())

  @@unique([userId, propertyId]) // Prevent duplicate saves
  @@index([userId])
  @@index([propertyId])
  @@map("saved_properties")
}
```

### Key Features:
- **Unique Constraint:** `@@unique([userId, propertyId])` prevents duplicate saves
- **Cascade Delete:** If user or property is deleted, saved record is automatically removed
- **Indexes:** Optimized for fast queries on userId and propertyId

---

## Setup Instructions

### 1. Generate Prisma Client
After adding the schema, run:
```bash
npm run prisma:generate
```

### 2. Push Schema to Database
```bash
npm run prisma:push
```

### 3. Build and Restart Server
```bash
npm run build
# Then restart your server (pm2/systemctl/etc.)
```

---

## Frontend Integration Examples

### Save a Property
```javascript
const saveProperty = async (propertyId) => {
  const token = localStorage.getItem('accessToken');
  
  try {
    const response = await fetch('/api/v1/saved-properties/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ propertyId })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Property saved!', data);
      return data;
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

### Get Saved Properties
```javascript
const getSavedProperties = async (page = 1, limit = 10) => {
  const token = localStorage.getItem('accessToken');
  
  try {
    const response = await fetch(
      `/api/v1/saved-properties/?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Saved properties:', data.data);
      console.log('Pagination:', data.pagination);
      return data;
    }
  } catch (error) {
    console.error('Error fetching saved properties:', error);
  }
};
```

### Unsave/Remove Property
```javascript
const unsaveProperty = async (propertyId) => {
  const token = localStorage.getItem('accessToken');
  
  try {
    const response = await fetch(`/api/v1/saved-properties/${propertyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Property removed from saved list');
      return true;
    }
  } catch (error) {
    console.error('Error removing property:', error);
  }
};
```

### Check if Property is Saved
```javascript
const checkIfSaved = async (propertyId) => {
  const token = localStorage.getItem('accessToken');
  
  try {
    const response = await fetch(
      `/api/v1/saved-properties/check/${propertyId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const data = await response.json();
    
    if (data.success) {
      return data.isSaved;
    }
  } catch (error) {
    console.error('Error checking saved status:', error);
    return false;
  }
};
```

---

## React Component Example

```jsx
import { useState, useEffect } from 'react';

const SavedPropertiesPage = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSavedProperties = async (page = 1) => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await fetch(
        `/api/v1/saved-properties/?page=${page}&limit=12`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setSavedProperties(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (propertyId) => {
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await fetch(`/api/v1/saved-properties/${propertyId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        // Refresh the list
        fetchSavedProperties(pagination?.currentPage || 1);
      }
    } catch (error) {
      console.error('Error removing property:', error);
    }
  };

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="saved-properties">
      <h1>My Saved Properties ({pagination?.totalCount || 0})</h1>
      
      {savedProperties.length === 0 ? (
        <p>No saved properties yet. Start exploring and save your favorites!</p>
      ) : (
        <div className="properties-grid">
          {savedProperties.map(({ property, id }) => (
            <div key={id} className="property-card">
              <img src={property.media[0]?.url} alt={property.title} />
              <h3>{property.title}</h3>
              <p>{property.city}, {property.state}</p>
              <p>₹{property.listingPrice?.toLocaleString()}</p>
              <button onClick={() => handleUnsave(property.id)}>
                Remove from Saved
              </button>
            </div>
          ))}
        </div>
      )}
      
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={!pagination.hasPreviousPage}
            onClick={() => fetchSavedProperties(pagination.currentPage - 1)}
          >
            Previous
          </button>
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
          <button 
            disabled={!pagination.hasNextPage}
            onClick={() => fetchSavedProperties(pagination.currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedPropertiesPage;
```

### Save Button Component
```jsx
import { useState, useEffect } from 'react';

const SavePropertyButton = ({ propertyId }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkSavedStatus = async () => {
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await fetch(
        `/api/v1/saved-properties/check/${propertyId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      const data = await response.json();
      setIsSaved(data.isSaved);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    
    try {
      if (isSaved) {
        // Unsave
        await fetch(`/api/v1/saved-properties/${propertyId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setIsSaved(false);
      } else {
        // Save
        await fetch('/api/v1/saved-properties/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ propertyId })
        });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSavedStatus();
  }, [propertyId]);

  return (
    <button 
      onClick={toggleSave} 
      disabled={loading}
      className={isSaved ? 'saved' : 'unsaved'}
    >
      {isSaved ? '❤️ Saved' : '🤍 Save'}
    </button>
  );
};

export default SavePropertyButton;
```

---

## Testing with cURL

```bash
# Save a property
curl -X POST "http://localhost:4000/api/v1/saved-properties/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"propertyId": "property123"}'

# Get saved properties
curl "http://localhost:4000/api/v1/saved-properties/?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check if property is saved
curl "http://localhost:4000/api/v1/saved-properties/check/property123" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Unsave a property
curl -X DELETE "http://localhost:4000/api/v1/saved-properties/property123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthorized User"
}
```

### 404 Not Found
```json
{
  "message": "Property not found"
}
```
or
```json
{
  "message": "Saved property not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Use Cases

1. **Property Wishlist:** Users can save properties they like for later viewing
2. **Comparison:** Save multiple properties to compare them side by side
3. **Share with Family:** Save properties to discuss with family members
4. **Track Favorites:** Keep track of properties before making a decision
5. **Quick Access:** Easily access saved properties without searching again

---

## Performance Considerations

- Unique constraint prevents duplicate saves
- Indexes on userId and propertyId for fast queries
- Pagination prevents loading too many properties at once
- Cascade delete automatically cleans up when user/property is deleted
- Full property details included to minimize additional API calls
