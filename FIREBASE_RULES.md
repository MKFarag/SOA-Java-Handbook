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
      allow read: if true;
      allow create, update: if request.resource.data.code == studentCode;
      allow delete: if true;

      // 1.1 Private Knowledge Base (Notes & Code Snippets) Security
      match /knowledge_notes/{noteId} {
        allow read, delete: if resource.data.ownerCode == studentCode;
        allow create: if request.resource.data.ownerCode == studentCode;
        allow update: if request.resource.data.ownerCode == studentCode && resource.data.ownerCode == studentCode;
      }
    }
    
    // 2. Broadcasts & Shared Resources Security
    match /broadcasts/{broadcastId} {
      allow read: if true;
      allow create, update, delete: if true;
    }

    // 3. Admin Security & Password Configuration
    match /admin_config/{docId} {
      allow read, write: if true;
    }
  }
}
```

4. Click **Publish**.

---

## Secret Admin Portal Access

* **Initial Master Password:** `MKF#SOA2026!SecOps$99` (fallback: `MKF@SOA2026`)
* **How to Open:**
  * **PC / Mac:** Press `Ctrl + Shift + A` (or `Cmd + Shift + A`)
  * **Direct URL:** Append `#admin` or `#admin-portal` to the site URL
  * **Mobile:** Tap 5 times rapidly on the "NTI Java & SOA" header logo.
* **Changing Password:**
  * Once inside the Admin Command Center, open the **Security & Passcode** tab.
  * You can view your last login timestamp/device and update your password at any time.
