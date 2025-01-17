'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

const progressSchema = z.object({
  weight: z.string().min(1, 'Weight is required'),
  body_fat_percentage: z.string().min(1, 'Body fat percentage is required'),
  chest: z.string(),
  waist: z.string(),
  hips: z.string(),
  biceps: z.string(),
  thighs: z.string(),
  notes: z.string(),
  date: z.string().min(1, 'Date is required'),
});

type ProgressFormValues = z.infer<typeof progressSchema>;

export function ProgressForm({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const form = useForm<ProgressFormValues>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      weight: '',
      body_fat_percentage: '',
      chest: '',
      waist: '',
      hips: '',
      biceps: '',
      thighs: '',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  async function onSubmit(data: ProgressFormValues) {
    try {
      const measurements = {
        chest: data.chest ? parseFloat(data.chest) : null,
        waist: data.waist ? parseFloat(data.waist) : null,
        hips: data.hips ? parseFloat(data.hips) : null,
        biceps: data.biceps ? parseFloat(data.biceps) : null,
        thighs: data.thighs ? parseFloat(data.thighs) : null,
      };

      const { error } = await supabase.from('progress_logs').insert([{
        weight: parseFloat(data.weight),
        body_fat_percentage: parseFloat(data.body_fat_percentage),
        measurements,
        notes: data.notes,
        date: data.date,
      }]);
      
      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Progress has been logged successfully.',
      });

      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Log Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Progress</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="70.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body_fat_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Fat %</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Measurements (cm)</h4>
              <div className="grid grid-cols-2 gap-4">
                {['chest', 'waist', 'hips', 'biceps', 'thighs'].map((measurement) => (
                  <FormField
                    key={measurement}
                    control={form.control}
                    name={measurement as keyof ProgressFormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">{measurement}</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Log Progress</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}