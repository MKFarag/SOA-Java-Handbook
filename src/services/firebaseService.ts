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
import type { StudentProfile, BroadcastItem, ChallengeStatus, SiteAccessConfig, KnowledgeNote } from "../types";

// Master admin passcodes (Default fallback passwords)
export const DEFAULT_MASTER_PASSWORD = "MKF#SOA2026!SecOps$99";
export const DEFAULT_SITE_ACCESS_PASSCODE = "SOA-2026";

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

/**
 * Get Global Site Access Protection Config from Firestore or LocalStorage
 */
export async function getSiteAccessConfig(): Promise<SiteAccessConfig> {
  try {
    const accessRef = doc(db, "admin_config", "site_access");
    const snap = await getDoc(accessRef);
    if (snap.exists()) {
      const data = snap.data() as SiteAccessConfig;
      if (typeof data.isProtected === "boolean") {
        localStorage.setItem("soa_site_protected", String(data.isProtected));
      }
      if (data.sitePasscode) {
        localStorage.setItem("soa_site_passcode", data.sitePasscode);
      }
      return data;
    }
  } catch (err) {
    console.warn("Could not fetch remote site access config:", err);
  }

  // Fallback to local storage or defaults
  const localProtected = localStorage.getItem("soa_site_protected");
  const localPasscode = localStorage.getItem("soa_site_passcode");

  return {
    isProtected: localProtected !== null ? localProtected === "true" : true,
    sitePasscode: localPasscode || DEFAULT_SITE_ACCESS_PASSCODE
  };
}

/**
 * Update Global Site Access Protection Config (Admin Control)
 */
export async function updateSiteAccessConfig(config: {
  isProtected: boolean;
  sitePasscode: string;
}): Promise<void> {
  const cleanPass = config.sitePasscode.trim();
  if (!cleanPass) {
    throw new Error("Site passcode cannot be empty.");
  }

  const nowIso = new Date().toISOString();
  localStorage.setItem("soa_site_protected", String(config.isProtected));
  localStorage.setItem("soa_site_passcode", cleanPass);

  try {
    const accessRef = doc(db, "admin_config", "site_access");
    await setDoc(accessRef, {
      isProtected: config.isProtected,
      sitePasscode: cleanPass,
      updatedAt: nowIso
    }, { merge: true });
  } catch (err) {
    console.error("Failed to update site access config in Firestore:", err);
  }
}

/**
 * Verify whether an entered passcode unlocks the entire site
 * Checks:
 * 1. Matches site passcode (cloud or local or default)
 * 2. Matches master instructor passcode
 * 3. Matches any valid registered student code
 */
export async function verifySiteAccessPasscode(input: string): Promise<{
  valid: boolean;
  role: 'student' | 'admin' | 'passcode';
  name?: string;
}> {
  if (!input) return { valid: false, role: 'passcode' };
  const clean = input.trim();

  // 1. Check if it's the Master Admin Passcode
  const isAdmin = await verifyAdminPassword(clean);
  if (isAdmin) {
    return { valid: true, role: 'admin', name: 'Lead Architect / Instructor' };
  }

  // 2. Check site passcode (from cloud or fallback)
  try {
    const config = await getSiteAccessConfig();
    if (config.sitePasscode && clean.toUpperCase() === config.sitePasscode.trim().toUpperCase()) {
      return { valid: true, role: 'passcode' };
    }
  } catch {
    // ignore
  }

  const localSaved = localStorage.getItem("soa_site_passcode");
  if (localSaved && clean.toUpperCase() === localSaved.trim().toUpperCase()) {
    return { valid: true, role: 'passcode' };
  }

  if (clean.toUpperCase() === DEFAULT_SITE_ACCESS_PASSCODE.toUpperCase()) {
    return { valid: true, role: 'passcode' };
  }

  // 3. Check if it matches an existing registered student code (e.g. SOA-XXXX)
  try {
    const student = await loadStudentProfile(clean);
    if (student) {
      return { valid: true, role: 'student', name: student.name };
    }
  } catch {
    // ignore
  }

  return { valid: false, role: 'passcode' };
}

/**
 * ============================================================================
 * MY KNOWLEDGE BASE — PERSISTENCE & STRICT OWNERSHIP ENFORCEMENT
 * ============================================================================
 */

/**
 * Fetch all private knowledge notes owned by a specific student.
 * Scoped strictly to the subcollection `students/{cleanCode}/knowledge_notes`.
 * Validates ownership on every retrieved note to ensure cross-user isolation.
 */
export async function getKnowledgeNotes(studentCode: string): Promise<KnowledgeNote[]> {
  const cleanCode = normalizeStudentCode(studentCode);
  if (!cleanCode) return [];

  try {
    const notesCol = collection(db, "students", cleanCode, "knowledge_notes");
    const snap = await getDocs(notesCol);
    const results: KnowledgeNote[] = [];

    snap.forEach((docSnap) => {
      const data = docSnap.data();
      // Strict backend/service ownership check: ignore any mismatched owner
      if (data.ownerCode && data.ownerCode !== cleanCode) {
        console.warn(`[getKnowledgeNotes] Rejected note ${docSnap.id}: owner mismatch.`);
        return;
      }

      results.push({
        id: docSnap.id,
        ownerCode: cleanCode,
        title: data.title || "Untitled Note",
        description: data.description || "",
        category: data.category || "General",
        language: data.language || "java",
        content: data.content || "",
        codeSnippet: data.codeSnippet || "",
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || data.createdAt || new Date().toISOString()
      });
    });

    // Sort by recently updated descending
    return results.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  } catch (err) {
    console.error(`[getKnowledgeNotes] Failed to fetch notes for ${cleanCode}:`, err);
    throw err;
  }
}

/**
 * Save or update a private knowledge note in Firestore.
 * Strictly associates note with authenticated student code.
 */
export async function saveKnowledgeNote(
  studentCode: string,
  note: Omit<KnowledgeNote, "id" | "ownerCode"> & { id?: string; ownerCode?: string }
): Promise<KnowledgeNote> {
  const cleanCode = normalizeStudentCode(studentCode);
  if (!cleanCode) {
    throw new Error("Cannot save note: Invalid or missing student identity.");
  }

  const cleanTitle = (note.title || "").trim();
  if (!cleanTitle) {
    throw new Error("Note title is required.");
  }

  const hasContent = Boolean(note.content && note.content.trim().length > 0);
  const hasCode = Boolean(note.codeSnippet && note.codeSnippet.trim().length > 0);
  if (!hasContent && !hasCode) {
    throw new Error("Note must contain written content, a code snippet, or both.");
  }

  const nowIso = new Date().toISOString();
  const noteId = note.id && note.id.trim().length > 0
    ? note.id.trim()
    : `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const noteRef = doc(db, "students", cleanCode, "knowledge_notes", noteId);

  // Preserve createdAt if existing; otherwise set to now
  let createdAt = note.createdAt || nowIso;
  try {
    const existingSnap = await getDoc(noteRef);
    if (existingSnap.exists()) {
      const existingData = existingSnap.data();
      // Ownership protection: reject overwrite if owner does not match
      if (existingData.ownerCode && existingData.ownerCode !== cleanCode) {
        throw new Error("Unauthorized: You do not own this note.");
      }
      if (existingData.createdAt) {
        createdAt = existingData.createdAt;
      }
    }
  } catch (err) {
    // If permission or fetch error occurs, continue with given createdAt
    console.warn("[saveKnowledgeNote] Notice on existing doc check:", err);
  }

  const payload: KnowledgeNote = {
    id: noteId,
    ownerCode: cleanCode, // Strictly bound to current student
    title: cleanTitle,
    description: (note.description || "").trim(),
    category: (note.category || "General").trim(),
    language: (note.language || "java").trim(),
    content: note.content || "",
    codeSnippet: note.codeSnippet || "",
    createdAt,
    updatedAt: nowIso
  };

  try {
    await setDoc(noteRef, payload, { merge: true });
    return payload;
  } catch (err) {
    console.error(`[saveKnowledgeNote] Error saving note ${noteId} to Firestore:`, err);
    throw err;
  }
}

/**
 * Delete a private knowledge note from Firestore.
 * Strictly verifies ownership before deleting.
 */
export async function deleteKnowledgeNote(
  studentCode: string,
  noteId: string
): Promise<void> {
  const cleanCode = normalizeStudentCode(studentCode);
  if (!cleanCode) {
    throw new Error("Cannot delete note: Invalid student identity.");
  }
  if (!noteId) {
    throw new Error("Cannot delete note: Missing note ID.");
  }

  const noteRef = doc(db, "students", cleanCode, "knowledge_notes", noteId);

  // Verify ownership before deleting
  try {
    const snap = await getDoc(noteRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.ownerCode && data.ownerCode !== cleanCode) {
        throw new Error("Unauthorized: You do not own this note.");
      }
    }
  } catch (err) {
    console.warn("[deleteKnowledgeNote] Pre-delete verification check:", err);
  }

  try {
    await deleteDoc(noteRef);
  } catch (err) {
    console.error(`[deleteKnowledgeNote] Failed to delete note ${noteId}:`, err);
    throw err;
  }
}

/**
 * Sync guest notes into the newly authenticated student account.
 */
export async function syncGuestNotesToCloud(
  studentCode: string,
  guestNotes: KnowledgeNote[]
): Promise<KnowledgeNote[]> {
  const cleanCode = normalizeStudentCode(studentCode);
  if (!cleanCode || !guestNotes || guestNotes.length === 0) return [];

  const synced: KnowledgeNote[] = [];
  for (const note of guestNotes) {
    try {
      const saved = await saveKnowledgeNote(cleanCode, {
        ...note,
        ownerCode: cleanCode
      });
      synced.push(saved);
    } catch (err) {
      console.warn(`[syncGuestNotesToCloud] Could not sync note "${note.title}":`, err);
    }
  }
  return synced;
}


