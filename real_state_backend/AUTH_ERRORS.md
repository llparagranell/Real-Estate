# Authentication API - Error Reference Guide

Complete error reference for Signup and Login endpoints for frontend form validation.

---

## 🔐 SIGNUP ERRORS

### Endpoint: `POST /api/v1/user/auth/signup`

### 1. Validation Errors (400 Bad Request)

These errors occur when the request body doesn't pass Zod validation:

#### **firstName**
```json
{
  "error": "First name must be atleast 2 characters",
  "field": "firstName"
}
```
- **Trigger**: firstName is less than 2 characters
- **Frontend validation**: `minLength: 2`

#### **lastName**
```json
{
  "error": "last name must be atleast 2 characters",
  "field": "lastName"
}
```
- **Trigger**: lastName is less than 2 characters
- **Frontend validation**: `minLength: 2`

#### **email**
```json
{
  "error": "Invalid email",
  "field": "email"
}
```
- **Trigger**: Email format is invalid
- **Frontend validation**: Email regex pattern
- **Example valid**: `user@example.com`

#### **phone**
```json
{
  "error": "Invalid phone number. Use international format: +1234567890",
  "field": "phone"
}
```
- **Trigger**: Phone not in international format
- **Frontend validation**: Must start with `+` and country code
- **Pattern**: `/^\+[1-9]\d{6,14}$/`
- **Examples**:
  - ✅ Valid: `+919876543210`, `+12025551234`
  - ❌ Invalid: `9876543210`, `919876543210`, `+9876543210`

#### **password**
```json
{
  "error": "password must be atleast 6 characters long",
  "field": "password"
}
```
- **Trigger**: Password length < 6
- **Frontend validation**: `minLength: 6`

#### **referrerId** (Optional)
```json
{
  "error": "Invalid referrer Id. Please use a valid referrer ID",
  "field": "referrerId"
}
```
- **Trigger**: Referral code doesn't exist in database
- **Frontend**: Optional field, validate only if provided

#### **aadharNo**
```json
{
  "error": "Aadhar must be 12 digits",
  "field": "aadharNo"
}
```
- **Trigger**: Aadhar number is not exactly 12 digits
- **Frontend validation**: `/^\d{12}$/`
- **Example**: `123456789012`

#### **kycAadharImageUrl**
```json
{
  "error": "Invalid Aadhar image URL",
  "field": "kycAadharImageUrl"
}
```
- **Trigger**: Not a valid URL
- **Frontend**: Should come from upload API response

#### **kycAadharImageKey**
```json
{
  "error": "Aadhar image key is required",
  "field": "kycAadharImageKey"
}
```
- **Trigger**: Empty or missing
- **Frontend**: Should come from upload API response

#### **panNo**
```json
{
  "error": "Invalid PAN format",
  "field": "panNo"
}
```
- **Trigger**: PAN doesn't match format
- **Frontend validation**: `/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/`
- **Format**: 5 uppercase letters + 4 digits + 1 uppercase letter
- **Example**: `ABCDE1234F`

#### **kycPanImageUrl**
```json
{
  "error": "Invalid PAN image URL",
  "field": "kycPanImageUrl"
}
```
- **Trigger**: Not a valid URL
- **Frontend**: Should come from upload API response

#### **kycPanImageKey**
```json
{
  "error": "PAN image key is required",
  "field": "kycPanImageKey"
}
```
- **Trigger**: Empty or missing
- **Frontend**: Should come from upload API response

---

### 2. Database Constraint Errors (500 Internal Server Error)

⚠️ **CRITICAL**: Your schema has UNIQUE constraints on email and phone!

#### **Duplicate Email**
```json
{
  "code": "P2002",
  "meta": {
    "target": ["email"]
  },
  "message": "Unique constraint failed on the fields: (`email`)"
}
```
- **Trigger**: Email already exists in database
- **Status Code**: 500 (currently - should be 400)
- **Frontend**: Show "Email already registered. Try logging in or use a different email"

#### **Duplicate Phone** ⚠️
```json
{
  "code": "P2002",
  "meta": {
    "target": ["phone"]
  },
  "message": "Unique constraint failed on the fields: (`phone`)"
}
```
- **Trigger**: Phone number already exists in database
- **Status Code**: 500 (currently - should be 400)
- **Frontend**: Show "Phone number already registered"

**🚨 IMPORTANT NOTE**: You mentioned "same mobile no. can use multiple times" but your schema has `phone String @unique` which **prevents duplicate phone numbers**. You need to decide:
1. **Keep unique**: Each phone can only register once (current behavior)
2. **Remove unique**: Allow same phone for multiple accounts (requires schema change)

---

### 3. Missing Body Error
```json
"Please fill all the details"
```
- **Status Code**: 404 (should be 400)
- **Trigger**: Request body is empty/null

---

### 4. Server Error
```json
{
  "error": "Internal server error details..."
}
```
- **Status Code**: 500
- **Trigger**: Unexpected server-side error

---

## 🔑 LOGIN ERRORS

### Endpoint: `POST /api/v1/user/auth/signin`

### 1. Validation Errors (400 Bad Request)

#### **email**
```json
{
  "error": "invalid email",
  "field": "email"
}
```
- **Trigger**: Invalid email format
- **Frontend validation**: Email regex

#### **password** (empty)
```json
{
  "error": "Required",
  "field": "password"
}
```
- **Trigger**: Password field is empty
- **Frontend**: Required field validation

---

### 2. Authentication Errors

#### **Invalid Email**
```json
{
  "message": "Invalid email or password"
}
```
- **Status Code**: 401
- **Trigger**: No user found with this email
- **Frontend**: Generic message for security (don't reveal if email exists)

#### **Invalid Password**
```json
{
  "error": "Invalid credentials"
}
```
- **Status Code**: 401
- **Trigger**: Password doesn't match
- **Frontend**: Show "Invalid email or password" (same as above for security)

---

### 3. Missing Body Error
```json
"Please fill valid email to proceed"
```
- **Status Code**: 400
- **Trigger**: Request body is empty

---

### 4. Server Error
```json
{
  "error": "Internal server error details..."
}
```
- **Status Code**: 500

---

## 📧 FORGOT PASSWORD ERRORS

### Endpoint: `POST /api/v1/user/auth/forgot-password`

#### **Missing Email**
```json
{
  "error": "Please enter a valid email"
}
```
- **Status Code**: 400

#### **User Not Found**
```json
{
  "message": "User doesn't exist with this email"
}
```
- **Status Code**: 200 (⚠️ security consideration - doesn't reveal if email exists)

---

## 🔄 RESET PASSWORD ERRORS

### Endpoint: `POST /api/v1/user/auth/reset-password`

#### **Missing Fields**
```json
{
  "error": "Email, OTP code, and new password are required"
}
```
- **Status Code**: 400

#### **Short Password**
```json
{
  "error": "Password must be at least 8 characters"
}
```
- **Status Code**: 400
- **⚠️ NOTE**: Signup requires 6 chars, reset requires 8 chars - **inconsistent!**

#### **User Not Found**
```json
{
  "error": "User not found"
}
```
- **Status Code**: 400

#### **Invalid OTP**
```json
{
  "error": "invalid or expired OTP"
}
```
- **Status Code**: 400
- **Trigger**: OTP is wrong, expired, or already used

---

## 🎯 Frontend Form Validation Checklist

### Signup Form

```typescript
const signupValidation = {
  firstName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
    errorMessages: {
      required: "First name is required",
      minLength: "First name must be at least 2 characters",
      pattern: "First name can only contain letters"
    }
  },
  
  lastName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
    errorMessages: {
      required: "Last name is required",
      minLength: "Last name must be at least 2 characters"
    }
  },
  
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessages: {
      required: "Email is required",
      pattern: "Please enter a valid email address",
      duplicate: "This email is already registered. Try logging in."
    }
  },
  
  phone: {
    required: true,
    pattern: /^\+[1-9]\d{6,14}$/,
    errorMessages: {
      required: "Phone number is required",
      pattern: "Please use international format (e.g., +919876543210)",
      duplicate: "This phone number is already registered"
    }
  },
  
  password: {
    required: true,
    minLength: 6,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, // Optional: enforce strong password
    errorMessages: {
      required: "Password is required",
      minLength: "Password must be at least 6 characters",
      pattern: "Password must contain uppercase, lowercase, and numbers"
    }
  },
  
  confirmPassword: {
    required: true,
    mustMatch: "password",
    errorMessages: {
      required: "Please confirm your password",
      mustMatch: "Passwords do not match"
    }
  },
  
  aadharNo: {
    required: true,
    pattern: /^\d{12}$/,
    errorMessages: {
      required: "Aadhar number is required",
      pattern: "Aadhar number must be exactly 12 digits"
    }
  },
  
  panNo: {
    required: true,
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    errorMessages: {
      required: "PAN number is required",
      pattern: "Invalid PAN format (e.g., ABCDE1234F)"
    }
  },
  
  kycAadharImage: {
    required: true,
    fileTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 5 * 1024 * 1024, // 5MB
    errorMessages: {
      required: "Please upload Aadhar document",
      fileType: "Only JPG, PNG, or PDF files allowed",
      maxSize: "File size must be less than 5MB"
    }
  },
  
  kycPanImage: {
    required: true,
    fileTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 5 * 1024 * 1024,
    errorMessages: {
      required: "Please upload PAN document",
      fileType: "Only JPG, PNG, or PDF files allowed",
      maxSize: "File size must be less than 5MB"
    }
  },
  
  referrerId: {
    required: false,
    minLength: 6,
    errorMessages: {
      invalid: "Invalid referral code"
    }
  }
};
```

### Login Form

```typescript
const loginValidation = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessages: {
      required: "Email is required",
      pattern: "Please enter a valid email address",
      invalid: "Invalid email or password"
    }
  },
  
  password: {
    required: true,
    minLength: 6,
    errorMessages: {
      required: "Password is required",
      invalid: "Invalid email or password"
    }
  }
};
```

---

## 🛠️ Recommended Backend Improvements

### 1. Handle Unique Constraint Errors Properly

Current code returns raw 500 errors for duplicate email/phone. Update signup controller:

```typescript
export async function signup(req: Request, res: Response) {
  try {
    // ... existing code ...
    
    const user = await prisma.user.create({
      data: { /* ... */ }
    });
    
    // ... rest of code ...
  } catch (error: any) {
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      if (field === 'email') {
        return res.status(400).json({
          error: "Email already registered",
          field: "email"
        });
      }
      if (field === 'phone') {
        return res.status(400).json({
          error: "Phone number already registered",
          field: "phone"
        });
      }
    }
    
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
```

### 2. Phone Number Uniqueness Decision

**Option A: Keep unique (current)** - No changes needed

**Option B: Allow duplicate phones** - Update schema:
```prisma
model User {
  // ... other fields
  phone String  // Remove @unique
  // ... rest
}
```

Then run `npm run prisma:push`

### 3. Consistent Password Requirements

Choose one:
- **6 characters** (current signup)
- **8 characters** (current reset)

Update both validators to match.

---

## 📱 Example Frontend Error Handling (React)

```typescript
const handleSignup = async (formData) => {
  try {
    const response = await fetch('/api/v1/user/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Handle specific field errors
      if (data.field) {
        setFieldError(data.field, data.error);
      }
      
      // Handle duplicate email/phone
      if (data.error?.includes('already registered')) {
        if (data.field === 'email') {
          setFieldError('email', 'This email is already registered');
        }
        if (data.field === 'phone') {
          setFieldError('phone', 'This phone number is already registered');
        }
      }
      
      // Handle Prisma P2002 errors (if backend doesn't catch them)
      if (data.code === 'P2002') {
        const field = data.meta?.target?.[0];
        setFieldError(field, `This ${field} is already registered`);
      }
      
      return;
    }
    
    // Success - store tokens and redirect
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    navigate('/dashboard');
    
  } catch (error) {
    setGeneralError('Network error. Please try again.');
  }
};
```

---

## 🔍 Status Code Summary

| Scenario | Status Code | Current | Should Be |
|----------|-------------|---------|-----------|
| Validation error | 400 | ✅ | ✅ |
| Invalid credentials | 401 | ✅ | ✅ |
| Duplicate email | 500 | ❌ | 400 |
| Duplicate phone | 500 | ❌ | 400 |
| Missing body (signup) | 404 | ❌ | 400 |
| Server error | 500 | ✅ | ✅ |

---

## ⚠️ Important Security Notes

1. **Don't reveal user existence**: Login errors should be generic ("Invalid email or password" instead of "User not found")
2. **Rate limiting**: Implement rate limiting on auth endpoints to prevent brute force
3. **HTTPS only**: Always use HTTPS in production
4. **Password hashing**: Already implemented ✅
5. **Token security**: Store refresh tokens securely (httpOnly cookies recommended)
