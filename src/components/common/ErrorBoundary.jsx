import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Módulo aislado por ErrorBoundary:', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="my-4 rounded-xl border border-red-800/50 bg-red-950/30 p-6 text-center">
        <p className="font-semibold text-red-300">Este módulo encontró un error.</p>
        <p className="mt-1 text-sm text-gray-400">El resto de la aplicación continúa disponible.</p>
        <div className="mt-4 flex justify-center gap-3">
          <button onClick={this.reset} className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700">Reintentar</button>
          <button onClick={() => window.location.reload()} className="rounded-lg bg-red-700 px-4 py-2 text-sm text-white hover:bg-red-600">Recargar página</button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
