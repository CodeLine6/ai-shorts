import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';

export const useAdminData = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const usersData = useQuery(api.user.GetAllUsers);
  const videosData = useQuery(api.videoData.GetAllVideos);
  const purchasesData = useQuery(api.purchases.GetAllPurchases);

  useEffect(() => {
    if (usersData || videosData || purchasesData) {
      if (usersData?.success) {
        setUsers(usersData.data || []);
      }
      if (videosData?.success) {
        setVideos(videosData.data || []);
      }
      if (purchasesData?.success) {
        setPurchases(purchasesData.data || []);
      }
      setLoading(false);
    }
  }, [usersData, videosData, purchasesData]);

  return { users, videos, purchases, loading, error };
};
