"use client"
import { Button } from '@/components/ui/button';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useMutation } from 'convex/react';
import { CircleDollarSign } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react'
import { api } from '../../../../../convex/_generated/api';

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
  const user = session?.user

  const onPaymentSuccess = async (cost: number,credits: number) => {
    const updateUserCredits = useMutation(api.user.updateUserCredits);
    const result = await updateUserCredits({
        credits: user?.credits + credits,
        uid: user?._id
    })

    update({
        user: {
            ...user,
            credits: user?.credits + credits
        }
    })
  }

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
        <p className="text-sm p-5 text-gray-500 max-w-2xl " >When your credit balance reaches 0, you will not be able to create more videos.</p>
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
                            <PayPalButtons  style={{ layout: "horizontal" }} 
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
                                
                                onApprove={() => onPaymentSuccess(item.price, item.credits)}
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