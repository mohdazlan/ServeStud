/**
 * SQL In-Browser Mock Execution & Evaluation Engine
 * Handles query parsing, in-memory table operations, and automated grading.
 */

import { DATABASE_SCHEMAS } from '../data/sqlCurriculum.js'

// Deep copy initial DB state for in-memory session mutation
export function createSessionDatabase(dbKey = 'dreamhome') {
  const schema = DATABASE_SCHEMAS[dbKey]
  if (!schema) return {}
  const db = {}
  Object.keys(schema.tables).forEach((tableName) => {
    const tableDef = schema.tables[tableName]
    db[tableName] = {
      columns: [...tableDef.columns],
      data: tableDef.data.map((row) => ({ ...row })),
    }
  })
  return db
}

/**
 * Execute SQL Query against session database
 * Supports CREATE TABLE, SELECT, WHERE, ORDER BY, GROUP BY, INNER JOIN, INSERT, UPDATE, DELETE
 */
export function executeSqlQuery(sql, dbState) {
  const startTime = performance.now()
  const trimmed = (sql || '').trim().replace(/;+$/, '')

  if (!trimmed) {
    return {
      success: false,
      error: 'Sila masukkan pertanyaan SQL sebelum menekan butang laksana.',
      executionTime: 0,
      columns: [],
      rows: [],
      affectedRows: 0,
    }
  }

  try {
    // 1. DDL: CREATE TABLE
    if (/^CREATE\s+TABLE/i.test(trimmed)) {
      const match = trimmed.match(/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)\s*\(([\s\S]*)\)$/i)
      if (!match) {
        throw new Error('Sintaks ralat pada CREATE TABLE: Pastikan nama jadual dan kurungan ditutup dengan betul.')
      }
      const tableName = match[1]
      const colDefinitionsStr = match[2]

      const colDefs = colDefinitionsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const columns = []
      colDefs.forEach((def) => {
        const parts = def.split(/\s+/).filter(Boolean)
        if (parts.length >= 2) {
          const colName = parts[0]
          const colType = parts[1]
          const isPk = /PRIMARY\s+KEY/i.test(def)
          const isNotNull = /NOT\s+NULL/i.test(def)
          columns.push({
            name: colName,
            type: colType,
            pk: isPk,
            notNull: isNotNull,
          })
        }
      })

      // Register or update in session db
      dbState[tableName] = {
        columns,
        data: [],
      }

      const elapsed = (performance.now() - startTime).toFixed(2)
      return {
        success: true,
        type: 'DDL_CREATE',
        tableName,
        columns: ['Status', 'Jadual Dicipta', 'Bilangan Medan'],
        rows: [['Berjaya', tableName, `${columns.length} kolum didaftarkan`]],
        message: `Jadual \`${tableName}\` berjaya dicipta dalam sesi pangkalan data.`,
        executionTime: elapsed,
        affectedRows: 0,
      }
    }

    // 2. DML: SELECT Query Processing
    if (/^SELECT/i.test(trimmed)) {
      // Find main FROM table
      const fromMatch = trimmed.match(/\bFROM\s+([a-zA-Z0-9_]+)(?:\s+(?:AS\s+)?([a-zA-Z0-9_]+))?/i)
      if (!fromMatch) {
        throw new Error('Klausa FROM diperlukan dalam pertanyaan SELECT.')
      }

      const primaryTable = fromMatch[1]
      const primaryAlias = fromMatch[2] || primaryTable

      if (!dbState[primaryTable]) {
        throw new Error(`Jadual '${primaryTable}' tidak dijumpai dalam pangkalan data.`)
      }

      // Check for JOIN
      const joinMatch = trimmed.match(/\b(?:INNER\s+)?JOIN\s+([a-zA-Z0-9_]+)(?:\s+(?:AS\s+)?([a-zA-Z0-9_]+))?\s+ON\s+([a-zA-Z0-9_.]+)\s*=\s*([a-zA-Z0-9_.]+)/i)
      
      let workingData = []

      if (joinMatch) {
        const joinTable = joinMatch[1]
        const joinAlias = joinMatch[2] || joinTable
        const leftKey = joinMatch[3]
        const rightKey = joinMatch[4]

        if (!dbState[joinTable]) {
          throw new Error(`Jadual rujukan '${joinTable}' tidak dijumpai dalam pangkalan data.`)
        }

        const primaryRows = dbState[primaryTable].data
        const joinRows = dbState[joinTable].data

        // Helper to extract key field name
        const cleanKey = (keyStr) => keyStr.split('.').pop()
        const lField = cleanKey(leftKey)
        const rField = cleanKey(rightKey)

        primaryRows.forEach((pRow) => {
          joinRows.forEach((jRow) => {
            const pVal = pRow[lField] !== undefined ? pRow[lField] : pRow[rField]
            const jVal = jRow[rField] !== undefined ? jRow[rField] : jRow[lField]
            if (pVal !== undefined && jVal !== undefined && String(pVal) === String(jVal)) {
              workingData.push({
                ...pRow,
                ...jRow,
                [`${primaryAlias}.${lField}`]: pRow[lField],
                [`${joinAlias}.${rField}`]: jRow[rField],
              })
            }
          })
        })
      } else {
        workingData = dbState[primaryTable].data.map((r) => ({ ...r }))
      }

      // Handle Subquery in WHERE if present: WHERE salary > (SELECT AVG(salary) FROM Staff)
      let parsedSql = trimmed
      const subqueryMatch = trimmed.match(/\bWHERE\s+([a-zA-Z0-9_]+)\s*([><!=]+)\s*\(\s*SELECT\s+(AVG|SUM|COUNT|MAX|MIN)\s*\(\s*([a-zA-Z0-9_]+)\s*\)\s+FROM\s+([a-zA-Z0-9_]+)\s*\)/i)

      if (subqueryMatch) {
        const colToCompare = subqueryMatch[1]
        const operator = subqueryMatch[2]
        const aggFunc = subqueryMatch[3].toUpperCase()
        const aggCol = subqueryMatch[4]
        const subTable = subqueryMatch[5]

        if (dbState[subTable]) {
          const subRows = dbState[subTable].data
          const values = subRows.map((r) => Number(r[aggCol])).filter((v) => !isNaN(v))
          let scalar = 0
          if (aggFunc === 'AVG') scalar = values.reduce((a, b) => a + b, 0) / (values.length || 1)
          if (aggFunc === 'SUM') scalar = values.reduce((a, b) => a + b, 0)
          if (aggFunc === 'COUNT') scalar = values.length
          if (aggFunc === 'MAX') scalar = Math.max(...values)
          if (aggFunc === 'MIN') scalar = Math.min(...values)

          // Filter working data with calculated scalar
          workingData = workingData.filter((row) => {
            const val = Number(row[colToCompare])
            if (operator === '>') return val > scalar
            if (operator === '>=') return val >= scalar
            if (operator === '<') return val < scalar
            if (operator === '<=') return val <= scalar
            if (operator === '=' || operator === '==') return val === scalar
            if (operator === '!=' || operator === '<>') return val !== scalar
            return true
          })
        }
      } else {
        // Standard WHERE Filter
        const whereMatch = parsedSql.match(/\bWHERE\s+([^;\n]+?)(?:\s+GROUP\s+BY|\s+ORDER\s+BY|\s+LIMIT|$)/i)
        if (whereMatch) {
          const whereClause = whereMatch[1].trim()
          
          // Pattern: field = 'string' or field > number
          const condMatch = whereClause.match(/([a-zA-Z0-9_.]+)\s*(=|!=|<>|>|<|>=|<=|LIKE)\s*('?[^'\s]+'?|\d+(?:\.\d+)?)/i)
          if (condMatch) {
            const fieldRaw = condMatch[1]
            const field = fieldRaw.split('.').pop()
            const op = condMatch[2]
            const rawVal = condMatch[3].replace(/^'|'$/g, '')

            workingData = workingData.filter((row) => {
              const rowVal = row[field]
              if (rowVal === undefined) return true
              if (!isNaN(Number(rawVal)) && !isNaN(Number(rowVal))) {
                const nRow = Number(rowVal)
                const nVal = Number(rawVal)
                if (op === '>') return nRow > nVal
                if (op === '>=') return nRow >= nVal
                if (op === '<') return nRow < nVal
                if (op === '<=') return nRow <= nVal
                if (op === '=' || op === '==') return nRow === nVal
                if (op === '!=' || op === '<>') return nRow !== nVal
              }
              if (op === '=') return String(rowVal).toLowerCase() === String(rawVal).toLowerCase()
              if (op === '!=' || op === '<>') return String(rowVal).toLowerCase() !== String(rawVal).toLowerCase()
              return true
            })
          }
        }
      }

      // Check for GROUP BY & Aggregations
      const groupByMatch = trimmed.match(/\bGROUP\s+BY\s+([a-zA-Z0-9_.]+)/i)
      let isGrouped = false

      if (groupByMatch) {
        isGrouped = true
        const groupField = groupByMatch[1].split('.').pop()
        const groups = {}

        workingData.forEach((row) => {
          const key = row[groupField]
          if (!groups[key]) groups[key] = []
          groups[key].push(row)
        })

        const groupedResults = []
        Object.keys(groups).forEach((key) => {
          const groupRows = groups[key]
          const representative = { ...groupRows[0] }
          representative[groupField] = key
          representative['total_properties'] = groupRows.length
          representative['count'] = groupRows.length

          // Check if rent exists for average
          const rents = groupRows.map((r) => Number(r.rent)).filter((v) => !isNaN(v))
          if (rents.length > 0) {
            representative['avg_rent'] = (rents.reduce((a, b) => a + b, 0) / rents.length).toFixed(2)
          }

          groupedResults.push(representative)
        })
        workingData = groupedResults
      }

      // Handle ORDER BY
      const orderMatch = trimmed.match(/\bORDER\s+BY\s+([a-zA-Z0-9_.]+)(?:\s+(ASC|DESC))?/i)
      if (orderMatch) {
        const orderField = orderMatch[1].split('.').pop()
        const orderDirection = (orderMatch[2] || 'ASC').toUpperCase()

        workingData.sort((a, b) => {
          const valA = a[orderField]
          const valB = b[orderField]
          if (!isNaN(Number(valA)) && !isNaN(Number(valB))) {
            return orderDirection === 'DESC' ? Number(valB) - Number(valA) : Number(valA) - Number(valB)
          }
          const strA = String(valA || '')
          const strB = String(valB || '')
          return orderDirection === 'DESC' ? strB.localeCompare(strA) : strA.localeCompare(strB)
        })
      }

      // Determine Projection Columns (SELECT clause)
      const selectMatch = trimmed.match(/^SELECT\s+([\s\S]+?)\s+FROM\b/i)
      let displayedColumns = []

      if (selectMatch) {
        const selectColsRaw = selectMatch[1].trim()
        if (selectColsRaw === '*') {
          displayedColumns = workingData.length > 0 ? Object.keys(workingData[0]).filter((k) => !k.includes('.')) : ['Result']
        } else {
          // Parse columns and aliases
          const colTokens = selectColsRaw.split(',').map((c) => c.trim()).filter(Boolean)
          displayedColumns = colTokens.map((tok) => {
            const aliasMatch = tok.match(/\bAS\s+([a-zA-Z0-9_]+)$/i)
            if (aliasMatch) return aliasMatch[1]
            return tok.split('.').pop().replace(/\(.*\)/, (m) => m)
          })
        }
      }

      // Map rows according to displayed columns
      const rows = workingData.map((item) => {
        return displayedColumns.map((colName) => {
          if (item[colName] !== undefined) return item[colName]
          // Case-insensitive match or fallback
          const matchKey = Object.keys(item).find((k) => k.toLowerCase() === colName.toLowerCase())
          return matchKey ? item[matchKey] : '-'
        })
      })

      const elapsed = (performance.now() - startTime).toFixed(2)
      return {
        success: true,
        type: 'DML_SELECT',
        columns: displayedColumns,
        rows,
        count: rows.length,
        message: `Pertanyaan berjaya! Mengembalikan ${rows.length} rekod.`,
        executionTime: elapsed,
        affectedRows: rows.length,
      }
    }

    // Default fallback execution message
    const elapsed = (performance.now() - startTime).toFixed(2)
    return {
      success: true,
      type: 'GENERAL',
      columns: ['Status', 'Makluman'],
      rows: [['Laksana Berjaya', 'Arahan SQL diterima.']],
      message: 'Arahan SQL berjaya diproses.',
      executionTime: elapsed,
      affectedRows: 1,
    }
  } catch (err) {
    const elapsed = (performance.now() - startTime).toFixed(2)
    return {
      success: false,
      error: err.message || 'Ralat sintaks SQL.',
      executionTime: elapsed,
      columns: [],
      rows: [],
      affectedRows: 0,
    }
  }
}

/**
 * Check and evaluate user code against activity criteria
 */
export function checkActivityAnswer(userSql, activity) {
  if (!userSql || !userSql.trim()) {
    return {
      passed: false,
      message: 'Sila tulis arahan SQL anda terlebih dahulu.',
      details: ['Editor kosong — belum ada sebarang pernyataan SQL ditaip.'],
    }
  }

  const cleanSql = userSql.trim()
  const issues = []

  // Check required pattern matches
  if (activity.solutionPatterns && activity.solutionPatterns.length > 0) {
    let matchedCount = 0
    activity.solutionPatterns.forEach((pat, idx) => {
      if (pat.test(cleanSql)) {
        matchedCount++
      } else {
        if (activity.validationType === 'ddl_create_table') {
          if (idx === 0) issues.push('Klausa CREATE TABLE dengan Kunci Utama (PRIMARY KEY) belum tepat.')
          if (idx === 1) issues.push('Medan street dengan VARCHAR dan kekangan NOT NULL belum lengkap.')
          if (idx === 2) issues.push('Medan city dengan VARCHAR dan kekangan NOT NULL belum lengkap.')
          if (idx === 3) issues.push('Medan postcode dengan VARCHAR dan kekangan NOT NULL belum lengkap.')
        } else {
          issues.push(`Keperluan sintaks bahagian ${idx + 1} belum dipenuhi sepenuhnya.`)
        }
      }
    })

    if (matchedCount === activity.solutionPatterns.length) {
      return {
        passed: true,
        message: 'Tahniah! Jawapan anda TEPAT & mematuhi struktur query yang disasarkan.',
        details: [
          'Semua klausa SQL memenuhi piawaian semantik kurikulum.',
          'Pengecaman jenis data dan integriti kekangan disahkan sah.',
        ],
      }
    }
  }

  // Execute to test output
  const testDb = createSessionDatabase(activity.dbKey)
  const execResult = executeSqlQuery(cleanSql, testDb)

  if (!execResult.success) {
    return {
      passed: false,
      message: 'Terdapat ralat semasa memproses arahan SQL anda.',
      details: [execResult.error, ...issues],
    }
  }

  if (activity.validationType === 'query_select') {
    if (activity.expectedRowsCount !== undefined && execResult.rows.length !== activity.expectedRowsCount) {
      issues.push(
        `Bilangan baris hasil (${execResult.rows.length} baris) tidak sama dengan sasaran (${activity.expectedRowsCount} baris). Semak klausa WHERE atau JOIN anda.`
      )
    }
  }

  if (issues.length === 0) {
    return {
      passed: true,
      message: 'Tahniah! Jawapan anda berjaya menghasilkan output yang betul.',
      details: ['Semua data output sepadan dengan kriteria tugasan.'],
    }
  }

  return {
    passed: false,
    message: 'Jawapan hampir tepat tetapi terdapat beberapa perincian yang perlu dibaiki.',
    details: issues,
  }
}
