/**
 * Comprueba si el navegador puede dibujar WebGL, sin dejar el contexto abierto.
 * Lo usan las dos escenas 3D (la maqueta y el carrusel de proyectos) para
 * decidir si muestran su respaldo estático.
 */
export function detectWebGL() {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
}
