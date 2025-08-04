"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { signUpSchema } from "@/schemas/userSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, {AxiosError} from "axios" 
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDebounceCallback } from "usehooks-ts"
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"
import * as z from "zod"
import dynamic from "next/dynamic"

const SignUpComponent = () => {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    
    const [referralCode, setReferralCode] = useState("")
    const [referralMessage, setReferralMessage] = useState("")
    const [isCheckingReferral, setIsCheckingReferral] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername, 500)
    const debouncedReferral = useDebounceCallback(setReferralCode, 500)
    const { toast } = useToast()
    const router = useRouter()
    const searchParams = useSearchParams()

    type SignupFormValues = z.infer<typeof signUpSchema>

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            contactNumber: "",
            firstName: "",
            lastName: "",
            referralCode: ""
        }
    })

    // Check for referral code in URL on component mount
    useEffect(() => {
        const refParam = searchParams?.get('ref')
        if (refParam) {
            const upperCaseRef = refParam.toUpperCase()
            form.setValue('referralCode', upperCaseRef)
            setReferralCode(upperCaseRef)
            debouncedReferral(upperCaseRef)
        }
    }, [searchParams, form, debouncedReferral])

    useEffect(() => {
        const checkUsrnameAvailability = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage("")
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)
                    setUsernameMessage(response.data.message)
                }
                catch (err) {
                    const axiosError = err as AxiosError
                    setUsernameMessage(axiosError.response?.statusText ?? 'Error checking username')
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }

        checkUsrnameAvailability()
    }, [username])

    useEffect(() => {
        const checkReferralCode = async () => {
            if (referralCode && referralCode.length >= 4) {
                setIsCheckingReferral(true)
                setReferralMessage("")
                try {
                    const response = await axios.post("/api/check-referral-code", {
                        referralCode: referralCode.trim().toUpperCase()
                    })
                    if (response.data.success) {
                        setReferralMessage(`✓ Valid referral from ${response.data.referrerName}`)
                    }
                }
                catch (err) {
                    const axiosError = err as AxiosError<{message: string}>
                    setReferralMessage(axiosError.response?.data?.message ?? 'Invalid referral code')
                } finally {
                    setIsCheckingReferral(false)
                }
            } else if (referralCode === "") {
                setReferralMessage("")
            }
        }

        checkReferralCode()
    }, [referralCode])


    const onSubmit = async (data: SignupFormValues) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post("/api/sign-up", data)

            if (response.data.success) {
                toast({
                    title: "Success",
                    description: response.data.message,
                })
                router.replace(`/verify/${username}`)
            } else {
                toast({
                    title: "Error",
                    description: response.data.message,
                    variant: "destructive"
                })
            }

        } catch (error) {
            const err =  error as AxiosError
            let errorMessage = err?.response?.statusText
            if (errorMessage) {
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive"
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return <Card className="w-full max-w-md p-8 rounded-lg shadow-md">
        <CardHeader>
            <CardTitle className="text-4xl font-extrabold tracking-tight">
                Sign Up
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div id="fullname" className="grid sm:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="First Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Last Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" {...field}
                                        onChange={e => {
                                            field.onChange(e.target.value)
                                            debounced(e.target.value)
                                        }} />
                                </FormControl>
                                {isCheckingUsername && <Loader2 className="animate-spin h-4 w-4" />}
                                <p className={`text-sm ${usernameMessage === "Username is available" ? "text-green-600" : "text-red-600"}`}>
                                    {usernameMessage}
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div id="credentials" className="grid sm:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="contactNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contact Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="referralCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Referral Code (Optional)</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Enter referral code for bonus credits" 
                                        {...field}
                                        onChange={e => {
                                            const value = e.target.value.toUpperCase()
                                            field.onChange(value)
                                            debouncedReferral(value)
                                        }}
                                    />
                                </FormControl>
                                <div className="flex items-center gap-2">
                                    {isCheckingReferral && <Loader2 className="animate-spin h-4 w-4" />}
                                    {referralMessage && (
                                        <p className={`text-sm ${referralMessage.includes('✓') ? "text-green-600" : "text-red-600"}`}>
                                            {referralMessage}
                                        </p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">Get 6 credits instead of 3 with a valid referral code!</p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait</> : "Sign Up"}</Button>
                </form>
            </Form>
            <div className="text-center mr-4">
                <p>Already have an account?
                    <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 ml-2">Sign In</Link></p>
            </div>
        </CardContent>
    </Card>
}

const Page = dynamic(() => Promise.resolve(SignUpComponent), { ssr: false });

export default Page
