class DatabaseManager {
  constructor() {
    this.db = null;
    this.isReady = false;
    this.SQL = null;
    this.init();
  }

  async init() {
    try {
      this.SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });
      this.db = new this.SQL.Database();
      this.isReady = true;
      console.log('SQL.js Engine Loaded Successfully.');
    } catch (err) {
      console.error('Failed to load SQL.js Engine:', err);
    }
  }

  // Resets the database to a blank slate (used when starting a new experiment)
  resetDatabase() {
    if (!this.isReady) return;
    this.db.close();
    this.db = new this.SQL.Database();
  }

  // Executes a query and returns HTML table string, or error string
  executeQuery(sqlString) {
    if (!this.isReady) return '<div style="color: #ef4444;">Database engine is still loading...</div>';
    
    try {
      // Execute the query
      const results = this.db.exec(sqlString);
      
      // If no results (e.g., INSERT, CREATE)
      if (results.length === 0) {
        return '<div style="color: #10b981;">Query OK, 0 rows affected.</div>';
      }

      // If results exist (e.g., SELECT)
      const data = results[0];
      let html = '<table class="sql-results-table" style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 14px;">';
      
      // Headers
      html += '<thead><tr>';
      data.columns.forEach(col => {
        html += `<th style="border: 1px solid var(--border); padding: 8px; background: var(--card); text-align: left;">${col}</th>`;
      });
      html += '</tr></thead>';

      // Rows
      html += '<tbody>';
      data.values.forEach(row => {
        html += '<tr>';
        row.forEach(val => {
          const displayVal = val === null ? '<em>NULL</em>' : val;
          html += `<td style="border: 1px solid var(--border); padding: 8px;">${displayVal}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody></table>';
      
      return html + `<div style="color: var(--muted); font-size: 12px; margin-top: 8px;">${data.values.length} row(s) in set</div>`;

    } catch (err) {
      return `<div style="color: #ef4444;">ERROR: ${err.message}</div>`;
    }
  }

  // Use to seed an experiment with required tables
  seedDatabase(sqlString) {
    if (!this.isReady) {
      setTimeout(() => this.seedDatabase(sqlString), 100);
      return;
    }
    try {
      this.db.run(sqlString);
    } catch (err) {
      console.error('Failed to seed database:', err);
    }
  }

  // Helper to check if a specific table exists
  tableExists(tableName) {
    if (!this.isReady) return false;
    try {
      const res = this.db.exec(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name='${tableName}';`);
      return res[0].values[0][0] > 0;
    } catch (e) {
      return false;
    }
  }

  // Gets the current database schema mapping (tables -> columns)
  getSchema() {
    if (!this.isReady) return {};
    const schema = {};
    try {
      const res = this.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
      if (res.length === 0) return schema;
      
      const tables = res[0].values.map(r => r[0]);
      tables.forEach(table => {
        const columnsRes = this.db.exec(`PRAGMA table_info('${table}');`);
        if (columnsRes.length > 0) {
          schema[table] = {
            columns: columnsRes[0].values.map(row => ({ name: row[1], type: row[2] }))
          };
        }
      });
    } catch (e) {
      console.error(e);
    }
    return schema;
  }
}

// Initialize global DatabaseManager
window.DB = new DatabaseManager();
