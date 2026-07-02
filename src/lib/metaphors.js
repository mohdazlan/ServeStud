// The Core Metaphor Map — from SPEC.md. Used consistently across all
// sections; never broken, never mixed.

export const METAPHORS = [
  {
    concept: 'Web Container (Tomcat)',
    metaphor: 'The library building itself',
    why: 'It manages everything inside — opening hours, staffing, rules.',
  },
  {
    concept: 'Servlet',
    metaphor: 'A librarian at a service desk',
    why: 'Receives patron requests, processes them, hands back results.',
  },
  {
    concept: 'HTTP Request',
    metaphor: 'A patron walking up to the desk with a question or form',
    why: 'Carries intent (what they want) and data (search terms, forms).',
  },
  {
    concept: 'HTTP Response',
    metaphor: 'The librarian handing back a book, a receipt, or an answer',
    why: 'Carries the result — data, a confirmation, or “we don’t have that.”',
  },
  {
    concept: 'init()',
    metaphor: 'Librarian clocking in, setting up their desk',
    why: 'Happens once, when assigned to the desk.',
  },
  {
    concept: 'service()',
    metaphor: 'Librarian serving each patron in turn',
    why: 'Happens for every request.',
  },
  {
    concept: 'destroy()',
    metaphor: 'Librarian packing up at closing time',
    why: 'Happens once, when the container shuts down.',
  },
  {
    concept: 'Static page',
    metaphor: 'A printed poster on the library wall',
    why: 'Same content for everyone, never changes.',
  },
  {
    concept: 'Dynamic page',
    metaphor: 'The librarian looking something up and telling you the result',
    why: 'Different content depending on who asks and what they ask.',
  },
  {
    concept: 'GET request',
    metaphor: 'Asking the librarian "Do you have this book?"',
    why: 'Retrieving information — no side effects.',
  },
  {
    concept: 'POST request',
    metaphor: 'Handing the librarian a filled-in membership form',
    why: 'Submitting data — creates or changes something.',
  },
  {
    concept: 'Web browser',
    metaphor: 'The patron themselves',
    why: 'Initiates the visit, receives the response.',
  },
  {
    concept: 'URL / Path',
    metaphor: 'The specific service desk and department',
    why: '/library/search is the search desk; /library/register is the membership desk.',
  },
]
