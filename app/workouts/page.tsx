'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, BarChart } from 'lucide-react';
import { format } from 'date-fns';
import { WorkoutForm } from '@/components/forms/workout-form';

interface Workout {
  id: string;
  name: string;
  description: string;
  date: string;
  duration: string;
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  async function fetchWorkouts() {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching workouts:', error);
      return;
    }

    setWorkouts(data || []);
  }

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return ( 
    <div className="container py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Workouts</h1>
        <WorkoutForm onSuccess={fetchWorkouts} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workouts.map((workout) => (
          <Card key={workout.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{workout.name}</span>
              </CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                {format(new Date(workout.date), 'PPP')}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{workout.description}</p>
              <div className="flex items-center text-sm">
                <BarChart className="mr-2 h-4 w-4" />
                Duration: {workout.duration}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}