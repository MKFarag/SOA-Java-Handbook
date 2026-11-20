import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { StudentProfile, BroadcastItem, ChallengeStatus } from "../types";

// Master admin passcodes (Default fallback passwords)
export const DEFAULT_MASTER_PASSWORD = "MKF#SOA2026!SecOps$99";

export const MASTER_ADMIN_PASSWORDS = [
  DEFAULT_MASTER_PASSWORD,
  "MKF@SOA2026",
  "ADMIN-MKF-SOA",
  "SOA-MASTER-PASS"
];

// Normalize code format (e.g. "mk-1234" -> "MK-1234")
export function normalizeStudentCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, '-');
}

/**
 * Save or update a student's profile in Firestore
 */
export async function saveStudentProfile(params: {
  code: string;
  name: string;
  completedTopics?: string[];
  savedTopics?: string[];
  challengeStates?: Record<string, ChallengeStatus>;
  targetedReviewIds?: string[];
  certificateUnlocked?: boolean;
}): Promise<void> {
  const cleanCode = normalizeStudentCode(params.code);
  if (!cleanCode) throw new Error("Invalid student code");

  const studentRef = doc(db, "students", cleanCode);
  const nowIso = new Date().toISOString();

  const dataToUpdate: Record<string, any> = {
    code: cleanCode,
    name: params.name.trim(),
    lastActive: nowIso,
    updatedAtServer: serverTimestamp()
  };

  if (params.completedTopics !== undefined) {
    dataToUpdate.completedTopics = params.completedTopics;
    dataToUpdate.completedCount = params.completedTopics.length;
  }
  if (params.savedTopics !== undefined) {
    dataToUpdate.savedTopics = params.savedTopics;
  }
  if (params.challengeStates !== undefined) {
    dataToUpdate.challengeStates = params.challengeStates;
  }
  if (params.targetedReviewIds !== undefined) {
    dataToUpdate.targetedReviewIds = params.targetedReviewIds;
  }
  if (params.certificateUnlocked !== undefined) {
    dataToUpdate.certificateUnlocked = params.certificateUnlocked;
  }

  // Check if doc exists to set createdAt only once
  try {
    const existingSnap = await getDoc(studentRef);
    if (!existingSnap.exists()) {
      dataToUpdate.createdAt = nowIso;
      dataToUpdate.certificateUnlocked = params.certificateUnlocked ?? false;
      if (params.completedTopics === undefined) {
        dataToUpdate.completedTopics = [];
        dataToUpdate.completedCount = 0;
      }
      if (params.savedTopics === undefined) dataToUpdate.savedTopics = [];
      if (params.challengeStates === undefined) dataToUpdate.challengeStates = {};
      if (params.targetedReviewIds === undefined) dataToUpdate.targetedReviewIds = [];
    }
    await setDoc(studentRef, dataToUpdate, { merge: true });
  } catch (err) {
    console.error("Error saving student profile to Firestore:", err);
    throw err;
  }
}

/**
 * Load a student's profile by their unique code
 */
export async function loadStudentProfile(code: string): Promise<StudentProfile | null> {
  const cleanCode = normalizeStudentCode(code);
  if (!cleanCode) return null;

  try {
    const studentRef = doc(db, "students", cleanCode);
    const snap = await getDoc(studentRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        code: data.code || cleanCode,
        name: data.name || "Student",
        completedTopics: data.completedTopics || [],
        completedCount: data.completedCount ?? (data.completedTopics ? data.completedTopics.length : 0),
        savedTopics: data.savedTopics || [],
        challengeStates: data.challengeStates || {},
        targetedReviewIds: data.targetedReviewIds || [],
        certificateUnlocked: Boolean(data.certificateUnlocked),
        createdAt: data.createdAt || new Date().toISOString(),
        lastActive: data.lastActive || new Date().toISOString()
      };
    }
    return null;
  } catch (err) {
    console.error("Error loading student profile:", err);
    throw err;
  }
}

/**
 * Admin: Get all registered students
 */
export async function getAllStudents(): Promise<StudentProfile[]> {
  try {
    const studentsCol = collection(db, "students");
    const snap = await getDocs(studentsCol);
    const results: StudentProfile[] = [];

    snap.forEach((docSnap) => {
      const data = docSnap.data();
      results.push({
        code: data.code || docSnap.id,
        name: data.name || "Unknown",
        completedTopics: data.completedTopics || [],
        completedCount: data.completedCount ?? (data.completedTopics ? data.completedTopics.length : 0),
        savedTopics: data.savedTopics || [],
        challengeStates: data.challengeStates || {},
        targetedReviewIds: data.targetedReviewIds || [],
        certificateUnlocked: Boolean(data.certificateUnlocked),
        createdAt: data.createdAt || "",
        lastActive: data.lastActive || ""
      });
    });

    // Sort by last active descending
    return results.sort((a, b) => {
      const dateA = new Date(a.lastActive || 0).getTime();
      const dateB = new Date(b.lastActive || 0).getTime();
      return dateB - dateA;
    });
  } catch (err) {
    console.error("Error getting all students:", err);
    throw err;
  }
}

/**
 * Admin: Toggle student certificate unlocked status
 */
export async function setStudentCertificateStatus(code: string, unlocked: boolean): Promise<void> {
  const cleanCode = normalizeStudentCode(code);
  const studentRef = doc(db, "students", cleanCode);
  await setDoc(studentRef, { certificateUnlocked: unlocked }, { merge: true });
}

/**
 * Admin: Delete a student record
 */
export async function deleteStudentRecord(code: string): Promise<void> {
  const cleanCode = normalizeStudentCode(code);
  const studentRef = doc(db, "students", cleanCode);
  await deleteDoc(studentRef);
}

/**
 * Broadcasts: Fetch active broadcasts/announcements
 */
export async function getBroadcasts(): Promise<BroadcastItem[]> {
  try {
    const bcastCol = collection(db, "broadcasts");
    const q = query(bcastCol, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const results: BroadcastItem[] = [];

    snap.forEach((docSnap) => {
      const data = docSnap.data();
      results.push({
        id: docSnap.id,
        title: data.title || "",
        content: data.content || "",
        type: data.type || "announcement",
        url: data.url || "",
        badgeLabel: data.badgeLabel || "",
        createdAt: data.createdAt || new Date().toISOString(),
        expiresAt: data.expiresAt,
        author: data.author || "MK Farag"
      });
    });

    return results;
  } catch (err) {
    console.warn("Error fetching broadcasts (might be empty or missing index, falling back to unordered):", err);
    try {
      const bcastCol = collection(db, "broadcasts");
      const snap = await getDocs(bcastCol);
      const results: BroadcastItem[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        results.push({
          id: docSnap.id,
          title: data.title || "",
          content: data.content || "",
          type: data.type || "announcement",
          url: data.url || "",
          badgeLabel: data.badgeLabel || "",
          createdAt: data.createdAt || new Date().toISOString(),
          expiresAt: data.expiresAt,
          author: data.author || "MK Farag"
        });
      });
      return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (fallbackErr) {
      console.error("Failed to load broadcasts:", fallbackErr);
      return [];
    }
  }
}

/**
 * Admin: Publish a new broadcast/link/task
 */
export async function publishBroadcast(item: Omit<BroadcastItem, "id">): Promise<string> {
  const bcastId = `bcast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const bcastRef = doc(db, "broadcasts", bcastId);
  const data = {
    ...item,
    createdAt: item.createdAt || new Date().toISOString()
  };
  await setDoc(bcastRef, data);
  return bcastId;
}

/**
 * Admin: Delete a broadcast by ID
 */
export async function deleteBroadcast(broadcastId: string): Promise<void> {
  const bcastRef = doc(db, "broadcasts", broadcastId);
  await deleteDoc(bcastRef);
}

export interface AdminSecurityState {
  adminPassword?: string;
  lastLoginTime?: string;
  lastLoginDevice?: string;
  updatedAt?: string;
}

/**
 * Fetch Admin Security Config from Firestore (with localStorage fallback)
 */
export async function getAdminSecurityConfig(): Promise<AdminSecurityState> {
  try {
    const secRef = doc(db, "admin_config", "security");
    const snap = await getDoc(secRef);
    if (snap.exists()) {
      const data = snap.data() as AdminSecurityState;
      if (data.adminPassword) {
        localStorage.setItem("soa_custom_admin_pass", data.adminPassword);
      }
      if (data.lastLoginTime) {
        localStorage.setItem("soa_last_admin_login", data.lastLoginTime);
      }
      if (data.lastLoginDevice) {
        localStorage.setItem("soa_last_admin_device", data.lastLoginDevice);
      }
      return data;
    }
  } catch (err) {
    console.warn("Could not fetch remote admin security config:", err);
  }

  // Fallback to local storage or defaults
  return {
    adminPassword: localStorage.getItem("soa_custom_admin_pass") || DEFAULT_MASTER_PASSWORD,
    lastLoginTime: localStorage.getItem("soa_last_admin_login") || undefined,
    lastLoginDevice: localStorage.getItem("soa_last_admin_device") || undefined
  };
}

/**
 * Verify Admin Password against Firestore, LocalStorage, or Fallback Passwords
 */
export async function verifyAdminPassword(input: string): Promise<boolean> {
  if (!input) return false;
  const clean = input.trim();

  // 1. Check cloud stored password first
  try {
    const config = await getAdminSecurityConfig();
    if (config.adminPassword && clean === config.adminPassword.trim()) {
      return true;
    }
  } catch {
    // ignore
  }

  // 2. Check local storage
  const localSaved = localStorage.getItem("soa_custom_admin_pass");
  if (localSaved && clean === localSaved.trim()) {
    return true;
  }

  // 3. Check hardcoded fallback passwords
  return MASTER_ADMIN_PASSWORDS.includes(clean);
}

/**
 * Update Admin Password in Firestore and LocalStorage
 */
export async function updateAdminPassword(newPassword: string): Promise<void> {
  const clean = newPassword.trim();
  if (clean.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  const nowIso = new Date().toISOString();
  localStorage.setItem("soa_custom_admin_pass", clean);

  try {
    const secRef = doc(db, "admin_config", "security");
    await setDoc(secRef, {
      adminPassword: clean,
      updatedAt: nowIso
    }, { merge: true });
  } catch (err) {
    console.error("Failed to update admin password in Firestore:", err);
  }
}

/**
 * Record an Admin login event (timestamp + device name/browser)
 */
export async function recordAdminLogin(deviceInfo: string): Promise<string> {
  const nowIso = new Date().toISOString();
  localStorage.setItem("soa_last_admin_login", nowIso);
  localStorage.setItem("soa_last_admin_device", deviceInfo);

  try {
    const secRef = doc(db, "admin_config", "security");
    await setDoc(secRef, {
      lastLoginTime: nowIso,
      lastLoginDevice: deviceInfo
    }, { merge: true });
  } catch (err) {
    console.warn("Could not record admin login in Firestore:", err);
  }

  return nowIso;
}
