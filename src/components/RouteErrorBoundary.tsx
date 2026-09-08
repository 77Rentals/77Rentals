import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Catches render/lazy-load errors within one route (e.g. Partner Hub failing
// to reach Supabase) so they don't take down the rest of the site — the
// error boundary React itself doesn't provide out of the box.
export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Route failed to load:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Algo salió mal</h1>
            <p className="text-gray-600 text-sm">
              No pudimos cargar esta página. Intenta recargar, o contacta a 77Rentals si el
              problema persiste.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
