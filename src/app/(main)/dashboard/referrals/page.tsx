"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { api } from "../../../../../convex/_generated/api"
import { useQuery } from "convex/react"
import { useSession } from "next-auth/react"
import { Copy, Gift, Users, TrendingUp, Share2 } from "lucide-react"
import { useState } from "react"

const ReferralsPage = () => {
    const { data: session } = useSession()
    const { toast } = useToast()
    const [copied, setCopied] = useState(false)

    const referralStats = useQuery(
        api.referrals.GetReferralStatsSecure,
        session?.user?._id ? { userId: session.user._id as any } : "skip"
    )

    const copyReferralCode = async () => {
        if (referralStats?.referralCode) {
            await navigator.clipboard.writeText(referralStats.referralCode)
            setCopied(true)
            toast({
                title: "Copied!",
                description: "Referral code copied to clipboard",
            })
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const copyReferralLink = async () => {
        if (referralStats?.referralCode) {
            const link = `${window.location.origin}/sign-up?ref=${referralStats.referralCode}`
            await navigator.clipboard.writeText(link)
            toast({
                title: "Copied!",
                description: "Referral link copied to clipboard",
            })
        }
    }

    const shareReferralCode = async () => {
        if (navigator.share && referralStats?.referralCode) {
            try {
                await navigator.share({
                    title: 'Join AI Shorts Generator',
                    text: `Use my referral code ${referralStats.referralCode} to get bonus credits when you sign up!`,
                    url: `${window.location.origin}/sign-up?ref=${referralStats.referralCode}`
                })
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            copyReferralLink()
        }
    }

    if (!session?.user) {
        return <div>Please sign in to view referrals</div>
    }

    if (!referralStats || !referralStats.success) {
        return <div>Loading...</div>
    }

    const totalReferrals = referralStats.totalReferrals || 0
    const nextTierReferrals = ((Math.floor(totalReferrals / 5) + 1) * 5) - totalReferrals
    const progressPercent = ((totalReferrals % 5) / 5) * 100

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Referral Program</h1>
                <p className="text-muted-foreground">
                    Share your referral code and earn credits for every friend who joins!
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{referralStats.totalReferrals}</div>
                        <p className="text-xs text-muted-foreground">
                            Friends successfully referred
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Credits Earned</CardTitle>
                        <Gift className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{referralStats.referralCreditsEarned}</div>
                        <p className="text-xs text-muted-foreground">
                            From referral rewards
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{referralStats.referralTier}</div>
                        <p className="text-xs text-muted-foreground">
                            {nextTierReferrals} more for next tier bonus
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Referral Code Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        Your Referral Code
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Input
                            value={referralStats.referralCode}
                            readOnly
                            className="font-mono text-lg font-bold text-center"
                        />
                        <Button onClick={copyReferralCode} variant="outline" size="sm">
                            <Copy className="h-4 w-4 mr-2" />
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button onClick={copyReferralLink} variant="outline" className="flex-1">
                            Copy Referral Link
                        </Button>
                        <Button onClick={shareReferralCode} className="flex-1">
                            Share Code
                        </Button>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            How it works:
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• Your friends get <strong>20 credits instead of 10</strong> when they sign up</li>
                            <li>• You earn <strong>5 credits</strong> when they complete verification</li>
                            <li>• You earn <strong>10 more credits</strong> when they make their first purchase</li>
                            <li>• Get <strong>25 bonus credits</strong> for every 5 successful referrals!</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Progress to Next Tier */}
            <Card>
                <CardHeader>
                    <CardTitle>Progress to Next Tier Bonus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>{totalReferrals % 5} / 5 referrals</span>
                            <span>{nextTierReferrals} more for 25 bonus credits</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Referral History */}
            <Card>
                <CardHeader>
                    <CardTitle>Referral History</CardTitle>
                </CardHeader>
                <CardContent>
                    {referralStats.referrals && referralStats.referrals.length > 0 ? (
                        <div className="space-y-4">
                            {referralStats.referrals.map((referral, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">{referral.refereeName}</p>
                                        <p className="text-sm text-muted-foreground">@{referral.refereeUsername}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Joined {new Date(referral.signupCompletedAt || referral.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2">
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                                referral.status === 'first_purchase_complete' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {referral.status === 'first_purchase_complete' ? 'Complete' : 'Verified'}
                                            </div>
                                        </div>
                                        <p className="text-sm text-green-600 font-medium mt-1">
                                            +{referral.purchaseRewardCredited ? '15' : '5'} credits
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-medium mb-2">No referrals yet</h3>
                            <p className="text-muted-foreground">
                                Start sharing your referral code to earn credits!
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ReferralsPage
