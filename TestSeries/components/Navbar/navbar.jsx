import React, { useState } from 'react';
import { ArrowRight, User, GraduationCap, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const click = async () => {
    console.log("clicked");
    try {
      //api for the login
      //   const response=await axios.post("http://localhost:8000/api/v1/auth/org-login",{email:"contact@techbridge.edu",password:"StrongP@ssw0rd!"},{withCredentials:true});
      //   console.log(response);
      // }
      // const email="john.doe@exam1.com";
      // const password="StrongP@ssw0rd!";
      //  const response=await axios.post("http://localhost:8000/api/v1/auth/user-login",{email:email,password:password},{withCredentials:true});
      //   console.log(response);
      // }

      //api for the logout
      // const response=await axios.post("http://localhost:8000/api/v1/auth/logout",{},{withCredentials:true});
      // console.log(response);
      // }

      //api for the create batch
      //               const response=await axios.post("http://localhost:8000/api/v1/batch/create-batch",

      //                   [
      //   {
      //     "organization_id": "6821e053e690d7f93a1ed71b",
      //     "name": "Batch Alpha",
      //     "year": 2022
      //   },
      //   {
      //     "organization_id": "6821e053e690d7f93a1ed71b",
      //     "name": "Batch Beta",
      //     "year": 2023
      //   },
      //   {
      //     "organization_id": "6821e9b92c284c9c33c983bc",
      //     "name": "Batch Gamma",
      //     "year": 2024
      //   },
      //   {
      //     "organization_id": "6821e9b92c284c9c33c983bc",
      //     "name": "Batch Delta",
      //     "year": 2021
      //   },
      //   {
      //     "organization_id": "6821e9b92c284c9c33c983bc",
      //     "name": "Batch Epsilon",
      //     "year": 2025
      //   }
      // ]
      //     ,{withCredentials:true});
      //               console.log(response);  
      //     }

      //api for the update batch
      // const response=await axios.get(`http://localhost:8000/api/v1/batch/get-batch?organization_id=6821e053e690d7f93a1ed71b`,{withCredentials:true});
      //               console.log(response);  }

      //api for the get batch
    //   const ids = [
    //     '54b49cae-e6ea-4e38-9f88-1694a9569859',
    //     'd35a5b71-7623-422d-a0a1-40448d7d74fb'
    //   ];

    //   const query = ids.map(id => `id=${encodeURIComponent(id)}`).join('&');

    //   const response = await axios.get(
    //     `http://localhost:8000/api/v1/batch/get-batch?${query}`,
    //     { withCredentials: true }
    //   );
    //   console.log(response);
    // }

    //api for get batch by year
    // const year = 2023; 
    // const response = await axios.get(
    //   `http://localhost:8000/api/v1/batch/get-batch?year=${year}`,
    //   { withCredentials: true }
    // );
    // console.log(response);
    // }
    //api for the delete batch
    // const response = await axios.delete(
    //   `http://localhost:8000/api/v1/batch/delete-batch/d35a5b71-7623-422d-a0a1-40448d7d74fb`,
    //   { withCredentials: true }
    // );
    // console.log(response);
    // }

    //api for the update batch
    const response = await axios.patch(
      `http://localhost:8000/api/v1/batch/update-batch/54b49cae-e6ea-4e38-9f88-1694a9569859`,  
      {
        name: "Updated Batch Name",  
        year: 2024
      },
      { withCredentials: true }
    );
        console.log(response);
    }


    catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="top-0 fixed w-full z-50 bg-blue-950 text-white px-6 py-4 shadow-lg">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">

          <div className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-violet-200 bg-clip-text text-transparent">
            myApp
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-8 font-medium">
          <li><a href="/features" className="hover:text-blue-200 transition-colors duration-200">Features</a></li>
          <li><a href="/pricing" className="hover:text-blue-200 transition-colors duration-200">Pricing</a></li>
          <li><a href="/contact" className="hover:text-blue-200 transition-colors duration-200">Contact</a></li>
        </ul>

        {/* Login Options */}
        <div className="flex items-center space-x-4">
           <button  className="flex items-center space-x-2 bg-blue-800 bg-opacity-50 hover:bg-opacity-70 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200" 
            onClick={()=>click()} >
              1 Btn 10 APIs
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          <div className="relative">
            <button
              className="flex items-center space-x-2 bg-blue-800 bg-opacity-50 hover:bg-opacity-70 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              
            >
              <span>Login</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button >
           

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                <button 
                  className="flex items-center space-x-2 px-4 py-3 text-gray-800 hover:bg-blue-50 transition-colors duration-200"
                  onClick={()=>navigate('/login?role=Institute')}
                >
                  <User className="h-5 w-5 text-blue-700" />
                  <span>Educator Login</span>
                </button>
                <div className="border-b border-gray-200"></div>
                <button 
                  onClick={()=>navigate('/login?role=Student')}
                  className="flex items-center space-x-2 px-4 py-3 text-gray-800 hover:bg-blue-50 transition-colors duration-200"
                >
                  <GraduationCap className="h-5 w-5 text-violet-700" />
                  <span>Student Login</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/institute-registration')} 
            className="group bg-blue-600 flex items-center space-x-2 text-white font-semibold px-6 py-2 rounded-lg border border-blue-400 shadow-md transition-all duration-300"
          >
            <span>Sign Up</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-200 h-5 w-5" />
        </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;