'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { MealForm } from '@/components/forms/meal-form';

interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
  meal_type: string;
}

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);

  async function fetchMeals() {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching meals:', error);
      return;
    }

    setMeals(data || []);
  }

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <div className="container py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meal Plans</h1>
        <MealForm onSuccess={fetchMeals} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {meals.map((meal) => (
          <Card key={meal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{meal.name}</span>
                <span className="text-sm font-normal text-muted-foreground capitalize">
                  {meal.meal_type}
                </span>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {format(new Date(meal.date), 'PPP')}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{meal.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Calories</div>
                  <div className="text-2xl">{meal.calories}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Protein</div>
                  <div className="text-2xl">{meal.protein}g</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Carbs</div>
                  <div className="text-2xl">{meal.carbs}g</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Fats</div>
                  <div className="text-2xl">{meal.fats}g</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}