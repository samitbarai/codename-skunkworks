import { Providers } from "./providers";
import { AppRouter } from "./Router";

export function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}
