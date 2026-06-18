/**
 * Interactive Guide Tour using Shepherd.js
 */
window.startTour = function() {
  if (!window.Shepherd) {
    console.error("Shepherd.js not loaded");
    return;
  }

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: { enabled: true },
      classes: 'shadow-md bg-purple-dark',
      scrollTo: { behavior: 'smooth', block: 'center' }
    }
  });

  tour.addStep({
    id: 'intro-step',
    text: 'Welcome to the Virtual Lab! Let\'s take a quick tour to help you get started.',
    buttons: [
      { text: 'Skip', action: tour.cancel, classes: 'shepherd-button-secondary' },
      { text: 'Next', action: tour.next, classes: 'shepherd-button-primary' }
    ]
  });

  tour.addStep({
    id: 'sidebar-step',
    text: 'Use the sidebar to navigate through the different sections of the experiment (Aim, Theory, Pre-Test, etc.).',
    attachTo: { element: '.sidebar nav', on: 'right' },
    buttons: [
      { text: 'Back', action: tour.back, classes: 'shepherd-button-secondary' },
      { text: 'Next', action: tour.next, classes: 'shepherd-button-primary' }
    ]
  });

  tour.addStep({
    id: 'content-step',
    text: 'The main content for each section will appear here. Be sure to read the Theory before jumping into the Simulation!',
    attachTo: { element: '#main', on: 'top' },
    buttons: [
      { text: 'Back', action: tour.back, classes: 'shepherd-button-secondary' },
      { text: 'Finish', action: tour.complete, classes: 'shepherd-button-primary' }
    ]
  });

  tour.start();
};
