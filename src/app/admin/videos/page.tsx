"use client";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Video, Play, CheckCircle, XCircle } from "lucide-react";
export default function AdminVideosPage() {
  const videosData = useQuery(api.videoData.GetAllVideos);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  if (!videosData) {
    return <div className="flex items-center justify-center min-h-screen">Loading videos...</div>;
  }
  if (!videosData.success) {
    return <div className="flex items-center justify-center min-h-screen">Error loading videos: {videosData.message}</div>;
  }
  const videos = videosData.data || [];
  // Sorting function
  const sortedVideos = [...videos];
  if (sortConfig !== null) {
    sortedVideos.sort((a, b) => {
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
  const totalVideos = videos.length;
  const completedVideos = videos.filter(video => video.status === 'Completed').length;
  const inProgressVideos = videos.filter(video => video.status !== 'Completed' && video.status !== 'Failed').length;
  const failedVideos = videos.filter(video => video.status === 'Failed').length;
  const videoStyles = Array.from(new Set(videos.map(video => video.videoStyle)));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Videos Management</h1>
        <p className="text-muted-foreground">Overview and management of all videos</p>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVideos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Videos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedVideos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress Videos</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressVideos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Videos</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedVideos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Video Styles</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{videoStyles.length}</div>
          </CardContent>
        </Card>
      </div>
      {/* Videos Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => requestSort('title')}>
                  Title {sortConfig?.key === 'title' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('createdBy')}>
                  Creator {sortConfig?.key === 'createdBy' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('videoStyle')}>
                  Style {sortConfig?.key === 'videoStyle' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('status')}>
                  Status {sortConfig?.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedVideos.map((video) => (
                <TableRow key={video._id}>
                  <TableCell className="font-medium max-w-xs truncate">{video.title}</TableCell>
                  <TableCell>{video.createdBy}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{video.videoStyle}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        video.status === 'Completed'
                          ? 'default'
                          : video.status === 'Failed'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {video.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {video.status === 'Completed' && video.downloadUrl ? (
                      <a href={video.downloadUrl} target="_blank" rel="noopener noreferrer">
                        <Play className="h-4 w-4 text-green-500 cursor-pointer" />
                      </a>
                    ) : video.status === 'Failed' ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Play className="h-4 w-4 text-gray-400" />
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
