import heroBanner from '../../../../../assests/StudentLanding/heroBannerWhite.svg';
import  herobannerdark from '../../../../../assests/StudentLanding/heroBanner.svg';

import { Building, Mail, Phone, User } from 'lucide-react';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import { useUser } from '../../../../../contexts/currentUserContext';
import { useCachedOrganization } from '../../../../../hooks/useCachedOrganization';
import { useTheme } from '../../../../../hooks/useTheme';

const StudentHero = () => {
    const { user } = useUser();
    const { batches, isloading, isError, batchMap } = useCachedBatches();
    const { organization } = useCachedOrganization({ userId: user._id, orgId: (user.organizationId._id || user.organizationId) });
    const { theme } = useTheme()

    return (



        <div className={` max-w-6xl rounded-3xl overflow-hidden mt-6 shadow-xl backdrop-blur-md transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 `}>
            {/* Organization Info Section */}
            <div className='relative overflow-hidden'>
                <img
                    src={`${theme == 'light' ? heroBanner : herobannerdark}`}
                    alt='heroBanner'
                    className='absolute  w-full h-full object-cover -z-10'
                />
                <div className='relative backdrop-blur-sm'>
                    {/* Banner Content */}
                    <div className='px-6 md:px-8 py-8 md:py-10'>
                        <h1 className={`text-center text-2xl md:text-3xl font-bold mb-6 ${theme === 'light' ? 'text-white' : 'text-white'
                            }`}>
                            {batchMap[user?.batchId]?.name}
                        </h1>

                        {/* Building Icon */}
                        <div className='flex justify-center mb-6'>
                            <div className={`p-4 rounded-2xl backdrop-blur-md transition-all duration-300 ${theme === 'light'
                                    ? 'bg-white/20 border border-gray-700'
                                    : 'bg-gray-800/30 border border-gray-600/30'
                                }`}>
                                <Building className='w-12 h-12 md:w-16 md:h-16 text-gray-600' />
                            </div>
                        </div>

                        {/* Address */}
                        <div className={`hidden md:block text-center text-sm leading-relaxed mb-8 px-4 ${theme === 'light' ? 'text-gray-700' : 'text-white/90'
                            }`}>
                            <div className={`inline-block px-4 py-2 rounded-xl backdrop-blur-md ${theme === 'light'
                                    ? 'bg-white/10 border border-gray-700'
                                    : 'bg-gray-800/20 border border-gray-600/20'
                                }`}>
                                {organization?.address?.line1}, {organization?.address?.line2}, {organization?.address?.city}, {organization?.address?.state}, {organization?.address?.country} - {organization?.address?.pincode}
                            </div>
                        </div>

                        {/* Connect Section */}
                        <div className='text-center'>
                            <div className={`text-lg font-medium mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-white'
                                }`}>
                                Connect with us on:
                            </div>
                            <div className='flex justify-center space-x-6'>
                                <div className={`p-3 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer ${theme === 'light'
                                        ? 'bg-white/20 border  border-gray-700 hover:bg-white/30'
                                        : 'bg-gray-800/30 border border-gray-600/30 hover:bg-gray-700/40'
                                    }`}>
                                    <Mail className='w-6 h-6 text-gray-600' />
                                </div>
                                <div className={`p-3 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer ${theme === 'light'
                                        ? 'bg-white/20 border border-gray-700 hover:bg-white/30'
                                        : 'bg-gray-800/30 border border-gray-600/30 hover:bg-gray-700/40'
                                    }`}>
                                    <Phone className='w-6 h-6 text-gray-600' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default StudentHero;
