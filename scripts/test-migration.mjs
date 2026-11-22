import assert from 'node:assert';
import fs from 'node:fs';

const currentTopics = JSON.parse(fs.readFileSync('src/data/generated-topics.json', 'utf-8'));
const CURRENT_TOPIC_IDS = new Set(currentTopics.map(t => t.id));

const REBUILD_TIMESTAMP_MS = new Date('2026-11-21T19:32:50.000Z').getTime();

// Unambiguous old-only IDs that definitively identify a pre-rebuild dataset
const LEGACY_ONLY_IDS = new Set([
  'topic-76', 'topic-77', 'topic-78', 'topic-81',
  'topic-132', 'topic-133', 'topic-134'
]);

// Single-pass, unchained old -> new mapping
export const OLD_TO_NEW_TOPIC_MAP = {
  'topic-75': 'topic-74',
  'topic-76': 'topic-74',
  'topic-77': 'topic-75',
  'topic-78': 'topic-75',
  'topic-81': 'topic-80',
  'topic-130': 'topic-129',
  'topic-131': 'topic-121',
  'topic-132': 'topic-131',
  'topic-133': 'topic-130',
  'topic-134': 'topic-131'
};

const RETIRED_MICROSERVICE_IDS = new Set([
  'topic-120', 'topic-121', 'topic-122', 'topic-123', 'topic-124',
  'topic-125', 'topic-126', 'topic-127', 'topic-128', 'topic-129'
]);

/**
 * Pure migration function for student profile or completedTopics array
 */
export function migrateProfileData(profile) {
  if (profile.schemaVersion && profile.schemaVersion >= 2) {
    // Already migrated: sanitize to only valid current IDs
    const sanitizedCompleted = Array.from(new Set(
      (profile.completedTopics || []).filter(id => CURRENT_TOPIC_IDS.has(id))
    ));
    const sanitizedSaved = Array.from(new Set(
      (profile.savedTopics || []).filter(id => CURRENT_TOPIC_IDS.has(id))
    ));
    return {
      ...profile,
      completedTopics: sanitizedCompleted,
      completedCount: sanitizedCompleted.length,
      savedTopics: sanitizedSaved,
      certificateUnlocked: sanitizedCompleted.length === 127
    };
  }

  const rawCompleted = profile.completedTopics || [];
  const rawSaved = profile.savedTopics || [];

  // Determine if this profile is definitively from the old era
  const hasLegacyOnlyIds = rawCompleted.concat(rawSaved).some(id => LEGACY_ONLY_IDS.has(id));
  const isPreRebuildTimestamp = profile.lastActive && (new Date(profile.lastActive).getTime() < REBUILD_TIMESTAMP_MS);
  const isOldEra = hasLegacyOnlyIds || isPreRebuildTimestamp;

  const migrateList = (list) => {
    const result = new Set();
    for (const id of list) {
      if (isOldEra) {
        if (RETIRED_MICROSERVICE_IDS.has(id)) {
          // Drop old microservices
          continue;
        }
        // Apply old -> new remap for old profiles
        const mappedId = OLD_TO_NEW_TOPIC_MAP[id] || id;
        if (CURRENT_TOPIC_IDS.has(mappedId)) {
          result.add(mappedId);
        }
      } else {
        // Modern profile: only remap unambiguous dead legacy IDs if accidentally submitted
        const mappedId = (LEGACY_ONLY_IDS.has(id) && OLD_TO_NEW_TOPIC_MAP[id]) ? OLD_TO_NEW_TOPIC_MAP[id] : id;
        if (CURRENT_TOPIC_IDS.has(mappedId)) {
          result.add(mappedId);
        }
      }
    }
    return Array.from(result);
  };

  const migratedCompleted = migrateList(rawCompleted);
  const migratedSaved = migrateList(rawSaved);

  return {
    ...profile,
    schemaVersion: 2,
    completedTopics: migratedCompleted,
    completedCount: migratedCompleted.length,
    savedTopics: migratedSaved,
    certificateUnlocked: migratedCompleted.length === 127
  };
}

// =========================================================================
// TEST SUITE
// =========================================================================
console.log('====================================================');
console.log(' RUNNING TOPIC MIGRATION & USER PROTECTION TESTS   ');
console.log('====================================================');

// (a) Old-era profile (completed before rebuild, has old topics 77, 78, 124 Tracing, 134 MongoDB persistence)
console.log('Test (a): Old-era profile migration...');
const oldProfile = {
  code: 'SOA-OLD1',
  name: 'Ahmed OldUser',
  lastActive: '2026-11-19T14:00:00.000Z',
  completedTopics: ['topic-01', 'topic-74', 'topic-77', 'topic-78', 'topic-81', 'topic-124', 'topic-134'],
  savedTopics: ['topic-124', 'topic-133']
};
const migratedOld = migrateProfileData(oldProfile);
assert.strictEqual(migratedOld.schemaVersion, 2);
assert.ok(!migratedOld.completedTopics.includes('topic-124'), 'Old microservice topic-124 must be dropped');
assert.ok(migratedOld.completedTopics.includes('topic-75'), 'Old topic-77 and 78 must remap to topic-75');
assert.ok(migratedOld.completedTopics.includes('topic-80'), 'Old topic-81 must remap to topic-80');
assert.ok(migratedOld.completedTopics.includes('topic-131'), 'Old topic-134 must remap to topic-131');
assert.strictEqual(migratedOld.savedTopics.includes('topic-130'), true, 'Old topic-133 in saved must remap to topic-130');
assert.strictEqual(migratedOld.certificateUnlocked, false);
console.log('  -> PASS: Old-era profile correctly dropped microservice topic-124 and remapped 77, 78, 81, 134.');

// (b) New-era profile with SQL topics completed (active after rebuild, e.g. SQL joins topic-124)
console.log('Test (b): New-era profile with SQL topics...');
const newProfile = {
  code: 'SOA-NEW1',
  name: 'Sara SqlLearner',
  lastActive: '2026-11-22T08:00:00.000Z',
  completedTopics: ['topic-01', 'topic-120', 'topic-124', 'topic-128'], // New SQL topics
  savedTopics: ['topic-124']
};
const migratedNew = migrateProfileData(newProfile);
assert.ok(migratedNew.completedTopics.includes('topic-124'), 'New SQL topic-124 must NOT be dropped');
assert.ok(migratedNew.completedTopics.includes('topic-120'), 'New SQL topic-120 must NOT be dropped');
assert.strictEqual(migratedNew.completedCount, 4);
console.log('  -> PASS: New-era SQL learner retained topic-120 and topic-124.');

// (c) Full-completion user
console.log('Test (c): Full-completion user verification...');
const allIds = Array.from(CURRENT_TOPIC_IDS);
const fullProfile = {
  code: 'SOA-FULL',
  name: 'Omnia Graduate',
  lastActive: '2026-11-22T09:00:00.000Z',
  completedTopics: allIds
};
const migratedFull = migrateProfileData(fullProfile);
assert.strictEqual(migratedFull.completedCount, 127);
assert.strictEqual(migratedFull.certificateUnlocked, true);

// User with 127 topics including an old dead ID (e.g. 126 valid + 1 old invalid)
const almostFullProfile = {
  code: 'SOA-ALMOST',
  name: 'Cheat Attempt',
  lastActive: '2026-11-22T09:00:00.000Z',
  completedTopics: allIds.slice(0, 126).concat(['topic-999-invalid'])
};
const migratedAlmost = migrateProfileData(almostFullProfile);
assert.strictEqual(migratedAlmost.completedCount, 126);
assert.strictEqual(migratedAlmost.certificateUnlocked, false, 'Invalid topic IDs cannot unlock certificate');
console.log('  -> PASS: Certificate strictly requires 127 valid current topics.');

// (d) Second device holding old data that syncs after migration
console.log('Test (d): Second device syncing old data...');
const localDeviceState = migratedOld; // already migrated on Device 1
const incomingOldDevicePayload = {
  code: 'SOA-OLD1',
  name: 'Ahmed OldUser',
  lastActive: '2026-11-19T10:00:00.000Z', // older device timestamp
  completedTopics: ['topic-01', 'topic-02', 'topic-124', 'topic-125'] // still has old microservices
};
// Before merging, Device 1 runs migration on incoming payload
const cleanIncoming = migrateProfileData(incomingOldDevicePayload);
assert.ok(!cleanIncoming.completedTopics.includes('topic-124'), 'Dropped microservices from Device 2 must not resurrect');
assert.ok(!cleanIncoming.completedTopics.includes('topic-125'), 'Dropped microservices from Device 2 must not resurrect');

// Merge logic
const mergedTopics = Array.from(new Set([...localDeviceState.completedTopics, ...cleanIncoming.completedTopics]));
assert.ok(!mergedTopics.includes('topic-124'), 'Merged state does not resurrect dropped IDs');
assert.ok(mergedTopics.includes('topic-02'), 'Genuine new progress from Device 2 is safely merged');
console.log('  -> PASS: Cross-device sync with old device does not resurrect retired IDs.');

// (e) Firestore Sync simulation
console.log('Test (e): Firestore Sync roundtrip...');
const firestoreDoc = {
  code: 'SOA-CLOUD',
  name: 'Cloud Student',
  lastActive: '2026-11-20T12:00:00.000Z', // pre-rebuild
  completedTopics: ['topic-01', 'topic-76', 'topic-127'], // 76 is old JSP, 127 was old Saga
  schemaVersion: 1
};
const syncedProfile = migrateProfileData(firestoreDoc);
assert.strictEqual(syncedProfile.schemaVersion, 2);
assert.ok(syncedProfile.completedTopics.includes('topic-74'), 'Topic-76 remapped to 74');
assert.ok(!syncedProfile.completedTopics.includes('topic-127'), 'Old Saga topic-127 dropped');
console.log('  -> PASS: Firestore document schema migrated cleanly.');

console.log('====================================================');
console.log(' ALL 5 MIGRATION & USER PROTECTION FIXTURES PASSED! ');
console.log('====================================================');
