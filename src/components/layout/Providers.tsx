import AuthProvider from "@/components/layout/AuthProvider";
import ThemeProvider from "./ThemeProvider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import PaypalProvider from "./PaypalProvider";
import { TooltipProvider } from "@radix-ui/react-tooltip";


const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider delayDuration={0}>
    <ConvexClientProvider>
      <AuthProvider>
        <PaypalProvider clientId={process.env.PAYPAL_CLIENT_ID!}>
            <ThemeProvider>
              {children}
            </ThemeProvider>
        </PaypalProvider>
      </AuthProvider>
    </ConvexClientProvider>
    </TooltipProvider>
  );
};

export default Providers;
