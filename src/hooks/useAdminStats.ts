import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';

export const useAdminStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const adminStats = useQuery(api.admin.getAdminStats);
  const userGrowthData = useQuery(api.admin.getUserGrowthData);
  const videoStyleData = useQuery(api.admin.getVideoStyleDistribution);
  const revenueData = useQuery(api.admin.getRevenueOverTime);
  const topReferrers = useQuery(api.admin.getTopReferrers, { });

  useEffect(() => {
    if (adminStats) {
      if (adminStats.success) {
        setStats({
          ...adminStats.stats,
          userGrowth: userGrowthData?.success ? userGrowthData.data : [],
          videoStyles: videoStyleData?.success ? videoStyleData.data : [],
          revenueOverTime: revenueData?.success ? revenueData.data : [],
          topReferrers: topReferrers?.success ? topReferrers.data : [],
        });
        setLoading(false);
      } else {
        setError(adminStats.message);
        setLoading(false);
      }
    }
  }, [adminStats, userGrowthData, videoStyleData, revenueData, topReferrers]);

  return { stats, loading, error };
};
