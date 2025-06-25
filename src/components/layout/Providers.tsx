import AuthProvider from "@/components/layout/AuthProvider";
import ThemeProvider from "./ThemeProvider";
import { ConvexClientProvider } from "./ConvexClientProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConvexClientProvider>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </ConvexClientProvider>
  );
};

export default Providers;
