import { Component } from 'react';

/**
 * Evita que un fallo puntual (por ejemplo que el navegador no pueda crear el
 * contexto WebGL del visor 3D) tumbe toda la página y deje al usuario en blanco.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn('[ErrorBoundary]', error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
