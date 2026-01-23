/**
 * Database Normalization Simulation for Experiment 3
 * 
 * Simulation Flow:
 * 1. Original Relation: Displays the unnormalized relation with functional dependencies and problems
 * 2. Step 1 (1NF): Shows the relation in First Normal Form (already atomic, no changes needed)
 * 3. Step 2 (2NF): Decomposes to eliminate partial dependencies
 *    - Creates Enrollment table (student_id, course_id, grade)
 *    - Creates Student table (student_id, student_name, dept_id, dept_name)
 *    - Note: Still has transitive dependency
 * 4. Step 3 (3NF): Further decomposes to eliminate transitive dependencies
 *    - Enrollment table remains
 *    - Student table (student_id, student_name, dept_id)
 *    - Department table (dept_id, dept_name)
 *    - Course table (course_id, course_name, instructor)
 * 
 * The simulation uses step-based navigation where users can click through each normalization step
 * to visually understand how functional dependencies guide the decomposition process.
 */

// Current step in the simulation
let currentStep = 0;

/**
 * Shows the specified step in the normalization simulation
 * @param {number} step - The step number (0 = Original, 1 = 1NF, 2 = 2NF, 3 = 3NF)
 */
function showStep(step) {
  // Hide all steps
  const steps = document.querySelectorAll('.simulation-step');
  steps.forEach(s => s.style.display = 'none');
  
  // Remove active class from all buttons
  const buttons = document.querySelectorAll('.step-button');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // Show selected step
  const stepElement = document.getElementById(`step${step}`);
  if (stepElement) {
    stepElement.style.display = 'block';
  }
  
  // Add active class to selected button
  const button = document.getElementById(`step${step}Btn`);
  if (button) {
    button.classList.add('active');
  }
  
  currentStep = step;
  
  // Scroll to top of simulation area for better UX
  const main = document.querySelector('main');
  if (main) {
    main.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Initialize the simulation on page load
 * Sets up the initial state and adds dynamic styles for step buttons
 */
document.addEventListener('DOMContentLoaded', function() {
  // Show the first step (Original Relation)
  showStep(0);
  
  // Add CSS for step buttons dynamically (to avoid modifying shared CSS)
  const style = document.createElement('style');
  style.textContent = `
    .step-button {
      padding: 12px 24px;
      background: var(--card);
      border: 2px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      color: var(--text);
      transition: all 0.3s ease;
      font-size: 14px;
    }
    
    .step-button:hover {
      background: var(--yellow-light);
      border-color: var(--yellow);
      transform: translateY(-2px);
    }
    
    .step-button.active {
      background: linear-gradient(135deg, var(--imperial-blue), var(--french-blue));
      color: white;
      border-color: var(--imperial-blue);
    }
  `;
  document.head.appendChild(style);
});
