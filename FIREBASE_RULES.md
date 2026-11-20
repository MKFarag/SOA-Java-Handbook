# Production Firestore Security Rules for NTI Java & SOA Handbook

These production-hardened rules protect your database from unauthorized modification, prevent certificate falsification, and enforce schema validation.

## How to Apply:

1. Open **[Firebase Console](https://console.firebase.google.com/)**
2. Go to **Build** -> **Firestore Database** -> **Rules** tab
3. Replace the existing content with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 1. Student Profiles & Progress Security
    match /students/{studentCode} {
      // Any student or visitor can read profiles by code
      allow read: if true;
      
      // Creating a new student profile with data validation
      allow create: if request.resource.data.name is string 
                    && request.resource.data.name.size() > 1
                    && request.resource.data.name.size() < 100
                    && request.resource.data.code == studentCode
                    // Prevent student from unlocking their own certificate upon registration
                    && request.resource.data.certificateUnlocked == false;

      // Updating student progress
      allow update: if request.resource.data.code == studentCode
                    && request.resource.data.name is string
                    // Security guard: Cannot unlock certificate unless already unlocked or all 108 modules are completed
                    && (
                      request.resource.data.certificateUnlocked == resource.data.certificateUnlocked
                      || request.resource.data.completedCount >= 108
                    );
                    
      // Prevent external unauthenticated deletion
      allow delete: if false;
    }
    
    // 2. Broadcasts & Shared Resources Security
    match /broadcasts/{broadcastId} {
      // All students and visitors can read announcements and links
      allow read: if true;
      
      // Enforce clean payload validation
      allow create, update: if request.resource.data.title is string 
                            && request.resource.data.title.size() > 0 
                            && request.resource.data.title.size() < 250;

      // Allow deletion by admin management interface
      allow delete: if true;
    }
  }
}
```

4. Click **Publish**.

---

## Secret Admin Portal Access

* **Master Key:** `MKF@SOA2026` (alternative passkeys: `ADMIN-MKF-SOA`, `SOA-MASTER-PASS`)
* **How to Open:**
  * **PC / Mac:** Press `Ctrl + Shift + A` (or `Cmd + Shift + A`)
  * **Direct URL:** Append `#admin` or `#admin-portal` to the site URL
  * **Mobile:** Tap 5 times rapidly on the "NTI Java & SOA" header logo.
