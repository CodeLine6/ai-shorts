import AuthProvider from "@/components/layout/AuthProvider";
import ThemeProvider from "./ThemeProvider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import PaypalProvider from "./PaypalProvider";


const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConvexClientProvider>
      <AuthProvider>
        <PaypalProvider clientId={process.env.PAYPAL_CLIENT_ID!}>
            <ThemeProvider>
              {children}
            </ThemeProvider>
        </PaypalProvider>
      </AuthProvider>
    </ConvexClientProvider>
  );
};

export default Providers;
