import fs from 'fs';
import path from 'path';

const topicsFilePath = path.join(process.cwd(), 'src/data/topics.ts');
let content = fs.readFileSync(topicsFilePath, 'utf8');

const isCrlf = content.includes('\r\n');
const nl = isCrlf ? '\r\n' : '\n';

const part3Sections = [
  {
    sectionNumber: 24,
    title: 'Spring Core & Inversion of Control',
    part: 'Part 3: Spring Boot & Production Stack',
    description: 'Explore Spring IoC, BeanFactory vs ApplicationContext, component scanning, injection strategies, and bean lifecycle.',
    topicIds: ['topic-88', 'topic-89']
  },
  {
    sectionNumber: 25,
    title: 'Spring Boot Architecture & Configuration',
    part: 'Part 3: Spring Boot & Production Stack',
    description: 'Master auto-configuration, starters, embedded runtimes, externalized YAML configurations, and multi-profile deployments.',
    topicIds: ['topic-90', 'topic-91']
  },
  {
    sectionNumber: 26,
    title: 'RESTful Web Services & Global Error Handling',
    part: 'Part 3: Spring Boot & Production Stack',
    description: 'Build production REST controllers, declarative Bean Validation constraints, and RFC 7807 global exception handling via @RestControllerAdvice.',
    topicIds: ['topic-92', 'topic-93', 'topic-94']
  },
  {
    sectionNumber: 27,
    title: 'Persistence with Spring Data JPA & Databases',
    part: 'Part 3: Spring Boot & Production Stack',
    description: 'Repository hierarchies, derived queries, dynamic projections, declarative transaction management, and N+1 prevention.',
    topicIds: ['topic-95', 'topic-96', 'topic-97']
  },
  {
    sectionNumber: 28,
    title: 'Enterprise Security with Spring Security 6',
    part: 'Part 3: Spring Boot & Production Stack',
    description: 'SecurityFilterChain, password encoders, JWT stateless authentication, and method-level role authorization.',
    topicIds: ['topic-98', 'topic-99']
  },
  {
    sectionNumber: 29,
    title: 'Master Annotations Reference Dictionary',
    part: 'Part 3: Spring Boot & Production Stack',
    description: 'Comprehensive definitive dictionary of Java SE, Jakarta EE, and Spring Boot annotations.',
    topicIds: ['topic-100']
  },
  {
    sectionNumber: 30,
    title: 'Production Libraries & Distributed Systems',
    part: 'Part 3: Spring Boot & Production Stack',
    description: 'Lombok, Flyway, JUnit 5, Actuator & Micrometer, OpenAPI 3, Redis caching, Resilience4j, and Kafka.',
    topicIds: ['topic-101', 'topic-102', 'topic-103', 'topic-104', 'topic-105', 'topic-106', 'topic-107', 'topic-108']
  }
];

const target = `export const ALL_TOPICS: TopicDetail[] = [`;
const sectionsEndMarker = `];${nl}${nl}export const ALL_TOPICS`;

if (!content.includes(sectionsEndMarker)) {
  console.error('sectionsEndMarker not found!');
  process.exit(1);
}

const formattedPart3 = part3Sections.map(s => {
  return '  ' + JSON.stringify(s, null, 2).replace(/\n/g, nl + '  ');
}).join(`,${nl}`);

const replacement = `,${nl}  // Part 3: Spring Boot & The Modern Production Ecosystem${nl}${formattedPart3}${nl}];${nl}${nl}export const ALL_TOPICS`;

content = content.replace(sectionsEndMarker, () => replacement);
fs.writeFileSync(topicsFilePath, content, 'utf8');
console.log('Successfully updated SECTIONS in src/data/topics.ts!');
