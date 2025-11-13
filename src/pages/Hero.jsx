import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { BsStars, BsArrowRight } from "react-icons/bs";
import { LuNotebookText, LuCalendar, LuBrain } from "react-icons/lu";
import { FiUpload } from "react-icons/fi";

function Hero() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <LuNotebookText size={24} />,
      title: "Smart Organization",
      description: "Structure your studies with brackets, units, and content in one place"
    },
    {
      icon: <FiUpload size={24} />,
      title: "Upload & Analyze",
      description: "Upload PDFs, Word docs, PowerPoints - AI reads and understands everything"
    },
    {
      icon: <BsStars size={24} />,
      title: "AI Assistant",
      description: "Ask questions about your materials, get summaries, explanations, and study tips"
    },
    {
      icon: <LuCalendar size={24} />,
      title: "Track Deadlines",
      description: "Never miss an exam or assignment with smart event tracking"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-stone-50 geist-font overflow-hidden">
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
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 40, 0],
            y: [0, -40, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/4 w-72 h-72 bg-stone-200 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex items-center justify-between px-6 lg:px-20 py-6"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <div className="p-2 rounded-xl bg-gradient-to-br from-lime-800 to-lime-900 shadow-lg">
            <LuBrain size={28} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">Brackets</span>
        </motion.div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/signin")}
            className="px-5 py-2.5 rounded-xl text-gray-700 hover:text-lime-800 transition-colors geist-font wght-600"
          >
            Sign In
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/signup")}
            className="px-6 py-2.5 rounded-xl bg-lime-800 text-white hover:bg-lime-700 transition-all shadow-lg geist-font wght-600"
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 pt-10 lg:pt-10 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-100 border border-lime-200 mb-6"
            >
              <BsStars className="text-lime-800" />
              <span className="text-sm text-lime-900 geist-font wght-600">
                AI-Powered Study Companion
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6"
            >
              Study Smarter,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-700 to-lime-900">
                Not Harder
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Organize your study materials, upload documents, and chat with an AI that actually understands your content. Transform how you learn.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signup")}
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-lime-800 text-white hover:bg-lime-700 transition-all shadow-xl geist-font wght-600 text-lg"
              >
                Start Learning Free
                <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signin")}
                className="px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 hover:border-lime-600 hover:text-lime-800 transition-all geist-font wght-600 text-lg"
              >
                Sign In
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 flex items-center gap-6 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-lime-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-lime-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free forever</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Floating Card Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative bg-white rounded-3xl shadow-2xl p-8 border border-stone-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-lime-50 to-stone-100 border border-lime-200">
                    <BsStars size={20} className="text-lime-800" />
                  </div>
                  <span className="text-sm text-gray-600 geist-font wght-600">AI Assistant</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-lime-800 to-lime-900 flex items-center justify-center text-white text-sm">
                      U
                    </div>
                    <div className="flex-1 bg-lime-800 text-white rounded-2xl rounded-tl-none p-4">
                      <p className="text-sm">What are the key concepts in my Biology notes?</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 rounded-full bg-gradient-to-br from-lime-50 to-stone-100 border border-lime-200">
                      <BsStars size={16} className="text-lime-800" />
                    </div>
                    <div className="flex-1 bg-white border border-stone-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                      <p className="text-sm text-gray-800 mb-3">Based on your uploaded Biology PDF, here are the key concepts:</p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-lime-700 mt-0.5">•</span>
                          <span>Cell structure and function</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-lime-700 mt-0.5">•</span>
                          <span>DNA replication process</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-lime-700 mt-0.5">•</span>
                          <span>Photosynthesis mechanism</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-stone-200"
              >
                <FiUpload size={24} className="text-lime-800" />
              </motion.div>

              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-stone-200"
              >
                <LuCalendar size={24} className="text-lime-800" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to excel
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed for modern students
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:border-lime-200 transition-all cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-lime-50 to-stone-100 border border-lime-200 inline-flex mb-4">
                  <div className="text-lime-800">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-32 text-center"
        >
          <div className="bg-gradient-to-br from-lime-800 to-lime-900 rounded-3xl p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to transform your studies?
              </h2>
              <p className="text-xl text-lime-100 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already studying smarter with AI
              </p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signup")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-lime-900 hover:bg-lime-50 transition-all shadow-xl geist-font wght-600 text-lg"
              >
                Get Started for Free
                <BsArrowRight />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="relative z-10 text-center py-8 text-gray-600 text-sm"
      >
        <p>© 2025 Brackets. Built with AI for students who care about their future.</p>
      </motion.footer>
    </div>
  );
}

export default Hero;
