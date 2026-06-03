// jest-dom agrega matchers personalizados para aserciones sobre nodos del DOM,
// p. ej. expect(element).toHaveTextContent(/react/i).
// En @testing-library/jest-dom v6 se importa directamente (sin /extend-expect).
import '@testing-library/jest-dom';

// Mock de matchMedia (no existe en jsdom y lo usan algunos componentes de Ionic).
window.matchMedia = window.matchMedia || function() {
  return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
  };
};
