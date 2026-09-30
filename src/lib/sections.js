// Section metadata — titles, durations, and teasers per Politeknik DFP50283 syllabus.
// `navTitle` is the compact label for the sidebar; `tabTitle` fits the mobile bottom tabs.

export const SECTION_COUNT = 8
export const LAST_SECTION = SECTION_COUNT - 1

export const TOPICS = [
  {
    id: 1,
    code: 'TOPIC 1',
    title: 'Introduction to Java Web Technologies',
    subtitle: 'Web architecture, Java EE tiers, Servlet lifecycle & API',
    sectionIds: [0, 1, 2, 3, 4, 5],
  },
  {
    id: 2,
    code: 'TOPIC 2',
    title: 'Developing Servlet (Cont...)',
    subtitle: 'Data validation (Client & Server), ServerResponse & HTTP Headers',
    sectionIds: [6, 7],
  },
]

export const SECTIONS = [
  {
    id: 0,
    topicId: 1,
    title: 'Welcome & Orientation',
    navTitle: 'Welcome',
    tabTitle: 'Welcome',
    minutes: 2,
    covers: 'How this site works — and the metaphor behind everything',
    teaser:
      'Take two minutes to see how this companion works, and meet the library that makes servlets make sense.',
  },
  {
    id: 1,
    topicId: 1,
    title: 'The Web — What Actually Happens When You Visit a Website?',
    navTitle: 'The Web',
    tabTitle: 'Web',
    minutes: 10,
    covers: 'Topic 1.1.1 — components of a web application',
    teaser:
      'You hit Enter. A page appears. What actually happened in those 200 milliseconds? More than you think.',
  },
  {
    id: 2,
    topicId: 1,
    title: 'Static vs Dynamic — Why Servlets Exist',
    navTitle: 'Static vs Dynamic',
    tabTitle: 'Static',
    minutes: 10,
    covers: 'Topics 1.1.2, 1.1.3 — static and dynamic web pages',
    teaser:
      'Why does the librarian sometimes hand everyone the same pamphlet — and sometimes write a fresh answer just for you?',
  },
  {
    id: 3,
    topicId: 1,
    title: 'The Java EE Universe — Where Everything Lives',
    navTitle: 'The Java EE Universe',
    tabTitle: 'Java EE',
    minutes: 12,
    covers: 'Topics 1.2.1, 1.2.2 — Java EE architecture and technologies',
    teaser:
      'Servlets don’t float in space. Tour the four tiers of the Java EE building and find out where your code lives.',
  },
  {
    id: 4,
    topicId: 1,
    title: 'Meet the Servlet — Anatomy & Lifecycle',
    navTitle: 'Meet the Servlet',
    tabTitle: 'Servlet',
    minutes: 15,
    covers: 'Topics 1.3.1–1.3.3 — servlet definition, architecture, lifecycle',
    teaser:
      'A servlet is just a Java class — with a very specific job and a very specific life story. Time to finally meet one.',
  },
  {
    id: 5,
    topicId: 1,
    title: 'The Servlet API — Speaking the Container’s Language',
    navTitle: 'The Servlet API',
    tabTitle: 'API',
    minutes: 12,
    covers: 'Topics 1.3.4, 1.3.5 — core Servlet API and HTTP servlets',
    teaser:
      'When the container hands your servlet a request, what exactly do you get — and what can you do with it?',
  },
  {
    id: 6,
    topicId: 2,
    title: 'Data Validation in Dynamic Web Pages',
    navTitle: '2.3 Data Validation',
    tabTitle: 'Validation',
    minutes: 12,
    covers: 'Topic 2.3 — Client-side & server-side validation, regex, error handling',
    teaser:
      'Learn how to protect your server: validate on the browser for fast UX, and validate in the servlet for ironclad security.',
  },
  {
    id: 7,
    topicId: 2,
    title: 'ServerResponse: HTTP Response Headers & Redirection',
    navTitle: '2.4 Response & Headers',
    tabTitle: 'Response',
    minutes: 12,
    covers: 'Topic 2.4 — HTTP response format, headers, sendRedirect vs forward',
    teaser:
      'Master the HTTP response envelope: manipulate headers, manage browser cache, and understand sendRedirect vs RequestDispatcher.forward().',
  },
]
