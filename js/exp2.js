// Step navigation functionality for ER Diagram Simulation

let currentStep = 1;

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
  
  // Scroll to top of simulation area
  const main = document.querySelector('main');
  if (main) {
    main.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  showStep(1);
});

// Add CSS for step buttons and entity boxes (inline styles would be better, but we'll use JS to add styles)
document.addEventListener('DOMContentLoaded', function() {
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
    
    .entity-box {
      background: white;
      border: 2px solid var(--primary);
      border-radius: 8px;
      min-width: 180px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .entity-header {
      background: var(--primary);
      color: white;
      padding: 12px;
      text-align: center;
      font-weight: 600;
      border-radius: 6px 6px 0 0;
    }
    
    .entity-attr {
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
      font-size: 14px;
    }
    
    .entity-attr:last-child {
      border-bottom: none;
    }
    
    .entity-attr u {
      text-decoration: underline;
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);
});