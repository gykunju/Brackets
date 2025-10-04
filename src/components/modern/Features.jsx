import { motion } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  TrendingUp,
  Users,
  Target,
  Zap,
  Award,
  Brain,
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

/**
 * Modern Features Section with Feature Cards
 */
export default function Features() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Learning',
      description:
        'Get personalized recommendations and intelligent assistance tailored to your learning style and goals.',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: BookOpen,
      title: 'Curated Courses',
      description:
        'Access expertly designed learning paths covering everything from basics to advanced concepts.',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description:
        'Monitor your growth with detailed analytics, achievements, and visual progress indicators.',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      icon: Users,
      title: 'Learning Circles',
      description:
        'Join communities of learners, share knowledge, and collaborate on projects together.',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      icon: Target,
      title: 'Goal Setting',
      description:
        'Set and track learning objectives with AI-powered insights to keep you motivated.',
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      icon: Zap,
      title: 'Quick Learning',
      description:
        'Bite-sized lessons and smart snippets delivered at optimal intervals for maximum retention.',
      gradient: 'from-yellow-500 to-orange-600',
    },
    {
      icon: Award,
      title: 'Certifications',
      description:
        'Earn recognized certificates and badges as you complete courses and achieve milestones.',
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      icon: Brain,
      title: 'Adaptive Learning',
      description:
        'Content difficulty adjusts based on your performance, ensuring optimal challenge levels.',
      gradient: 'from-teal-500 to-green-600',
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              excel
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Brackets combines cutting-edge AI technology with proven learning
            methodologies to accelerate your educational journey.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Individual Feature Card Component
 */
function FeatureCard({ feature, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        variant="default"
        hover={true}
        className="h-full group cursor-pointer"
      >
        <CardContent className="p-6">
          {/* Icon */}
          <div className="relative mb-4">
            <div
              className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:shadow-xl transition-shadow`}
            >
              <feature.icon className="h-7 w-7 text-white" />
            </div>
            {/* Glow Effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity -z-10`}
            />
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            {feature.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
