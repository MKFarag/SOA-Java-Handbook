export type PartType = 
  | 'Part 1: Java Core' 
  | 'Part 2: Java EE & Jakarta EE' 
  | 'Part 3: Spring Boot & Production Stack'
  | 'Part 4: Database Systems & Persistence';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CodeToken {
  token: string;
  explanation: string;
}

export interface SyntaxSection {
  title: string;
  codeSnippet: string;
  explanation: string;
  tokens: CodeToken[];
}

export interface CodeExample {
  id: string;
  title: string;
  type: 'basic' | 'realistic';
  description: string;
  filename: string;
  code: string;
  output: string;
  stepByStep: string[];
}

export interface CommonMistake {
  title: string;
  errorCodeOrSnippet?: string;
  wrongCode?: string;
  fixedCode?: string;
  cause: string;
  solution: string;
}

export interface BestPracticeGuide {
  doList: string[];
  dontList: string[];
  whenNotToUse: string;
}

export interface VersionInfo {
  introduced: string;
  status: 'Stable' | 'Preview' | 'Incubator' | 'Deprecated' | 'Removed';
  compatibilityNotes: string;
  ltsAvailability: string;
}

export interface SummaryCheatSheet {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface TopicExercise {
  id: number;
  type: 'Spot the Bug' | 'Hands-on Implementation' | 'Real-world Edge Case';
  title: string;
  prompt: string;
  starterCode?: string;
  solution: string;
  explanation: string;
}

export interface OfficialSource {
  title: string;
  url: string;
  organization: 'Oracle' | 'OpenJDK' | 'Jakarta EE' | 'Apache Tomcat' | 'Eclipse Foundation' | 'Spring / VMware' | 'Apache Software Foundation';
}

export type ChallengeStatus = 'unattempted' | 'mastered' | 'needs-review';

export interface SectionMilestoneChallenge {
  id: string;
  sectionNumber: number;
  sectionTitle: string;
  part: PartType;
  title: string;
  scenario: string;
  architecturalConstraints: string[];
  expectedOutput: string;
  diagnosticHints: string[];
  commonPitfalls: string[];
  prerequisiteTopicIds: string[];
  referenceSolutionCode: string;
  solutionArchitectureNotes: string;
}

export interface CapstoneEvaluationCriteria {
  category: string;
  weight: string;
  description: string;
}

export interface CapstoneProject {
  id: string;
  part: PartType;
  title: string;
  subtitle: string;
  difficulty: 'Senior Systems Architect (Master)' | 'Enterprise Solutions Engineer (Advanced)' | 'Lead Cloud Architect (Production)';
  prerequisitesCount: number;
  prerequisiteTopicIds?: string[];
  estimatedDuration: string;
  scenario: string;
  architecturalRequirements: string[];
  technicalStack: string[];
  deliverables: string[];
  expectedTerminalOutput: string;
  evaluationCriteria: CapstoneEvaluationCriteria[];
  referenceArchitectureCode: string;
  verificationSuiteCode: string;
}

export interface TopicDetail {
  id: string;
  slug: string;
  topicNumber: number;
  title: string;
  part: PartType;
  sectionNumber: number;
  sectionTitle: string;
  versionBadge: string;
  difficulty: DifficultyLevel;
  relevanceLevel?: 'MUST-KNOW / CORE' | 'ADVANCED / DEEP-DIVE' | 'OPTIONAL / LEGACY';
  readingTime: string;
  shortDescription: string;
  prerequisites: string[];
  markdownContent?: string;
  searchableTerms?: string[];
  cheatSheetText?: string;
  whatAndWhy?: {
    definition: string;
    analogy: string;
    whyItExists: string;
  };
  syntaxBreakdown?: SyntaxSection;
  examples?: CodeExample[];
  commonMistakes?: CommonMistake[];
  bestPractices?: BestPracticeGuide;
  versionNotes?: VersionInfo;
  cheatSheet?: SummaryCheatSheet;
  exercises?: TopicExercise[];
  officialSources?: OfficialSource[];
}

export interface SectionMeta {
  sectionNumber: number;
  title: string;
  part: PartType;
  description: string;
  topicIds: string[];
  milestoneChallenge?: SectionMilestoneChallenge;
}

export interface StudentProfile {
  code: string;
  name: string;
  completedTopics: string[];
  completedCount: number;
  savedTopics: string[];
  challengeStates: Record<string, ChallengeStatus>;
  targetedReviewIds: string[];
  certificateUnlocked: boolean;
  createdAt: string;
  lastActive: string;
  userAgent?: string;
}

export type BroadcastType = 'link' | 'task' | 'announcement' | 'file';

export interface BroadcastItem {
  id: string;
  title: string;
  content: string;
  type: BroadcastType;
  url?: string;
  badgeLabel?: string;
  createdAt: string;
  expiresAt?: string;
  author?: string;
}

export interface SiteAccessConfig {
  isProtected: boolean;
  sitePasscode: string;
  updatedAt?: string;
}

