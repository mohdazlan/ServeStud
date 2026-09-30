# Topic 3 — Introduction to JavaServer Pages (JSP)

## Theme and concept analysis

The existing app treats a web application as a library: Tomcat is the building, a servlet is the librarian, the browser is the patron, and the HTTP response is the answer handed back. Topic 3 extends that map with **JSP as the answer sheet** that the librarian fills with live information. The metaphor stops at the point where technical precision matters: Tomcat translates JSP into a servlet, and the browser receives generated HTML.

The visual theme is a warm reading room: paper surfaces, dark shelf callouts, lamp-green knowledge cues, amber actions, serif headings, and readable sans-serif body text. The teaching pattern is short explanation, controlled interaction, practice, then a checkpoint. Northwind is presented as a separate practice database for SQL/JSP work; it is not renamed to the Library Management System used for the conceptual examples.

The audience is diploma students who know basic Java and HTML. Therefore the lesson introduces one syntax form at a time, explains the server/browser boundary, and gives a reproducible Workbench path with visible verification rather than assuming students already know how to import SQL.

## Development record

### 2026-09-24 · Source-folder recheck

- Rechecked the complete `ServeStud-main` folder, including nested files outside `node_modules` and `dist`. The Markdown sources present are `README.md`, `SPEC.md`, `PRODUCT.md`, `DESIGN.md`, and this file. There is no PDF or ODF file in the project at this time.
- Reviewed the full Markdown outline and the Topic 1 sections that introduce JSP as a web-tier presentation technology and JDBC as the database bridge. The Topic 3 lesson continues those established concepts and the same library metaphor.
- Also checked the folder containing the two caption files mentioned in the request; it contains Markdown guides but no PDF or ODF. The exact document path is needed to finish the requested PDF/ODF review.

### 2026-09-24 · Lesson shell and interactive learning path

- Added a separate Topic 3 route at `#/topic-3`, reachable from Topic 1 navigation, with its own section navigation and page title. Topic 1 quiz progress remains separate.
- Built the first lesson path: request-to-JSP stepper; directive, expression, scriptlet, and Expression Language examples; a prediction exercise; MySQL Workbench import walkthrough; JOIN-view exercise; and a four-question checkpoint.
- Added a two-part JOIN practice check before the worked view: students choose `LEFT JOIN` and match `orders.customer_id` to `customers.id`, with corrective feedback.
- Kept the library metaphor and the existing reading-room colors/type. The Northwind dataset is identified as a distinct lab dataset, so learners do not confuse it with the library scenario.
- The project build and lint complete. Lint reports only warnings in pre-existing Topic 1 files.

### 2026-09-24 · MySQL Workbench Northwind & JOIN view tutorial
- Implemented a complete 4-step interactive tutorial in `Topic3JSP.jsx` under the `stage === 'view'` section ("Build a JOIN view").
- Integrated downloadable file cards for the three scripts with strict sequence badges (`1. northwind.sql` Schema &rarr; `2. northwind-data.sql` Data &rarr; `3. customer-order-view.sql` View).
- Added tabbed Workbench walkthrough steps: Step 1 (Open and execute schema with lightning bolt ⚡), Step 2 (Load data records and refresh Schemas panel 🔄), Step 3 (Execute VIEW script and resolve Error 1060 column collisions), and Step 4 (Query the view, inspect unmatched customers with `WHERE order_id IS NULL`, and compare against `INNER JOIN`).
- Added persistent checklist (`servestud-topic3-view-checks`) and comprehensive troubleshooting callouts for Errors 1046, 1049, 1146, 1060, missing views, and accidental partial text execution in Workbench.

### 2026-09-24 · SQL references and lab files

- Added downloadable copies of the two candidate Northwind scripts under `public/sql/`, with their original filenames. Their SHA-256 hashes match the source copies on the HIKSEMI volume.
- Added `customer-order-view.sql` as a worked solution. It creates a `LEFT JOIN` view with explicit `customer_id` and `order_id` aliases, then queries the view.
- The import walkthrough explicitly runs schema before data, points students to Workbench's Action Output and Schemas panel, and uses verification queries instead of assuming a fixed row count.

### 2026-09-24 · Source and concept review

- Reviewed the existing project Markdown: `README.md`, `SPEC.md`, `PRODUCT.md`, and `DESIGN.md`. Topic 1 uses a warm reading-room visual language, short explanations, library metaphors, guided practice, and checkpoint quizzes. Topic 3 should continue that teaching pattern while making the move from servlets to JSP explicit.
- Located two candidate Northwind scripts at `/Volumes/HIKSEMI/northwind.sql` and `/Volumes/HIKSEMI/northwind-data.sql`. The first creates the `northwind` schema and tables; the second inserts sample records and depends on the schema already existing. The schema script begins with `DROP SCHEMA IF EXISTS northwind`, so the import exercise must warn learners to use a disposable/local schema and avoid rerunning it on data they need to keep.
- Confirmed the relationship for the planned exercise: `customers.id` is referenced by nullable `orders.customer_id`. The view example should give distinct output column names and use `orders.id` to identify unmatched `LEFT JOIN` rows, because `orders.order_date` may itself be `NULL`.
- Verified the supplied [YouTube lesson](https://youtu.be/0vkBVJz1xY8) is an 18:06 Northwind JSP/MySQL tutorial by Mohd Azlan Ab Aziz. Its transcript covers the customer/order key relationship, `INNER JOIN` versus `LEFT JOIN`, null order IDs, JSP scriptlets, JDBC, and result tables. The new exercise uses that video as a concept reference and then asks learners to create a reusable MySQL view in Workbench; the view task is an extension, not a step claimed to be in the video.
- A Topic 3 PDF has been requested from the user and is still pending. Its syllabus and terminology will be checked before finalizing lesson scope.

## Intended lesson flow

1. What JSP is and how Tomcat translates a `.jsp` page into a servlet.
2. JSP page structure: directives, HTML template text, expressions, and legacy scriptlets.
3. Request data and output: a small library-themed example, with safe output handling explained.
4. JSP in a web application: servlet/controller prepares data; JSP renders it.
5. Northwind lab: load schema and data in MySQL Workbench, inspect the customer/order relationship, compare joins, create a join view, and query it.
6. Checkpoints and troubleshooting with clear expected results that do not assume fixed row counts.

## Source links

- [Join tutorial video](https://youtu.be/0vkBVJz1xY8)
- [MySQL Workbench SQL query toolbar](https://dev.mysql.com/doc/workbench/en/wb-sql-editor-toolbar.html)
- [MySQL `CREATE VIEW` reference](https://dev.mysql.com/doc/refman/8.4/en/create-view.html)
