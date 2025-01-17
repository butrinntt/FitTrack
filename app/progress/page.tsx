'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Scale, Ruler } from 'lucide-react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ProgressForm } from '@/components/forms/progress-form';

interface ProgressLog {
  id: string;
  weight: number;
  body_fat_percentage: number;
  measurements: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
  };
  date: string;
  notes: string;
}

export default function ProgressPage() {
  const [logs, setLogs] = useState<ProgressLog[]>([]);

  async function fetchProgressLogs() {
    const { data, error } = await supabase
      .from('progress_logs')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching progress logs:', error);
      return;
    }

    setLogs(data || []);
  }

  useEffect(() => {
    fetchProgressLogs();
  }, []);

  return (
    <div className="container py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Progress Tracking</h1>
        <ProgressForm onSuccess={fetchProgressLogs} />
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), 'MMM d')}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => format(new Date(date), 'PPP')}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {logs.map((log) => (
            <Card key={log.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(new Date(log.date), 'PPP')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Scale className="mr-2 h-4 w-4" />
                      <span>Weight</span>
                    </div>
                    <span className="font-medium">{log.weight} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      <span>Body Fat</span>
                    </div>
                    <span className="font-medium">{log.body_fat_percentage}%</span>
                  </div>
                  {log.measurements && (
                    <div className="border-t pt-4">
                      <div className="flex items-center mb-2">
                        <Ruler className="mr-2 h-4 w-4" />
                        <span className="font-medium">Measurements</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(log.measurements).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key}</span>
                            <span>{value} cm</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}