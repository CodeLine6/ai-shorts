import { useEffect, useRef, useState } from "react";

export const defaultOptions = {
    rootMargin: "0px",
    scrollMargin: "0px",
    threshold: 1.0,
}

export const useInfinite = (loadData, deps = [], options = defaultOptions) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const nextCursor = useRef(null);
    const targetRef = useRef(null);
    const rootRef = useRef(null);
    const hasMore = useRef(true);

    const handleIntersection = async (entries) => {
        if (entries[0].isIntersecting && hasMore.current && !loading) {
            setLoading(true);
            const { page, cursor, done } = await loadData(nextCursor.current);
            setData((prevData) => [...prevData, ...page]);
            nextCursor.current = cursor;
            hasMore.current = !done;
            setLoading(false);
        }
    }

    useEffect(() => {
        const populateData = async () => {
            if (deps.some(dep => dep === undefined || dep === null)) {
                setData([]);
                setLoading(false);
                hasMore.current = true;
                nextCursor.current = null;
                return;
            }
            setLoading(true);
            hasMore.current = true; // Reset hasMore
            const { page, cursor, done } = await loadData(null);
            setData(page);
            nextCursor.current = cursor;
            hasMore.current = !done;
            setLoading(false);
        }

        populateData();
    }, deps);

    useEffect(() => {
        const observerOptions = {
            ...options,
            root: rootRef.current
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions)

        if (targetRef.current) {

            observer.observe(targetRef.current);
        }

        return () => {
            observer.disconnect();
        }

    }, [targetRef.current, rootRef.current,options, handleIntersection]);

    return {data,loading,targetRef, rootRef};
}
