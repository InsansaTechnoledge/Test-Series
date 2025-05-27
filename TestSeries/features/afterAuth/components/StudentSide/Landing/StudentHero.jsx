import heroBanner from '../../../../../assests/StudentLanding/heroBanner.jpg';
import { Building, Mail, Phone, User } from 'lucide-react';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import { useUser } from '../../../../../contexts/currentUserContext';
import { useCachedOrganization } from '../../../../../hooks/useCachedOrganization';

const StudentHero = () => {
    const {user} = useUser();
    const {batches,isloading,isError,batchMap} = useCachedBatches();
    const {organization} = useCachedOrganization({userId:user._id,orgId:user.organizationId});


    return (
        <div className='relative bg-black/60 shadow-gray-600'>
            <img src={heroBanner}
                alt='heroBanner'
                className='-z-10 absolute w-full h-full'
            />
            {/* banner */}
            <div className='md:px-20 py-10'>
                <h1 className='text-center text-white text-4xl font-bold'>
                    {batchMap[user?.batchId]?.name}
                <Building className='mx-auto mt-6 w-20 h-20'/>    
                </h1>
                <div className='hidden md:block text-white max-w-2/5 text-wrap my-5 mx-auto text-center'>
                    {organization?.address?.line1}, {organization?.address?.line2}, {organization?.address?.city}, {organization?.address?.state}, {organization?.address?.country} - {organization?.address?.pincode}
                </div>
                <div className='mt-16 mx-auto w-fit flex flex-col justify-center'>
                    <div className='text-white text-xl'>Connect with us on:</div>
                    <div className='w-fit flex justify-center space-x-8 mx-auto mt-5'>
                        <Mail className='text-white' />
                        <Phone className='text-white' />
                    </div>
                </div>
            </div>
            
        </div>
    )
}


export default StudentHero;
