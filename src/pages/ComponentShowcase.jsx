import { Button } from './components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { 
  Home, 
  FolderOpen, 
  Calendar, 
  Sparkles, 
  BookOpen, 
  TrendingUp,
  Users,
  Target,
  Zap,
  Award,
  Brain,
  Heart,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

/**
 * Component Showcase - Visual Reference
 * Use this page to see all available components and their variants
 */
export default function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Component Showcase
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Visual reference for all available components
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Buttons
          </h2>
          
          {/* Button Variants */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardDescription>Different button styles for various contexts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </CardContent>
          </Card>

          {/* Button Sizes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Sizes</CardTitle>
              <CardDescription>Small, default, large, and icon-only</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="default">Default</Button>
                <Button variant="primary" size="lg">Large</Button>
                <Button variant="primary" size="icon">
                  <Home className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Button States */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>States & Icons</CardTitle>
              <CardDescription>Loading states and icon positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" isLoading>Loading</Button>
                <Button variant="primary" leftIcon={<Home className="h-5 w-5" />}>
                  Left Icon
                </Button>
                <Button variant="primary" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Right Icon
                </Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Cards
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Default Card */}
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default</CardTitle>
                <CardDescription>Standard card with border</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Basic card design with clean borders.
                </p>
              </CardContent>
            </Card>

            {/* Elevated Card */}
            <Card variant="elevated" hover={true}>
              <CardHeader>
                <CardTitle>Elevated</CardTitle>
                <CardDescription>Card with shadow + hover</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Hover over this card to see the effect.
                </p>
              </CardContent>
            </Card>

            {/* Gradient Card */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Gradient</CardTitle>
                <CardDescription>Subtle gradient background</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Green-themed gradient card.
                </p>
              </CardContent>
            </Card>

            {/* Glass Card */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Glass</CardTitle>
                <CardDescription>Glassmorphism effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Modern glass effect with blur.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Complete Card Example */}
          <Card variant="elevated" className="max-w-md">
            <CardHeader>
              <CardTitle>Complete Card Example</CardTitle>
              <CardDescription>
                All card sub-components demonstrated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Course Title
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      12 modules • 48 hours
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full w-3/4" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="primary" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Continue Learning
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Badges Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Badges
          </h2>
          
          {/* Badge Variants */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardDescription>Different badge styles for status indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Badge Sizes */}
          <Card>
            <CardHeader>
              <CardTitle>Sizes</CardTitle>
              <CardDescription>Small, default, and large badges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="primary" size="sm">Small</Badge>
                <Badge variant="primary" size="default">Default</Badge>
                <Badge variant="primary" size="lg">Large</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Icons Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Icons (Lucide React)
          </h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Icon Examples</CardTitle>
              <CardDescription>
                200+ professional icons from Lucide React
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
                {[
                  { icon: Home, name: 'Home' },
                  { icon: FolderOpen, name: 'Folder' },
                  { icon: Calendar, name: 'Calendar' },
                  { icon: Sparkles, name: 'Sparkles' },
                  { icon: BookOpen, name: 'Book' },
                  { icon: TrendingUp, name: 'Trending' },
                  { icon: Users, name: 'Users' },
                  { icon: Target, name: 'Target' },
                  { icon: Zap, name: 'Zap' },
                  { icon: Award, name: 'Award' },
                  { icon: Brain, name: 'Brain' },
                  { icon: Heart, name: 'Heart' },
                  { icon: ArrowRight, name: 'Arrow' },
                  { icon: CheckCircle2, name: 'Check' },
                ].map((item) => (
                  <div key={item.name} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <item.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Color Palette Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Color Palette
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Primary Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Primary (Green)</CardTitle>
                <CardDescription>Main brand color</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div key={shade} className="flex items-center gap-3">
                      <div 
                        className={`w-12 h-12 rounded-lg bg-green-${shade}`}
                        style={{ backgroundColor: `rgb(var(--color-green-${shade}))` }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        green-{shade}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gray Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Neutral (Gray)</CardTitle>
                <CardDescription>Text and backgrounds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div key={shade} className="flex items-center gap-3">
                      <div 
                        className={`w-12 h-12 rounded-lg bg-gray-${shade} border border-gray-300 dark:border-gray-700`}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        gray-{shade}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Status Colors</CardTitle>
                <CardDescription>Feedback and states</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-600" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Success</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">green-600</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Info</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">blue-600</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-yellow-500" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Warning</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">yellow-500</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-red-600" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Danger</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">red-600</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-purple-600" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Accent</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">purple-600</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Typography
          </h2>
          
          <Card>
            <CardContent className="p-8 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-2">
                  Heading 1
                </h1>
                <code className="text-sm text-gray-600 dark:text-gray-400">
                  text-4xl md:text-5xl lg:text-6xl font-bold
                </code>
              </div>
              
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  Heading 2
                </h2>
                <code className="text-sm text-gray-600 dark:text-gray-400">
                  text-3xl md:text-4xl lg:text-5xl font-bold
                </code>
              </div>
              
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Heading 3
                </h3>
                <code className="text-sm text-gray-600 dark:text-gray-400">
                  text-2xl md:text-3xl font-bold
                </code>
              </div>
              
              <div>
                <h4 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Heading 4
                </h4>
                <code className="text-sm text-gray-600 dark:text-gray-400">
                  text-xl md:text-2xl font-semibold
                </code>
              </div>
              
              <div>
                <p className="text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400 mb-2">
                  Body text: Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <code className="text-sm text-gray-600 dark:text-gray-400">
                  text-base md:text-lg leading-relaxed
                </code>
              </div>
              
              <div>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-2">
                  Small text: Perfect for captions, labels, and secondary information.
                </p>
                <code className="text-sm text-gray-600 dark:text-gray-400">
                  text-sm md:text-base
                </code>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Spacing Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Spacing System
          </h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Standard Spacing</CardTitle>
              <CardDescription>Consistent padding and margins</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-2">
                  Section Padding
                </div>
                <code className="text-sm text-gray-600 dark:text-gray-400">
                  py-16 md:py-24 lg:py-32
                </code>
              </div>
              
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-2">
                  Container
                </div>
                <code className="text-sm text-gray-600 dark:text-gray-400">
                  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                </code>
              </div>
              
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-2">
                  Card Padding
                </div>
                <code className="text-sm text-gray-600 dark:text-gray-400">
                  p-6 md:p-8
                </code>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
