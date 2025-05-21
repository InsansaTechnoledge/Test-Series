import { useQuery } from '@tanstack/react-query';
import { fetchUserList } from '../utils/services/userService';


export const useCachedUser = () => {

           const fetchUserListFunction = async () => {
        try{
           const response = await fetchUserList();
           if (response.status !== 200) {
               throw new Error('Network response was not ok');
           }
           console.log(response.data);
           return response.data;
        }catch(err){
            console.log(err);
            // setbatchError(
        }
       }

    const { data: users = [], isLoading, isError } = useQuery({
           queryKey: ['Users'],
           queryFn: () => fetchUserListFunction(),
           refetchOnWindowFocus: false,
           refetchOnMount: false,
           staleTime: Infinity,
           cacheTime: 24 * 60 * 60 * 1000,
           retry: 0,
       });


       return{
        users,
        isLoading,
        isError
       }

};


