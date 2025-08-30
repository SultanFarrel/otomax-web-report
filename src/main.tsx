import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

const queryClient = new QueryClient();

async function enableMocking() {
  // Pastikan mocking HANYA berjalan di mode 'development'
  // dan variabel VITE_API_MOCKING disetel ke 'enabled'
  if (
    import.meta.env.MODE !== "development" ||
    import.meta.env.VITE_API_MOCKING !== "enabled"
  ) {
    return;
  }

  const { worker } = await import("./mocks/browser");

  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Provider>
            <App />
          </Provider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
});
