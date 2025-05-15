import { Building, Key, KeyRound, LogIn, Mail, MapPin } from 'lucide-react'
import React, { useState } from 'react'

const StudentLoginForm = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = () => {

    }

    const handleChange = (e, field, nested = null) => {
        const value = e.target.value;

        if (nested) {
            setFormData((prev) => ({
                ...prev,
                [nested]: {
                    ...prev[nested],
                    [field]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-8 border border-blue-100">
            <form onSubmit={handleSubmit}>
                <div className="mt-2">
                    <h3 className="font-semibold text-blue-800 flex items-center text-lg pb-2 border-b border-blue-100">
                        <LogIn className="mr-2" size={20} />
                        Login Information
                    </h3>
                </div>

                <div className="grid md:grid-cols-1 gap-6 mt-5">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Student email</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                                value={formData.email}
                                onChange={(e) => handleChange(e, 'email')}
                                placeholder="Enter your registered e-mail"
                            />
                            <Mail className="absolute left-3 top-3.5 text-blue-500" size={18} />
                        </div>
                    </div>
                </div>
                <div className="grid md:grid-cols-1 gap-6 mt-5">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                                value={formData.password}
                                onChange={(e) => handleChange(e, 'password')}
                                placeholder="Enter your password"
                            />
                            <KeyRound className="absolute left-3 top-3.5 text-blue-500" size={18} />
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all disabled:opacity-70 shadow-lg flex items-center justify-center"
                >
                    Login 
                </button>
            </form>
        </div>
    )
}

export default StudentLoginForm