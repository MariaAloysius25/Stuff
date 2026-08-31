import { FallbackProps } from 'react-error-boundary';


// Use FallbackProps to automatically type 'error' and 'resetErrorBoundary'
export function FallbackComponent({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div role="alert">
            <h2>Something went wrong:</h2>
            {/* Type-guard or safely read message, as error could be unknown */}
            <pre>{error instanceof Error ? error.message : String(error)}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
}