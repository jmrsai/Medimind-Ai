'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Stethoscope, BookText, Activity, Users, LineChart, UserSquare } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, Area, AreaChart } from 'recharts';
import Image from 'next/image';

interface DashboardContentProps {
  setActiveView: (view: string) => void;
}

const analysisData = [
  { name: 'Mon', analyses: 12 },
  { name: 'Tue', analyses: 19 },
  { name: 'Wed', analyses: 8 },
  { name: 'Thu', analyses: 14 },
  { name: 'Fri', analyses: 23 },
  { name: 'Sat', analyses: 18 },
  { name: 'Sun', analyses: 15 },
];

const confidenceData = [
  { name: 'Week 1', confidence: 78 },
  { name: 'Week 2', confidence: 82 },
  { name: 'Week 3', confidence: 85 },
  { name: 'Week 4', confidence: 83 },
];

export function DashboardContent({ setActiveView }: DashboardContentProps) {
  return (
    <div className="space-y-6">
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">1,234</div>
              <p className="text-xs text-muted-foreground">+10.2% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Confidence</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">84.5%</div>
              <p className="text-xs text-muted-foreground">+1.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">57</div>
              <p className="text-xs text-muted-foreground">+3 since last hour</p>
            </CardContent>
          </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Weekly Analysis Volume</CardTitle>
                   <CardDescription>
                      Number of analyses performed each day this week.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={analysisData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip
                              cursor={{fill: 'hsl(var(--secondary))', radius: 'var(--radius)'}}
                              contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                              }}
                          />
                          <Bar dataKey="analyses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>
           <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Average Confidence Trend</CardTitle>
                  <CardDescription>
                      Monthly trend of the average diagnosis confidence score.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={confidenceData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis domain={[70, 90]} fontSize={12} tickLine={false} axisLine={false} />
                           <Tooltip
                              cursor={{stroke: 'hsl(var(--primary))', strokeWidth: 2,}}
                              contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                              }}
                          />
                          <defs>
                              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="confidence" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorConfidence)" />
                      </AreaChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Get Started</CardTitle>
            <CardDescription>
                Choose one of our powerful AI tools to begin.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div
              className="flex flex-col items-center justify-center p-6 space-y-3 rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary transition-colors"
              onClick={() => setActiveView('analyzer')}
            >
              <FileText className="h-8 w-8 text-primary" />
              <h3 className="font-semibold text-center">AI Report Analyzer</h3>
              <p className="text-xs text-center text-muted-foreground">
                Get diagnoses from patient notes or documents.
              </p>
            </div>
             <div
              className="flex flex-col items-center justify-center p-6 space-y-3 rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary transition-colors"
              onClick={() => setActiveView('planner')}
            >
              <Stethoscope className="h-8 w-8 text-primary" />
              <h3 className="font-semibold text-center">AI Treatment Planner</h3>
              <p className="text-xs text-center text-muted-foreground">
                Generate detailed treatment plans based on analysis.
              </p>
            </div>
             <div
              className="flex flex-col items-center justify-center p-6 space-y-3 rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary transition-colors"
              onClick={() => setActiveView('summarizer')}
            >
              <BookText className="h-8 w-8 text-primary" />
              <h3 className="font-semibold text-center">AI Doc Summarizer</h3>
              <p className="text-xs text-center text-muted-foreground">
                Condense long medical articles into key points.
              </p>
            </div>
            <div
              className="flex flex-col items-center justify-center p-6 space-y-3 rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary transition-colors"
              onClick={() => setActiveView('chart-summarizer')}
            >
              <UserSquare className="h-8 w-8 text-primary" />
              <h3 className="font-semibold text-center">AI Chart Summarizer</h3>
              <p className="text-xs text-center text-muted-foreground">
                Summarize a full patient chart into a brief overview.
              </p>
            </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
            <div className="p-6">
                <CardTitle className="font-headline">Revolutionize Your Workflow</CardTitle>
                <CardDescription className="mt-2">
                   MediMind AI leverages state-of-the-art language models to provide you with unparalleled insights, helping you make faster, more informed decisions.
                </CardDescription>
                <div className="mt-6 space-y-4 text-sm">
                   <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Input Data</h3>
                        <p className="text-muted-foreground">Provide patient notes, analysis results, or a lengthy document.</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">AI Processing</h3>
                        <p className="text-muted-foreground">Advanced AI models analyze the content to generate insights.</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Review Results</h3>
                        <p className="text-muted-foreground">Receive structured output to inform your clinical decisions.</p>
                      </div>
                    </div>
                </div>
            </div>
            <div className="relative h-64 md:h-auto">
                 <Image src="https://picsum.photos/800/600" fill alt="AI in medicine" data-ai-hint="ai medicine" className="object-cover" />
            </div>
        </div>
      </Card>

    </div>
  );
}
