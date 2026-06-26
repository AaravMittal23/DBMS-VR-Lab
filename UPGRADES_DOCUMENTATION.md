# DBMS Virtual Lab - Simulation Upgrades Documentation

## Overview
This document details the five comprehensive upgrades implemented to transform the DBMS Virtual Lab from a passive text-based console into an institution-grade interactive learning engine inspired by national laboratory standards (vlab.co.in).

---

## UPGRADE 1: Interactive Relational Algebra Tree Component
**Location:** `js/query-algebra-tree.js` → Integrated into `data/experiment-4/simulation.js` (Joins & Subqueries)

### Purpose
Students write SQL queries and see a dynamic visual representation of the query execution tree showing how relational algebra operators (Selection σ, Projection π, Join ⋈) are applied.

### Features
- **Dynamic Tree Generation**: Parses SQL queries and generates corresponding relational algebra trees
- **Operator Visualization**: 
  - σ (Selection) in green
  - π (Projection) in orange  
  - ⋈ (Join) in purple
  - Table sources in pink
  - Γ (Aggregation) in cyan
- **Interactive Nodes**: Click any operator node to see intermediate table results
- **Visual Layout**: SVG-based hierarchical tree with automatic positioning
- **Educational Feedback**: Immediate visual representation of query structure

### How It Works
1. User writes a SQL query in the Query Console
2. System parses query and generates tree structure
3. Tree renders visually with color-coded operators
4. Users click nodes to explore intermediate results at each transformation step
5. Pedagogical hints show when SELECT lacks aggregation with GROUP BY, etc.

### Benefits
- Helps students understand query execution flow
- Visualizes complex joins and subqueries
- Provides intuitive understanding of relational algebra
- Enables debugging of query logic visually

---

## UPGRADE 2: Functional Dependency & Normalization Canvas
**Location:** `js/fd-canvas.js` → Integrated into `data/experiment-7/simulation.js` (Normalization & FDs)

### Purpose
Interactive graphical tool to visualize functional dependencies and analyze normal form violations directly from the schema.

### Features
- **FD Diagram Rendering**: Circular layout showing attributes and their dependencies
- **Dependency Visualization**: Arrows showing A → B relationships
- **Normal Form Analysis**:
  - Automatic detection of partial dependencies (2NF violations)
  - Automatic detection of transitive dependencies (3NF violations)
  - Visual indicators for normal form status
- **Decomposition Simulation**: Shows how tables decompose through normalization steps
- **Losslessness Check**: Validates if decomposition maintains data integrity
- **Dependency Preservation Check**: Validates if FDs are preserved after decomposition

### How It Works
1. System displays FD diagram with all attributes and their relationships
2. Color-coded circles represent attributes
3. Arrows show functional dependencies
4. Analysis panel shows normal form violations
5. Students can understand why decomposition is necessary
6. System explains which FDs cause which normal form violations

### Benefits
- Visual understanding of functional dependencies
- Clear identification of normalization problems
- Interactive learning of decomposition strategies
- Reduces abstraction in database theory

---

## UPGRADE 3: Dynamic B+ Tree Indexing Simulator
**Location:** `js/b-plus-tree.js` → Integrated into `data/experiment-8/simulation.js` (Views & Indexes)

### Purpose
Visual sandbox demonstrating how database indexes work by showing B+ tree structure with insertions, node splits, and balancing.

### Features
- **B+ Tree Visualization**:
  - Leaf nodes in light green
  - Internal nodes in light blue
  - Keys displayed in sorted order within nodes
- **Dynamic Insertions**: Insert values and watch tree rebalance
- **Node Splitting Animation**: Visual feedback when nodes exceed capacity
- **Key Promotion**: Shows median key ascending to parent level
- **Search Pathfinding**: Highlights traversal path from root to leaf
- **Statistics**: Displays node count, leaf count, tree height, max keys

### How It Works
1. User creates an index with `CREATE INDEX` statement
2. System initializes B+ tree with sample data (employee salaries)
3. Tree structure renders visually with current keys
4. As values are inserted, tree automatically rebalances
5. Node splits cascade up with visual updates
6. Performance comparison shows indexed vs. unindexed scan times

### Benefits
- Demystifies index data structures
- Shows performance improvement visually
- Helps understand why indexes help queries
- Provides intuition for database query optimization

---

## UPGRADE 4: Concurrency Control Timeline & Locking Sandbox
**Location:** `js/concurrency-timeline.js` → Integrated into `data/experiment-10/simulation.js` (Concurrency Control)

### Purpose
Enhanced visualization of transaction schedules showing lock conflicts, waiting states, and deadlock scenarios step-by-step.

### Features
- **Preset Schedules**:
  - Dirty Read anomaly
  - Deadlock scenario
  - Non-Repeatable Read
  - Serializable execution (correct)
- **Timeline Visualization**: Horizontal timeline showing operations by transaction
- **Lock Status Indicators**:
  - Blue for Shared Locks (S)
  - Orange for Exclusive Locks (X)
  - Red for Deadlock situations
- **Step-Through Execution**: Next/Previous buttons to walk through schedule
- **Operation Logging**: Detailed log of each operation and its effect
- **Deadlock Detection**: Automatic visualization of circular wait conditions

### How It Works
1. User selects a preset scenario from dropdown (or manually controls transactions)
2. Timeline visualization shows all transactions horizontally
3. Each cell represents an operation in the schedule
4. Color indicates lock type or conflict
5. Current step is highlighted with gold border
6. Log shows what happened at each step
7. For deadlock, system highlights circular wait

### Benefits
- Visualizes abstract concurrency concepts
- Shows real consequences of lock conflicts
- Demonstrates why locking protocols are needed
- Makes deadlock scenarios concrete and understandable

---

## UPGRADE 5: Client-Side SQL AST Parser & Intelligent Hint Generator
**Location:** `js/sql-parser.js` → Used globally in all SQL experiments

### Purpose
Intercepts SQL errors and transforms raw syntax errors into educational feedback messages.

### Features
- **Query Parsing**: Extracts structure including:
  - Query type (SELECT, INSERT, UPDATE, DELETE)
  - Tables, columns, joins, conditions
  - Aggregate functions, GROUP BY, HAVING clauses
  - Subqueries and CTEs
- **Validation Rules Implemented**:
  1. **GROUP BY without aggregate**: Warns when selected columns lack COUNT/SUM/AVG/MIN/MAX
  2. **Aggregate without GROUP BY**: Notes behavior for entire result set
  3. **Join without ON/WHERE**: Detects unintended Cartesian products
  4. **Multiple tables without JOIN**: Alerts to ambiguous queries
  5. **SELECT without FROM**: Identifies incomplete queries
  6. **HAVING without GROUP BY**: Syntax error detection
  7. **Subquery without alias**: Suggests best practices
  8. **DISTINCT with ORDER BY**: Consistency warnings
  9. **Ambiguous columns in joins**: Column qualification suggestions
  10. **Error pattern matching**: Maps raw errors to pedagogical hints

### How It Works
1. User executes SQL query
2. System parses query structure into AST
3. Validation rules are checked against AST
4. For errors, system generates pedagogical message instead of raw error
5. Suggestions are provided to fix common issues
6. Color-coded feedback (green for success, yellow for warnings, red for errors)

### Example Transformations
- **Raw Error**: "unrecognized token"
- **Pedagogical Hint**: "Check your SQL syntax. Review keyword order: SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY"

- **Raw Error**: "GROUP BY col1"
- **Pedagogical Hint**: "You have applied GROUP BY on column X, but your selected columns need an aggregation function to collapse row records properly."

### Benefits
- Reduces frustration from cryptic SQL error messages
- Guides students toward correct solutions
- Teaches SQL best practices implicitly
- Improves learning outcomes through clear feedback

---

## Technical Implementation Details

### Library Architecture

#### query-algebra-tree.js
```
RelationalAlgebraTree class:
  - parseQuery(sql): Parses SQL into tree structure
  - render(): Renders SVG visualization
  - selectNode(node): Shows node details in modal
  - _calculatePositions(): Tree layout algorithm
  - _drawNode(svg, pos): Renders individual node
```

#### b-plus-tree.js
```
BPlusTree class:
  - insert(value): Inserts value, handles splitting
  - search(value): Finds value and returns path
  - render(): Renders SVG tree visualization
  - _splitNode(nodeId): Implements B+ tree splitting
  - getStats(): Returns tree statistics
```

#### fd-canvas.js
```
FunctionalDependencyCanvas class:
  - addDependency(from, to): Adds FD edge
  - renderDiagram(): SVG circular layout
  - analyzeNormalForms(): Checks 1NF/2NF/3NF violations
  - decomposeToNF(targetNF): Simulates decomposition
  - isLosslessDecomposition(): Validates losslessness
```

#### sql-parser.js
```
SQLParser class:
  - parse(sql): Creates query AST
  - validate(sql): Runs 10 validation rules
  - getHint(errorMessage): Matches patterns to hints

SQLErrorHandler class:
  - formatError(error, query): Transforms error to pedagogical message
  - _generateSuggestions(): Creates fix suggestions
```

#### concurrency-timeline.js
```
ConcurrencyTimeline class:
  - addTransaction(id, name, color): Registers transaction
  - loadSchedule(scheduleType): Loads preset scenarios
  - executeNextStep(): Steps through schedule
  - renderTimeline(): Visualizes operations
```

### Integration Points

#### Experiment 4 (Joins & Subqueries)
- `executeJoin()` function now:
  1. Parses query with SQLParser
  2. Validates with pedagogical hints
  3. Creates RelationalAlgebraTree
  4. Renders tree visualization
  5. Displays results with enhanced error messages

#### Experiment 7 (Normalization)
- `DOMContentLoaded` event initializes:
  1. FunctionalDependencyCanvas with schema attributes
  2. Adds all FDs from example schema
  3. Renders FD diagram
  4. Displays normal form analysis

#### Experiment 8 (Views & Indexes)
- `executeVI()` function now:
  1. When `CREATE INDEX` is executed
  2. Initializes BPlusTree with sample data
  3. Renders B+ tree visualization
  4. Shows how index organizes keys

#### Experiment 10 (Concurrency Control)
- New preset schedules dropdown with:
  1. ConcurrencyTimeline initialization
  2. Step-by-step execution
  3. Visual lock and operation tracking
  4. Deadlock detection and highlighting

### No Breaking Changes
- All upgrades are **additive** - no existing functionality is modified
- Visual shells remain unchanged - only internal components enhanced
- All upgrades are **client-side only** - compatible with GitHub Pages
- No backend dependencies introduced
- No external APIs required

---

## Browser Compatibility
- Chrome/Edge: Full support (SVG, Canvas, modern JS)
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with responsive layouts

## Performance Considerations
- Libraries are lightweight (max 10KB each)
- SVG rendering is efficient for small to medium trees
- No DOM reflows on every step (batch updates)
- Animations use CSS transitions (GPU accelerated)

## Future Enhancement Possibilities
1. Export visualizations as images
2. Step-by-step guided walkthroughs with hints
3. Practice exercises with randomized queries
4. Peer comparison of solution approaches
5. More prebuilt scenarios for edge cases
6. Integration with SQL.js for real query execution
7. Mobile-optimized touch interactions

---

## Testing Checklist
- [x] All library files have correct JavaScript syntax
- [x] All experiment modifications have correct syntax
- [x] Scripts properly linked in index.html
- [x] Libraries load before experiment scripts
- [x] No console errors on page load
- [x] Query trees render correctly for JOIN queries
- [x] FD diagrams display properly with correct attributes
- [x] B+ tree visualizes on INDEX creation
- [x] Concurrency timeline loads preset schedules
- [x] SQL parser captures validation errors
- [x] Pedagogical hints display instead of raw errors

---

## Files Created
1. `/js/query-algebra-tree.js` (278 lines)
2. `/js/b-plus-tree.js` (301 lines)
3. `/js/fd-canvas.js` (295 lines)
4. `/js/sql-parser.js` (298 lines)
5. `/js/concurrency-timeline.js` (390 lines)

## Files Modified
1. `/index.html` - Added 5 library script includes
2. `/data/experiment-4/simulation.js` - Added tree visualization
3. `/data/experiment-7/simulation.js` - Added FD canvas
4. `/data/experiment-8/simulation.js` - Added B+ tree visualization
5. `/data/experiment-10/simulation.js` - Enhanced concurrency timeline

---

## Summary
These five upgrades collectively transform the DBMS Virtual Lab into a comprehensive, interactive learning platform that makes abstract database concepts concrete through visualization and immediate feedback. Students can now:

1. **See** how queries execute step-by-step
2. **Understand** functional dependencies visually
3. **Explore** index data structures interactively
4. **Trace** concurrent transactions and lock conflicts
5. **Learn** from pedagogical error messages instead of cryptic errors

All upgrades maintain the original layout and design while significantly enhancing the educational value and interactivity of the simulation experiences.
