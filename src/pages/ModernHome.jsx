import { motion } from 'framer-motion';
import Hero from '../components/modern/Hero';
import Features from '../components/modern/Features';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  BookOpen,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  Star,
} from 'lucide-react';

/**
 * Modern Home Page with Hero, Features, Stats, and CTA
 */
export default function ModernHome() {
  const recentCourses = [
    {
      id: 1,
      title: 'Calculus II',
      progress: 75,
      modules: 8,
      completed: 6,
      image:
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'World History',
      progress: 45,
      modules: 10,
      completed: 4,
      image:
        'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=500&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'Systems Programming',
      progress: 30,
      modules: 12,
      completed: 3,
      image:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop',
    },
  ];

  const achievements = [
    { icon: BookOpen, label: 'Courses Completed', value: 5 },
    { icon: TrendingUp, label: 'Current Streak', value: '12 days' },
    { icon: Clock, label: 'Learning Hours', value: 48 },
    { icon: Star, label: 'Points Earned', value: 1250 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Your Learning Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Continue Your Journey
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Pick up where you left off and keep making progress
            </p>
          </motion.div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="elevated" className="text-center">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                        <achievement.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {achievement.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Courses */}
          <div className="grid md:grid-cols-3 gap-6">
            {recentCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover={true} variant="elevated" className="h-full group">
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge
                      variant="primary"
                      className="absolute top-4 right-4"
                    >
                      {course.progress}% Complete
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {course.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                      {course.completed} / {course.modules} modules completed
                    </div>
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <Link to={`/brackets/semester-1/${course.title}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                        className="w-full"
                      >
                        Continue Learning
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* View All Link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link to="/brackets">
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                View All Courses
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-green-600 to-emerald-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to start your learning journey?
            </h2>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of learners achieving their goals with Brackets.
              Start for free today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto bg-white text-green-600 hover:bg-gray-100"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/ai-assistant">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                >
                  Try AI Assistant
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
