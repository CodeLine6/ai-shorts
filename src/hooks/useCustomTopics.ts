import { useCallback, useEffect, useState } from "react";

export const useCustomTopics = () => {
  const [customTopics, setCustomTopics] = useState<string[]>([]);

  const loadCustomTopics = useCallback(() => {
    const stored = localStorage.getItem('customTopics');
    const topics = stored ? JSON.parse(stored) : [];
    setCustomTopics(topics);
    return topics;
  }, []);

  useEffect(() => {
    loadCustomTopics();
    
    const handleStorageChange = () => {
      loadCustomTopics();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadCustomTopics]);

  const addCustomTopic = (newTopic: string) => {
    const updated = [...customTopics, newTopic];
    localStorage.setItem('customTopics', JSON.stringify(updated));
    setCustomTopics(updated);
  };

  const deleteCustomTopic = (topicToDelete: string) => {
    const updated = customTopics.filter(topic => topic !== topicToDelete);
    localStorage.setItem('customTopics', JSON.stringify(updated));
    setCustomTopics(updated);
  };

  return { customTopics, addCustomTopic, deleteCustomTopic };
};