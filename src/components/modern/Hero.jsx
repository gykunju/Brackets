import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, TrendingUp, Users } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Modern Hero Section with Animations
 */
export default function Hero() {
  const stats = [
    { icon: BookOpen, label: 'Courses', value: '100+' },
    { icon: Users, label: 'Students', value: '10K+' },
    { icon: TrendingUp, label: 'Success Rate', value: '95%' },
    { icon: Sparkles, label: 'AI Powered', value: '100%' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-green-50/30 to-white dark:from-gray-900 dark:via-green-950/20 dark:to-gray-900 py-20 md:py-32">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/30 dark:bg-green-800/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-emerald-200/30 dark:bg-emerald-800/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Learning Platform</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              Learn Smarter, Not Harder with{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Brackets
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Master new skills with personalized learning paths, AI-powered
              assistance, and real-time progress tracking. Your journey to
              excellence starts here.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/signup">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                  className="w-full sm:w-auto"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/brackets">
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<BookOpen className="h-5 w-5" />}
                  className="w-full sm:w-auto"
                >
                  Explore Courses
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-600 dark:text-gray-400"
            >
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 border-2 border-white dark:border-gray-900"
                    />
                  ))}
                </div>
                <span className="ml-3">10,000+ students</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">★★★★★</span>
                <span>4.9/5 rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Illustration/Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                      <stat.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl opacity-20 blur-xl"
            />
            <motion.div
              animate={{
                y: [0, 20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl opacity-20 blur-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
