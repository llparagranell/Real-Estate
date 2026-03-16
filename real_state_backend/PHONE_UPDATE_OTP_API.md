# Phone Number Update via Email OTP API

## Overview

This flow lets an authenticated user change their mobile number only after email OTP verification.

### Flow

1. User enters new phone number in app.
2. App calls send OTP API.
3. Backend sends OTP to the user's registered email.
4. User enters OTP in app.
5. App calls verify API with OTP + new phone.
6. Backend verifies OTP and updates phone.

---

## Authentication

All endpoints require a valid user access token.

Header:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## Endpoint 1: Send OTP for Phone Change

**POST** `/api/v1/user/profile/phone-change/send-otp`

### Request Body

```json
{
  "newPhone": "+919876543210"
}
```

### Validation Rules

- `newPhone` must be in international format: `+1234567890`
- Regex: `^\+[1-9]\d{6,14}$`

### Success Response (200)

```json
{
  "message": "OTP sent to your registered email"
}
```

### Error Responses

#### 400 Bad Request (same current phone)

```json
{
  "message": "New phone is same as current phone"
}
```

#### 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```

#### 404 Not Found

```json
{
  "message": "User does not exist"
}
```

#### 409 Conflict (already used by another user)

```json
{
  "message": "Phone number already in use"
}
```

#### 500 Internal Server Error

```json
{
  "message": "Internal server error"
}
```

---

## Endpoint 2: Verify OTP and Update Phone

**POST** `/api/v1/user/profile/phone-change/verify`

### Request Body

```json
{
  "newPhone": "+919876543210",
  "code": "123456"
}
```

### Validation Rules

- `newPhone` must match: `^\+[1-9]\d{6,14}$`
- `code` must be exactly 6 digits

### Success Response (200)

```json
{
  "success": true,
  "message": "Phone number updated successfully",
  "data": {
    "id": "cmxxxxxx",
    "firstName": "Priyanshu",
    "lastName": "Lohani",
    "email": "user@example.com",
    "phone": "+919876543210",
    "age": 26,
    "gender": "MALE",
    "updatedAt": "2026-03-16T12:30:00.000Z"
  }
}
```

### Error Responses

#### 400 Bad Request (same current phone)

```json
{
  "message": "New phone is same as current phone"
}
```

#### 400 Bad Request (invalid or expired OTP)

```json
{
  "message": "Invalid or expired OTP"
}
```

#### 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```

#### 404 Not Found

```json
{
  "message": "User does not exist"
}
```

#### 409 Conflict (already used by another user)

```json
{
  "message": "Phone number already in use"
}
```

#### 500 Internal Server Error

```json
{
  "message": "Internal server error"
}
```

---

## Important Integration Notes

- Normal profile update API does not allow direct phone updates.
- App must always use this OTP flow for phone changes.
- Uniqueness is checked in both send and verify APIs.
- OTP type used internally is `PHONE`.
- OTP is delivered to the current registered email, not to the new phone.

---

## cURL Examples

### 1) Send OTP

```bash
curl -X POST "http://localhost:5000/api/v1/user/profile/phone-change/send-otp" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newPhone": "+919876543210"
  }'
```

### 2) Verify OTP and Update Phone

```bash
mecurl -X POST "http://localhost:5000/api/v1/user/profile/phone-change/verify" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newPhone": "+919876543210",
    "code": "123456"
  }'
```
