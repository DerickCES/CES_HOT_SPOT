import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ces } from '../../assets/images';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LoginGIS = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const correctPassword = "HardcodedPassword123";


    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === correctPassword) {
            navigate('/GISMainHeat');
        } else {
            toast.error('Incorrect password. Please try again.');
        }
    };

    return (
        <div id='login' className="min-h-screen relative flex justify-center items-center">
            <motion.video
                autoPlay
                loop
                muted
                className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
            >
                <source src="/Videos/Fibervid.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </motion.video>

            <motion.div
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-10 relative"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="flex justify-center mb-6">
                    <img className="p-2 mx-auto drop-shadow-xl" src={ces} alt="Logo" width={120} />
                </div>
                <h2 className="text-3xl font-bold mb-6 text-center">Log In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm pr-10"
                                required
                            />
                            <div
                                onMouseDown={() => setShowPassword(true)}
                                onMouseUp={() => setShowPassword(false)}
                                onMouseLeave={() => setShowPassword(false)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 border border-transparent bg-blue-900 rounded-md shadow-sm text-white hover:bg-blue-500">
                        Sign in
                    </button>
                </form>
            </motion.div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} />
        </div>
    );
};

export default LoginGIS;
