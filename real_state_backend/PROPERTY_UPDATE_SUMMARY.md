# Property API Update Summary

## ✅ What Was Updated

### 1. Database Schema (Prisma)
**File:** `prisma/schema.prisma`

#### New Enums Added:
- `Category`: Residential | Commercial | FarmLand
- `FurnishingStatus`: FullyFurnished | SemiFurnished | Unfurnished | FencedWired | FertileLand | OpenLand | Cultivated
- `AvailabilityStatus`: ReadyToMove | UnderConstruction
- `AgeOfProperty`: ZeroToOne | OneToThree | ThreeToSix | SixToTen | TenPlus
- `CarpetAreaUnit`: SQFT | SQM | ACRES
- `PropertyFacing`: East | West | North | South | NorthEast | NorthWest | SouthEast | SouthWest

#### Updated Property Model:
**Price Changes:**
- ✅ Added: `listingPrice` (Float) - Single price instead of range
- ⚠️ Deprecated: `priceMin` and `priceMax` (kept for backward compatibility)

**Location Changes:**
- ✅ Added: `locality` (String?) - Main locality name
- ✅ Added: `subLocality` (String?) - Society/Building name
- ✅ Added: `flatNo` (String?) - Flat/House number

**Size/Area Changes:**
- ✅ Added: `carpetArea` (Float?)
- ✅ Added: `carpetAreaUnit` (CarpetAreaUnit?)
- ⚠️ Deprecated: `size` and `sizeUnit` (kept for backward compatibility)

**New Property Details:**
- ✅ `category` (Category?)
- ✅ `furnishingStatus` (FurnishingStatus?)
- ✅ `availabilityStatus` (AvailabilityStatus?)
- ✅ `ageOfProperty` (AgeOfProperty?)
- ✅ `numberOfRooms` (Int?)
- ✅ `numberOfBathrooms` (Int?)
- ✅ `numberOfBalcony` (Int?)
- ✅ `numberOfFloors` (Int?)
- ✅ `propertyFloor` (String?)

**Price Flags:**
- ✅ `allInclusivePrice` (Boolean, default: false)
- ✅ `negotiablePrice` (Boolean, default: false)
- ✅ `govtChargesTaxIncluded` (Boolean, default: false)

**Other Details:**
- ✅ `propertyFacing` (PropertyFacing?)
- ✅ `amenities` (String[]) - Array of amenity names
- ✅ `locationAdvantages` (String[]) - Array of location advantages
- ✅ `coveredParking` (Int, default: 0)
- ✅ `uncoveredParking` (Int, default: 0)

---

### 2. Validators
**File:** `src/validators/property.validators.ts`

- Updated `addPropertySchema` with all new fields
- Updated `updatePropertySchema` with all new fields (all optional)
- Added validation for new enums
- Fixed type exports

---

### 3. Controllers
**File:** `src/controllers/properties/property.controller.ts`

- No major changes needed (uses spread operator, so new fields handled automatically)
- Fixed TypeScript type issues
- All existing endpoints continue to work

---

## 🚀 Next Steps

### 1. Set Up Environment Variables
Make sure your `.env` file has:
```env
DATABASE_URL="postgres://YOUR_CONNECTION_STRING"
AWS_S3_BUCKET=your-bucket-name
# (not S3_BUCKET_NAME)
```

### 2. Run Database Migration
```bash
# Generate Prisma Client with new schema
npm run prisma:generate

# Push schema changes to your database
npm run prisma:push
```

⚠️ **Important:** The `prisma:push` command will add new columns to your existing `properties` table. All new fields are optional, so existing data won't be affected.

### 3. Test the API

#### Example: Create Property with New Fields
```bash
curl -X POST http://localhost:4000/api/v1/property \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Beautiful 3BHK Apartment",
    "propertyType": "FLAT",
    "listingPrice": 5000000,
    "state": "Madhya Pradesh",
    "city": "Bhopal",
    "locality": "Arera Colony",
    "subLocality": "Green Heights",
    "flatNo": "A-401",
    "address": "A-401, Green Heights, Arera Colony, Bhopal",
    "latitude": 23.2156,
    "longitude": 77.4212,
    "carpetArea": 1200,
    "carpetAreaUnit": "SQFT",
    "category": "Residential",
    "furnishingStatus": "FullyFurnished",
    "availabilityStatus": "ReadyToMove",
    "ageOfProperty": "OneToThree",
    "numberOfRooms": 3,
    "numberOfBathrooms": 2,
    "numberOfBalcony": 2,
    "propertyFloor": "4",
    "negotiablePrice": true,
    "propertyFacing": "East",
    "amenities": ["Lifts", "Park", "Security"],
    "locationAdvantages": ["Close to School", "Close to Metro"],
    "coveredParking": 1,
    "media": [{
      "url": "https://your-s3-url.com/image.jpg",
      "key": "property/images/key.jpg",
      "mediaType": "IMAGE",
      "order": 0
    }]
  }'
```

---

## 📚 Documentation

Created comprehensive documentation:
- **PROPERTY_API.md** - Complete API documentation with all endpoints and examples
- **UPLOAD_API.md** - File upload documentation (created earlier)

---

## 🔄 Backward Compatibility

Old fields still work but are deprecated:
- `priceMin` / `priceMax` → Use `listingPrice`
- `size` / `sizeUnit` → Use `carpetArea` / `carpetAreaUnit`
- `area` → Use `locality`

**Frontend Migration Path:**
1. Update frontend to send new fields
2. Old data will continue to work
3. Gradually migrate to new field names

---

## 🎯 Key Features

### Price Management
- Single `listingPrice` instead of range
- Boolean flags for price details (negotiable, all-inclusive, tax included)

### Enhanced Location
- Hierarchical location: state → city → locality → subLocality → flatNo
- Better address management

### Comprehensive Property Details
- Room counts (bedrooms, bathrooms, balconies)
- Floor information
- Property age and availability status
- Furnishing details

### Modern Amenities
- Array-based amenities and location advantages
- Flexible property facing
- Parking information (covered/uncovered)

---

## 📋 Field Mapping Reference

| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `priceMin` | `listingPrice` | Use single price |
| `priceMax` | (removed) | No longer needed |
| `size` | `carpetArea` | More specific |
| `sizeUnit` | `carpetAreaUnit` | Matches new field |
| `area` | `locality` | Better naming |
| - | `subLocality` | New: Society/Building |
| - | `flatNo` | New: Flat number |
| - | `category` | New: Property category |
| - | `furnishingStatus` | New: Furnishing details |
| - | `amenities` | New: Array of amenities |
| - | Many more... | See schema |

---

## ⚠️ Important Notes

1. **Database Migration Required:** Run `npm run prisma:push` after setting up `.env`
2. **S3 Bucket Name:** Use `AWS_S3_BUCKET` (not `S3_BUCKET_NAME`)
3. **All New Fields Optional:** Won't break existing data
4. **Media Required:** At least one media item required when creating property

---

## 🐛 Troubleshooting

### "DATABASE_URL is required" Error
**Solution:** Make sure `.env` file has correct `DATABASE_URL`

### "Missing AWS env vars" Error
**Solution:** Change `S3_BUCKET_NAME` to `AWS_S3_BUCKET` in `.env`

### Prisma Client Type Errors
**Solution:** Run `npm run prisma:generate` after schema changes

### Old Properties Missing New Fields
**Expected:** New fields are optional, old properties return `null` for new fields

---

## 🎉 Ready to Use!

Your property API now supports comprehensive property listings with:
✅ 20+ new fields for detailed property information
✅ Backward compatibility with existing data
✅ Modern, scalable architecture
✅ Complete validation and type safety

For detailed API documentation, see **PROPERTY_API.md**
