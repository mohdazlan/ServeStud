import test from 'node:test'
import assert from 'node:assert/strict'

import {
  SQL_ACTIVITIES,
  DATABASE_SCHEMAS,
  RESEARCH_STUDY_INFO,
} from '../src/sql-guru/data/sqlCurriculum.js'
import {
  createSessionDatabase,
  executeSqlQuery,
  checkActivityAnswer,
} from '../src/sql-guru/engine/sqlEngine.js'
import { generateGenAiFeedback } from '../src/sql-guru/engine/aiTutorEngine.js'

test('SQL-Guru database schemas have valid tables and data', () => {
  assert.ok(DATABASE_SCHEMAS.dreamhome, 'DreamHome DB exists')
  assert.ok(DATABASE_SCHEMAS.dreamhome.tables.Branch, 'Branch table exists')
  assert.ok(DATABASE_SCHEMAS.dreamhome.tables.Staff, 'Staff table exists')
  assert.ok(DATABASE_SCHEMAS.politeknik, 'Politeknik DB exists')

  const db = createSessionDatabase('dreamhome')
  assert.ok(db.Branch.data.length > 0, 'Branch data populated')
  assert.ok(db.Staff.data.length > 0, 'Staff data populated')
})

test('SQL-Guru DDL CREATE TABLE executes correctly and updates schema', () => {
  const db = createSessionDatabase('dreamhome')
  const createTableSql = `CREATE TABLE TestAgency (
    agencyId VARCHAR(4) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    city VARCHAR(30) NOT NULL
  );`

  const result = executeSqlQuery(createTableSql, db)
  assert.equal(result.success, true)
  assert.ok(db.TestAgency, 'TestAgency table created in memory')
  assert.equal(db.TestAgency.columns.length, 3)
  assert.equal(db.TestAgency.columns[0].pk, true)
})

test('SQL-Guru SELECT query with WHERE and ORDER BY filters accurately', () => {
  const db = createSessionDatabase('dreamhome')
  const sql = `SELECT fName, lName, position, salary
FROM Staff
WHERE salary > 10000
ORDER BY salary DESC;`

  const result = executeSqlQuery(sql, db)
  assert.equal(result.success, true)
  assert.equal(result.rows.length, 4)
  // Top earner should be John White (30000)
  assert.equal(result.rows[0][0], 'John')
  assert.equal(result.rows[0][3], 30000)
})

test('SQL-Guru INNER JOIN query combines tables on key match', () => {
  const db = createSessionDatabase('dreamhome')
  const sql = `SELECT Staff.fName, Staff.lName, Branch.city
FROM Staff
INNER JOIN Branch ON Staff.branchNo = Branch.branchNo;`

  const result = executeSqlQuery(sql, db)
  assert.equal(result.success, true)
  assert.equal(result.rows.length, 6)
})

test('SQL-Guru all curriculum activities have valid solutions that pass checker', () => {
  SQL_ACTIVITIES.forEach((activity) => {
    assert.ok(activity.expectedCode, `Activity ${activity.id} has expected code`)
    const checkRes = checkActivityAnswer(activity.expectedCode, activity)
    assert.equal(
      checkRes.passed,
      true,
      `Activity ${activity.id} expected solution passes checker`
    )
  })
})

test('SQL-Guru GenAI semantic feedback generates conversational advice', async () => {
  const activity1 = SQL_ACTIVITIES[0]
  const studentSql = 'CREATE TABLE Branch ( branchNo INT PRIMARY KEY, street VARCHAR(50), city VARCHAR(50) );'
  
  const res = await generateGenAiFeedback({
    userSql: studentSql,
    activity: activity1,
    apiKey: '',
    apiProvider: 'local',
  })

  assert.equal(res.success, true)
  assert.ok(res.feedback, 'Feedback generated')
  assert.ok(res.feedback.strengths.length > 0, 'Strengths detected')
  assert.ok(res.feedback.suggestions.length > 0, 'Suggestions detected')
})

test('SQL-Guru research metadata links match UTP study specifications', () => {
  assert.equal(RESEARCH_STUDY_INFO.surveyUrl, 'https://forms.gle/2K4PAZoXit5xKhZ49')
  assert.equal(RESEARCH_STUDY_INFO.referenceAppUrl, 'https://norshaab.github.io/sql-ai-ebook/')
  assert.equal(RESEARCH_STUDY_INFO.demoVideoUrl, 'https://youtu.be/jXBfQCEsuyE')
  assert.ok(RESEARCH_STUDY_INFO.tamConstructs.length >= 7)
})
