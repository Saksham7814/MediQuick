import Button from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <div className="container-content flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-display text-7xl font-semibold text-brand-600">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink-900">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-ink-500">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Button to="/">Back to home</Button>
        <Button variant="outline" to="/explore">
          Explore
        </Button>
      </div>
    </div>
  );
}
