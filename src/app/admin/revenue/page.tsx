"use client";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
export default function AdminRevenuePage() {
  const purchasesData = useQuery(api.purchases.GetAllPurchases);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  if (!purchasesData) {
    return <div className="flex items-center justify-center min-h-screen">Loading revenue data...</div>;
  }
  if (!purchasesData.success) {
    return <div className="flex items-center justify-center min-h-screen">Error loading revenue data: {purchasesData.message}</div>;
  }
  const purchases = purchasesData.data || [];
  // Sorting function
  const sortedPurchases = [...purchases];
  if (sortConfig !== null) {
    sortedPurchases.sort((a, b) => {
      // @ts-ignore
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      // @ts-ignore
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }
  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  // Calculate statistics
  const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  const totalPurchases = purchases.length;
  const averagePurchase = totalPurchases > 0 ? totalRevenue / totalPurchases : 0;
  const firstPurchases = purchases.filter(purchase => purchase.isFirstPurchase).length;
  // Group purchases by date for chart
  const purchasesByDate: Record<string, { date: string; amount: number; count: number }> = {};
  purchases.forEach(purchase => {
    const date = new Date(purchase.createdAt).toISOString().split('T')[0];
    if (!purchasesByDate[date]) {
      purchasesByDate[date] = { date, amount: 0, count: 0 };
    }
    purchasesByDate[date].amount += purchase.amount;
    purchasesByDate[date].count += 1;
  });
  const chartData = Object.values(purchasesByDate).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Revenue Management</h1>
        <p className="text-muted-foreground">Overview of all revenue and transactions</p>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPurchases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Purchase</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averagePurchase.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">First Purchases</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{firstPurchases}</div>
          </CardContent>
        </Card>
      </div>
      {/* Revenue Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Purchases Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => requestSort('transactionId')}>
                  Transaction ID {sortConfig?.key === 'transactionId' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('userId')}>
                  User ID {sortConfig?.key === 'userId' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('amount')}>
                  Amount {sortConfig?.key === 'amount' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('credits')}>
                  Credits {sortConfig?.key === 'credits' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('paymentMethod')}>
                  Payment Method {sortConfig?.key === 'paymentMethod' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('createdAt')}>
                  Date {sortConfig?.key === 'createdAt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('isFirstPurchase')}>
                  First Purchase {sortConfig?.key === 'isFirstPurchase' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPurchases.map((purchase) => (
                <TableRow key={purchase._id}>
                  <TableCell className="font-medium max-w-xs truncate">{purchase.transactionId}</TableCell>
                  <TableCell className="max-w-xs truncate">{purchase.userId}</TableCell>
                  <TableCell>${purchase.amount.toFixed(2)}</TableCell>
                  <TableCell>{purchase.credits}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{purchase.paymentMethod}</Badge>
                  </TableCell>
                  <TableCell>{new Date(purchase.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {purchase.isFirstPurchase ? (
                      <Badge variant="default">Yes</Badge>
                    ) : (
                      <Badge variant="destructive">No</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
