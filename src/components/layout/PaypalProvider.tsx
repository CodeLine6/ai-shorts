"use client"

import { PayPalScriptProvider } from "@paypal/react-paypal-js"

const PaypalProvider = ({children, clientId}: {children: React.ReactNode, clientId: string}) => {
  return (
            <PayPalScriptProvider options={{ clientId }}>
                {children}
            </PayPalScriptProvider>
  )
}

export default PaypalProvider