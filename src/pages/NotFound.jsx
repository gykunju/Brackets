import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { motion } from 'framer-motion'
import { BsArrowLeft, BsQuestionCircle } from 'react-icons/bs'
import { LuBrain } from 'react-icons/lu'

function NotFound() {
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params['*'] == 'signup' || params['*'] == 'signin') {
            navigate('/', { replace: true })
        }
    }, [params, navigate])

    return (
        <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-stone-50 geist-font flex items-center justify-center px-6 overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-40 -right-40 w-96 h-96 bg-lime-200 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, -30, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-lime-300 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl mx-auto text-center">
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-8"
                >
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-lime-800 to-lime-900 shadow-2xl">
                        <LuBrain size={48} className="text-white" />
                    </div>
                </motion.div>

                {/* 404 Icon */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-8"
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-flex items-center justify-center p-6 rounded-full bg-lime-100 border-4 border-lime-200"
                    >
                        <BsQuestionCircle size={80} className="text-lime-800" />
                    </motion.div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-700 to-lime-900 mb-4"
                >
                    404
                </motion.h1>

                {/* Subtitle */}
                <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
                >
                    Page Not Found
                </motion.h2>

                {/* Description */}
                <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-lg text-gray-600 mb-8 max-w-md mx-auto"
                >
                    Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(0,0,0,0.15)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)}
                        className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white border-2 border-gray-300 text-gray-700 hover:border-lime-600 hover:text-lime-800 transition-all shadow-lg geist-font wght-600 text-lg"
                    >
                        <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(0,0,0,0.15)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        className="px-8 py-4 rounded-xl bg-lime-800 text-white hover:bg-lime-700 transition-all shadow-xl geist-font wght-600 text-lg"
                    >
                        Go Home
                    </motion.button>
                </motion.div>

                {/* Helpful Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-12 flex flex-wrap gap-6 justify-center text-sm text-gray-600"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, color: "#65a30d" }}
                        onClick={() => navigate('/brackets')}
                        className="hover:text-lime-700 transition-colors"
                    >
                        Browse Brackets
                    </motion.button>
                    <span className="text-gray-400">•</span>
                    <motion.button
                        whileHover={{ scale: 1.05, color: "#65a30d" }}
                        onClick={() => navigate('/ai-assistant')}
                        className="hover:text-lime-700 transition-colors"
                    >
                        AI Assistant
                    </motion.button>
                    <span className="text-gray-400">•</span>
                    <motion.button
                        whileHover={{ scale: 1.05, color: "#65a30d" }}
                        onClick={() => navigate('/events')}
                        className="hover:text-lime-700 transition-colors"
                    >
                        My Events
                    </motion.button>
                </motion.div>
            </div>
        </div>
    )
}

export default NotFound