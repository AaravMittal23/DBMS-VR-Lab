/**
 * SQL AST Parser & Intelligent Hint Generator
 * Provides educational hints for SQL errors
 */

class SQLParser {
  constructor() {
    this.lastQuery = '';
    this.hints = [];
  }

  /**
   * Parse SQL query and return structured AST
   */
  parse(sql) {
    this.lastQuery = sql;
    const normalized = sql.trim();
    
    const ast = {
      raw: sql,
      normalized: normalized,
      type: this._getQueryType(normalized),
      hasSelect: this._hasClause(normalized, 'SELECT'),
      hasFrom: this._hasClause(normalized, 'FROM'),
      hasWhere: this._hasClause(normalized, 'WHERE'),
      hasGroupBy: this._hasClause(normalized, 'GROUP BY'),
      hasHaving: this._hasClause(normalized, 'HAVING'),
      hasOrderBy: this._hasClause(normalized, 'ORDER BY'),
      hasJoin: /JOIN/i.test(normalized),
      tables: this._extractTables(normalized),
      columns: this._extractColumns(normalized),
      aggregates: this._extractAggregates(normalized),
      joins: this._extractJoins(normalized),
      conditions: this._extractConditions(normalized)
    };

    return ast;
  }

  /**
   * Validate query and generate hints
   */
  validate(sql) {
    const ast = this.parse(sql);
    const issues = [];

    // Rule 1: GROUP BY without aggregates
    if (ast.hasGroupBy && !this._hasAggregates(ast)) {
      issues.push({
        level: 'warning',
        message: 'Pedagogical Hint: You have applied GROUP BY, but your SELECT columns don\'t include aggregation functions (COUNT, SUM, AVG, MIN, MAX). Columns in SELECT must either be grouped or aggregated.',
        code: 'GROUP_BY_NO_AGGREGATE'
      });
    }

    // Rule 2: Aggregate without GROUP BY
    if (this._hasAggregates(ast) && !ast.hasGroupBy && ast.hasFrom) {
      issues.push({
        level: 'info',
        message: 'Note: You\'re using an aggregate function without GROUP BY. This will compute the aggregate over the entire result set.',
        code: 'AGGREGATE_NO_GROUP_BY'
      });
    }

    // Rule 3: Join without explicit ON/WHERE condition
    if (ast.hasJoin && !this._hasJoinCondition(ast)) {
      issues.push({
        level: 'warning',
        message: 'Pedagogical Hint: Your JOIN query lacks an explicit ON or WHERE condition linking the tables. This creates a Cartesian product (every row from table 1 combined with every row from table 2), which is usually unintended.',
        code: 'IMPLICIT_CARTESIAN_PRODUCT'
      });
    }

    // Rule 4: Multiple tables without JOIN
    if (ast.tables.length > 1 && !ast.hasJoin && ast.hasFrom) {
      issues.push({
        level: 'warning',
        message: 'Pedagogical Hint: You\'re selecting from multiple tables without using JOIN. This typically results in a Cartesian product. Did you mean to use INNER JOIN, LEFT JOIN, or CROSS JOIN?',
        code: 'MULTIPLE_TABLES_NO_JOIN'
      });
    }

    // Rule 5: Empty query
    if (!ast.hasSelect && !ast.hasFrom) {
      issues.push({
        level: 'error',
        message: 'Syntax Error: Query must contain SELECT and FROM clauses.',
        code: 'INCOMPLETE_QUERY'
      });
    }

    // Rule 6: SELECT without FROM (when not aggregate functions like SELECT 1)
    if (ast.hasSelect && !ast.hasFrom && ast.columns.length > 0) {
      const isConstant = /^SELECT\s+\d+/i.test(sql);
      if (!isConstant) {
        issues.push({
          level: 'warning',
          message: 'Pedagogical Hint: Your SELECT clause doesn\'t specify a FROM clause. Did you forget to specify which table(s) to query?',
          code: 'SELECT_WITHOUT_FROM'
        });
      }
    }

    // Rule 7: HAVING without GROUP BY
    if (ast.hasHaving && !ast.hasGroupBy) {
      issues.push({
        level: 'error',
        message: 'Syntax Error: HAVING clause requires GROUP BY clause.',
        code: 'HAVING_WITHOUT_GROUP_BY'
      });
    }

    // Rule 8: Subquery in SELECT without alias
    if (this._hasSubquery(sql) && !this._hasAlias(sql)) {
      issues.push({
        level: 'info',
        message: 'Tip: Consider aliasing subqueries for better readability: SELECT ... AS column_name',
        code: 'SUBQUERY_NO_ALIAS'
      });
    }

    // Rule 9: DISTINCT with ORDER BY non-selected columns
    if (/DISTINCT/i.test(sql) && /ORDER BY/i.test(sql)) {
      issues.push({
        level: 'info',
        message: 'Note: When using DISTINCT, ensure ORDER BY columns are in the SELECT list for consistency.',
        code: 'DISTINCT_ORDER_BY'
      });
    }

    // Rule 10: Column ambiguity in joins
    if (ast.hasJoin && ast.tables.length > 1) {
      issues.push({
        level: 'info',
        message: 'Tip: In JOIN queries with multiple tables, consider using table aliases or qualified column names (table.column) to avoid ambiguity.',
        code: 'AMBIGUOUS_COLUMNS'
      });
    }

    this.hints = issues;
    return issues;
  }

  /**
   * Get hint message for a specific error
   */
  getHint(errorMessage) {
    const patterns = [
      {
        pattern: /GROUP BY/i,
        hint: 'Pedagogical Hint: Check your GROUP BY clause. All non-aggregated columns must be in the GROUP BY clause.'
      },
      {
        pattern: /unrecognized token/i,
        hint: 'Syntax Error: There\'s a typo or unrecognized keyword in your query. Check spelling and SQL keywords.'
      },
      {
        pattern: /column.*not found/i,
        hint: 'Pedagogical Hint: A column you referenced doesn\'t exist in the table(s). Check column names and table aliases.'
      },
      {
        pattern: /ambiguous column/i,
        hint: 'Pedagogical Hint: Multiple tables have a column with this name. Use table.column syntax to disambiguate.'
      },
      {
        pattern: /syntax error/i,
        hint: 'Syntax Error: Check your SQL syntax. Review keyword order: SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY'
      }
    ];

    for (const rule of patterns) {
      if (rule.pattern.test(errorMessage)) {
        return rule.hint;
      }
    }

    return null;
  }

  // Helper methods
  _getQueryType(sql) {
    if (/^\s*SELECT/i.test(sql)) return 'SELECT';
    if (/^\s*INSERT/i.test(sql)) return 'INSERT';
    if (/^\s*UPDATE/i.test(sql)) return 'UPDATE';
    if (/^\s*DELETE/i.test(sql)) return 'DELETE';
    return 'UNKNOWN';
  }

  _hasClause(sql, clause) {
    return new RegExp(`\\b${clause}\\b`, 'i').test(sql);
  }

  _extractTables(sql) {
    const fromMatch = sql.match(/FROM\s+([^WHERE;]+?)(?:WHERE|GROUP|ORDER|$)/i);
    if (!fromMatch) return [];
    
    const tableStr = fromMatch[1];
    return tableStr
      .split(/[,;]/)
      .map(t => t.trim().split(/\s+/)[0])
      .filter(t => t && !/^ON$/i.test(t));
  }

  _extractColumns(sql) {
    const selectMatch = sql.match(/SELECT\s+(.+?)\s+FROM/i);
    if (!selectMatch) return [];
    
    const columnStr = selectMatch[1];
    return columnStr
      .split(',')
      .map(c => c.trim())
      .filter(c => c);
  }

  _extractAggregates(sql) {
    const agg = ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'];
    const found = [];
    agg.forEach(a => {
      if (new RegExp(`\\b${a}\\s*\\(`, 'i').test(sql)) {
        found.push(a);
      }
    });
    return found;
  }

  _hasAggregates(ast) {
    return ast.aggregates.length > 0;
  }

  _extractJoins(sql) {
    const joins = [];
    const joinTypes = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'];
    
    joinTypes.forEach(type => {
      if (new RegExp(`\\b${type}\\b`, 'i').test(sql)) {
        joins.push(type);
      }
    });
    
    return joins;
  }

  _hasJoinCondition(ast) {
    // Check if there's an ON clause or WHERE condition
    return /\bON\b/i.test(this.lastQuery) || this._extractConditions(this.lastQuery).length > 0;
  }

  _extractConditions(sql) {
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:GROUP|HAVING|ORDER|$)/i);
    if (!whereMatch) return [];
    return [whereMatch[1].trim()];
  }

  _hasSubquery(sql) {
    return /\(SELECT/i.test(sql);
  }

  _hasAlias(sql) {
    return /AS\s+\w+/i.test(sql);
  }
}

/**
 * Error message interceptor and hint provider
 */
class SQLErrorHandler {
  static formatError(error, query = '') {
    const parser = new SQLParser();
    const issues = parser.validate(query);
    
    const customHint = parser.getHint(error.message);
    
    const formatted = {
      raw: error.message,
      pedagogical: customHint || 'An error occurred. Please check your SQL syntax.',
      issues: issues,
      suggestions: this._generateSuggestions(query, error)
    };

    return formatted;
  }

  static _generateSuggestions(query, error) {
    const suggestions = [];
    const upper = query.toUpperCase();

    if (upper.includes('GROUP BY') && !upper.includes('COUNT') && !upper.includes('SUM')) {
      suggestions.push('Add an aggregate function: COUNT(*), SUM(column), AVG(column), MIN(column), or MAX(column)');
    }

    if (upper.includes('WHERE') && upper.includes('AND') && !upper.includes('(')) {
      suggestions.push('Use parentheses to clarify complex conditions: WHERE (col1 = val1) AND (col2 = val2)');
    }

    if (upper.includes('SELECT') && !upper.includes('FROM')) {
      suggestions.push('Add a FROM clause to specify which table(s) to query');
    }

    if (upper.includes('JOIN') && !upper.includes('ON')) {
      suggestions.push('Add an ON clause to specify the join condition: JOIN table ON condition');
    }

    return suggestions;
  }
}

if (typeof window !== 'undefined') {
  window.SQLParser = SQLParser;
  window.SQLErrorHandler = SQLErrorHandler;
}
