"use client"
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useMutation } from 'convex/react';
import { CircleDollarSign } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react'
import { api } from '@/../../convex/_generated/api';
import { useToast } from '@/hooks/use-toast';

export const creditPlans = [
    {
        credits: 10,
        price: 2
    },
    {
        credits: 50,
        price: 5
    },
    {
        credits: 100,
        price: 10
    },
    {
        credits: 220,
        price: 20
    },
    {
        credits: 500,
        price: 30
    }
]

const page = () => {
  const { data: session, update } = useSession();
  const user = session?.user;
  const { toast } = useToast();
  const processPurchase = useMutation(api.purchases.ProcessPurchase);

  const onPaymentSuccess = async (cost: number, credits: number, transactionId: string) => {
    try {
      // Use the robust purchase system
      const result = await processPurchase({
        userId: user?._id as any,
        amount: cost,
        credits: credits,
        paymentMethod: "PayPal",
        transactionId: transactionId,
      });

      if (result.success) {

        // Show success message
        let message = `Successfully purchased ${credits} credits!`;
        if ((result as any).referralReward?.success) {
          message += ` Your referrer earned ${(result as any).referralReward.creditsAwarded} bonus credits.`;
        }
        
        toast({
          title: "Purchase Successful!",
          description: message,
        });
      } else {
        throw new Error(result.message || "Purchase failed");
      }
    } catch (error) {
      console.error("Error processing purchase:", error);
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
        <h2 className='font-bold text-3xl'>Credits</h2>
        <div className='p-4 border rounded-xl flex justify-between mt-7 max-w-2xl'>
            <div>
                <h2 className='font-bold text-xl'>Total Credits Left</h2>
                <h2 className='text-sm'>1 Credits = 1 Video</h2>
            </div>
            <h2 className='font-bold text-3xl'>{user?.credits} Credits</h2>
        </div>
        <p className="text-sm p-5 text-gray-500 max-w-2xl">When your credit balance reaches 0, you will not be able to create more videos.</p>
        <div className='mt-5'>
            <h2 className='font-bold text-2xl'>Buy More Credits</h2>
            <div>
                {creditPlans.map((item, index) => (
                    <div className="p-5 mt-3 border rounded-xl max-w-2xl flex justify-between items-center" key={index}>
                        <h2 className=" text-xl flex gap-2 items-center">
                             <CircleDollarSign/>
                            <strong>{item.credits}</strong> Credits
                        </h2>
                        <div className="flex gap-2 items-center">
                            <h2 className="font-medium text-xl">${item.price}</h2>
                            <PayPalButtons style={{ layout: "horizontal" }} 
                                createOrder={(data, actions) => {
                                    /* @ts-ignore */
                                    return actions?.order?.create({
                                        purchase_units : [
                                            {
                                                amount : {
                                                    currency_code : "USD",
                                                    value : `${item.price}`,
                                                }
                                            }
                                        ]
                                    });
                                }}
                                onApprove={(data, actions) => {
                                    // Get transaction ID from PayPal
                                    const transactionId = data.orderID || `paypal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                                    return onPaymentSuccess(item.price, item.credits, transactionId);
                                }}
                            />               
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default page
