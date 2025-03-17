
import React from 'react';
import { BookOpen, Heart, Leaf, Brain, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock health articles data
const healthArticles = [
  {
    id: '1',
    title: 'The Benefits of Mediterranean Diet',
    category: 'Nutrition',
    readTime: '5 min read',
    featured: true,
    icon: 'leaf'
  },
  {
    id: '2',
    title: 'Understanding Blood Pressure Readings',
    category: 'Heart Health',
    readTime: '3 min read',
    featured: false,
    icon: 'heart'
  },
  {
    id: '3',
    title: 'Managing Stress with Mindfulness',
    category: 'Mental Health',
    readTime: '4 min read',
    featured: false,
    icon: 'brain'
  }
];

const HealthArticles = () => {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Health Articles</CardTitle>
          <CardDescription>Personalized health tips and articles</CardDescription>
        </div>
        <Button variant="ghost" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthArticles.map((article) => (
            <div 
              key={article.id} 
              className={`flex items-start gap-4 p-3 border rounded-lg ${
                article.featured ? 'bg-primary/5 border-primary/20' : ''
              }`}
            >
              <div className={`p-2 rounded-full ${
                article.icon === 'leaf' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                article.icon === 'heart' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {article.icon === 'leaf' && <Leaf className="h-4 w-4" />}
                {article.icon === 'heart' && <Heart className="h-4 w-4" />}
                {article.icon === 'brain' && <Brain className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs">
                    {article.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                </div>
                <h4 className="font-medium">{article.title}</h4>
                <div className="flex items-center justify-between mt-2">
                  {article.featured && (
                    <Badge variant="secondary" className="text-xs">
                      Featured
                    </Badge>
                  )}
                  <Button size="sm" variant="outline" className="h-7 gap-1">
                    Read <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthArticles;
