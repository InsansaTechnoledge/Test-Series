import { useQuery } from '@tanstack/react-query';
import { fetchUserList } from '../utils/services/userService';
import { useUser } from '../contexts/currentUserContext';
import { useEffect, useMemo } from 'react';


export const useCachedUser = () => {

    
    const {user} = useUser();
    const fetchUserListFunction = async () => {
        try {
            const response = await fetchUserList();
            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }
            console.log(response.data);
            return response.data;
        } catch (err) {
            console.log(err);
            return [];
            // setbatchError(
        }
    }

    const { data: users = [], isLoading, isError } = useQuery({
        queryKey: ['Users', user._id],
        queryFn: () => fetchUserListFunction(),
         enabled: !!user?._id, 
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        cacheTime: 24 * 60 * 60 * 1000,
        retry: 0,
    });
    const userMap = useMemo(() => {
  return Object.fromEntries(users.map((user) => [user._id, user]));
}, [users]);


    return {
        users,
        isLoading,
        isError,
        userMap
    }

};


