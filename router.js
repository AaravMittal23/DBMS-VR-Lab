/**
 * Router — reads the URL hash and parses route parameters.
 * URLs follow the pattern: #/experiment/{id}/{page}
 * e.g. #/experiment/1/theory
 */
class Router {
  constructor(onChange) {
    this.onChange = onChange;
    window.addEventListener('hashchange', () => this.onChange(this.parse()));
  }

  parse() {
    const hash = window.location.hash.replace('#', '') || '/';
    const parts = hash.split('/').filter(Boolean);
    
    if (parts[0] === 'sandbox') {
      return { view: 'sandbox' };
    }
    if (parts[0] === 'team-details') {
      return { view: 'team-details' };
    }
    // Expected: ['experiment', '1', 'theory']
    if (parts[0] === 'experiment' && parts[1] && parts[2]) {
      return { view: 'experiment', expId: parts[1], page: parts[2] };
    }
    return { view: 'home' };
  }

  navigate(path) {
    window.location.hash = path;
  }

  current() {
    return this.parse();
  }
}
