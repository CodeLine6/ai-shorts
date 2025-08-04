"use client";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, XCircle, CreditCard } from "lucide-react";

export default function AdminUsersPage() {
  const usersData = useQuery(api.user.GetAllUsers);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

  if (!usersData) {
    return <div className="flex items-center justify-center min-h-screen">Loading users...</div>;
  }

  if (!usersData.success) {
    return <div className="flex items-center justify-center min-h-screen">Error loading users: {usersData.message}</div>;
  }

  const users = usersData.data || [];

  // Sorting function
  const sortedUsers = [...users];
  if (sortConfig !== null) {
    sortedUsers.sort((a, b) => {
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
  const totalUsers = users.length;
  const verifiedUsers = users.filter(user => user.isVerified).length;
  const adminUsers = users.filter(user => user.isAdmin).length;
  const usersWithPurchases = users.filter(user => user.hasEverPurchased).length;
  const totalCredits = users.reduce((sum, user) => sum + user.credits, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-muted-foreground">Overview and management of all users</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users with Purchases</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersWithPurchases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCredits}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => requestSort('username')}>
                  Username {sortConfig?.key === 'username' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('email')}>
                  Email {sortConfig?.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('firstName')}>
                  Name {sortConfig?.key === 'firstName' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('isVerified')}>
                  Status {sortConfig?.key === 'isVerified' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('credits')}>
                  Credits {sortConfig?.key === 'credits' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('totalReferrals')}>
                  Referrals {sortConfig?.key === 'totalReferrals' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('hasEverPurchased')}>
                  Purchased {sortConfig?.key === 'hasEverPurchased' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>
                    <Badge variant={user.isVerified ? "default" : "destructive"}>
                      {user.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.credits}</TableCell>
                  <TableCell>{user.totalReferrals}</TableCell>
                  <TableCell>
                    {user.hasEverPurchased ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
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
