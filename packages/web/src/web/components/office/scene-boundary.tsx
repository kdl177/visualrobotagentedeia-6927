import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

/** Si el navegador no puede crear contexto WebGL, la web sigue siendo usable. */
export class SceneBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="scene-fallback">
          <p className="scene-fallback__title">Tu navegador no pudo iniciar el 3D</p>
          <p className="scene-fallback__body">
            Esta oficina necesita WebGL. Prueba con Chrome, Edge o Safari actualizados y con la
            aceleración por hardware activada.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
