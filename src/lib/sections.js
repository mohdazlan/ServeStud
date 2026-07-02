// Section metadata — titles, durations, and teasers per SPEC.md.
// `navTitle` is the compact label for the sidebar; `tabTitle` fits the
// mobile bottom tabs.

export const SECTION_COUNT = 6
export const LAST_SECTION = SECTION_COUNT - 1

export const SECTIONS = [
  {
    id: 0,
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
    title: 'The Servlet API — Speaking the Container’s Language',
    navTitle: 'The Servlet API',
    tabTitle: 'API',
    minutes: 12,
    covers: 'Topics 1.3.4, 1.3.5 — core Servlet API and HTTP servlets',
    teaser:
      'When the container hands your servlet a request, what exactly do you get — and what can you do with it?',
  },
]
