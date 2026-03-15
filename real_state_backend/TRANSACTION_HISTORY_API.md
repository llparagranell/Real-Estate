# User Transaction History API Documentation

## Endpoint

### Get Authenticated User Transaction History
**GET** `/api/v1/user/transactions`

**Description:**
Returns the logged-in user's gem transaction history with pagination. This endpoint only returns transactions belonging to the authenticated user.

**Headers:**
```http
Authorization: Bearer <token>
```

## Query Parameters

All query parameters are optional.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | number | `1` | Page number for paginated results |
| `limit` | number | `10` | Number of records per page. Max `100` |
| `reason` | string | - | Filter by reason. Allowed values: `ACQUISITION_REWARD`, `EXCLUSIVE_SALE_REWARD`, `REFERRAL_BONUS_5_PERCENT`, `REDEMPTION`, `GEM_REDEEM` |
| `txnType` | string | - | Filter by transaction type. Allowed values: `CREDIT`, `DEBIT` |

## Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "summary": {
    "userId": "cm8abc123xyz",
    "userName": "Priyanshu Lohani",
    "currentBalance": 145,
    "totalTransactions": 3
  },
  "data": [
    {
      "id": "cm8txn123",
      "requestId": "cm8req123",
      "purpose": "Exclusive Acquisition Reward",
      "reason": "ACQUISITION_REWARD",
      "txnType": "CREDIT",
      "amount": 100,
      "signedAmount": 100,
      "balanceBefore": 45,
      "balanceAfter": 145,
      "status": "APPROVED",
      "requestType": "ACQUISITION_REWARD",
      "propertyId": "cm8property123",
      "staffHandler": "SYSTEM",
      "createdAt": "2026-03-15T11:35:21.000Z"
    },
    {
      "id": "cm8txn124",
      "requestId": "cm8req124",
      "purpose": "Gem Redeem",
      "reason": "GEM_REDEEM",
      "txnType": "DEBIT",
      "amount": 50,
      "signedAmount": -50,
      "balanceBefore": 145,
      "balanceAfter": 95,
      "status": "APPROVED",
      "requestType": "GEM_REDEEM",
      "propertyId": null,
      "staffHandler": "Admin User",
      "createdAt": "2026-03-14T09:10:00.000Z"
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

## Field Notes

- `purpose`: Frontend-friendly label for the transaction reason.
- `reason`: Raw backend enum value.
- `txnType`: `CREDIT` means gems added, `DEBIT` means gems deducted.
- `signedAmount`: Positive for credits, negative for debits.
- `balanceBefore`: User gem balance before this transaction.
- `balanceAfter`: User gem balance after this transaction.
- `status`: Current status of the originating request. For completed transactions this will normally be `APPROVED`.
- `requestType`: Original gem request type.
- `propertyId`: Present when the transaction is tied to a property reward flow.
- `staffHandler`: Staff member who processed the transaction, or `SYSTEM` when auto-generated.

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 404 User Not Found
```json
{
  "message": "User does not exist"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## cURL Examples

### Fetch all transactions
```bash
curl -X GET "http://localhost:5000/api/v1/user/transactions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Fetch only debit transactions
```bash
curl -X GET "http://localhost:5000/api/v1/user/transactions?txnType=DEBIT&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Fetch acquisition reward transactions only
```bash
curl -X GET "http://localhost:5000/api/v1/user/transactions?reason=ACQUISITION_REWARD" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Frontend Integration Notes

1. Use `signedAmount` if you want a single value for rendering `+100` or `-50` in the UI.
2. Use `currentBalance` from `summary` to show the latest available gem balance.
3. The `createdAt` field is returned as an ISO date string and can be formatted on the client.
4. The endpoint is token-protected and does not require a user ID in params.