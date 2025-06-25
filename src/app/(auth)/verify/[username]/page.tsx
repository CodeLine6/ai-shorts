"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import axios, {AxiosError} from 'axios'
import * as z from "zod"

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()

    type OTPFormValues = z.infer<typeof verifySchema>

    const form = useForm<OTPFormValues>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ""
        }
    })

    const onSubmit = async (data: OTPFormValues) => {
        try {
            const response = await axios.post("/api/verify-code", {
                username: params.username,
                code: data.code
            })

            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace(`/sign-in`)
        }
        catch (error) {
            const err = error as AxiosError
            let errorMessage = err?.response?.statusText
            if (errorMessage) {
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive"
                })
            }
        }
    }
    return <Card className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md">
        <CardHeader>

            <CardTitle className="text-4xl font-extrabold tracking-tight">
                Verify Message
            </CardTitle>
            <CardDescription className="mb-4">Enter verification code sent to your email</CardDescription>

        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        name="code"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>One-Time Password</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormDescription>
                                    Please enter the one-time password sent to your phone.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className="w-full" >Submit</Button>
                </form>
            </Form>
        </CardContent>
    </Card>
}

export default VerifyAccount