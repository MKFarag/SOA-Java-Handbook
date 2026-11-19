export type PartType = 'Part 1: Java Core' | 'Part 2: Java EE & Jakarta EE';

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
  organization: 'Oracle' | 'OpenJDK' | 'Jakarta EE' | 'Apache Tomcat' | 'Eclipse Foundation';
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
  readingTime: string;
  shortDescription: string;
  prerequisites: string[];
  whatAndWhy: {
    definition: string;
    analogy: string;
    whyItExists: string;
  };
  syntaxBreakdown: SyntaxSection;
  examples: CodeExample[];
  commonMistakes: CommonMistake[];
  bestPractices: BestPracticeGuide;
  versionNotes: VersionInfo;
  cheatSheet: SummaryCheatSheet;
  exercises: TopicExercise[];
  officialSources: OfficialSource[];
}

export interface SectionMeta {
  sectionNumber: number;
  title: string;
  part: PartType;
  description: string;
  topicIds: string[];
}
