'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookText, FileText, LayoutDashboard, Loader2, Menu, Stethoscope, UserSquare, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserNav } from '@/components/UserNav';
import { Logo } from '@/components/icons';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { ReportAnalyzer } from '@/components/dashboard/ReportAnalyzer';
import { TreatmentPlanner } from '@/components/dashboard/TreatmentPlanner';
import { DocumentSummarizer } from '@/components/dashboard/DocumentSummarizer';
import { PatientChartSummarizer } from '@/components/dashboard/PatientChartSummarizer';
import { MedicalVision } from '@/components/dashboard/MedicalVision';
import type { AnalyzePatientNotesOutput } from '@/ai/flows/analyze-patient-notes';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sidebar, SidebarContent, SidebarItem, SidebarTrigger, SidebarMenu, SidebarLabel } from '@/components/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"


type View = 'dashboard' | 'analyzer' | 'planner' | 'summarizer' | 'chart-summarizer' | 'medical-vision';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analyzer', label: 'AI Report Analyzer', icon: FileText },
  { id: 'planner', label: 'AI Treatment Planner', icon: Stethoscope },
  { id: 'summarizer', label: 'AI Document Summarizer', icon: BookText },
  { id: 'chart-summarizer', label: 'AI Chart Summarizer', icon: UserSquare },
  { id: 'medical-vision', label: 'Medical Vision', icon: Eye },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [analysisResult, setAnalysisResult] = useState<AnalyzePatientNotesOutput | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('medimind_user');
    if (user) {
      setIsAuthenticated(true);
    } else {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardContent setActiveView={setActiveView} />;
      case 'analyzer':
        return <ReportAnalyzer setAnalysisResult={setAnalysisResult} setActiveView={setActiveView} />;
      case 'planner':
        return <TreatmentPlanner analysisResult={analysisResult} />;
      case 'summarizer':
        return <DocumentSummarizer />;
      case 'chart-summarizer':
        return <PatientChartSummarizer />;
      case 'medical-vision':
        return <MedicalVision />;
      default:
        return <DashboardContent setActiveView={setActiveView} />;
    }
  };

  const NavContent = ({isMobile = false}) => (
     <SidebarContent className={cn(!isMobile && 'p-4')}>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarItem key={item.id} isActive={activeView === item.id} onClick={() => setActiveView(item.id as View)}>
                <item.icon className="h-4 w-4" />
                <SidebarLabel>{item.label}</SidebarLabel>
            </SidebarItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar className="hidden md:block">
        <div className="flex h-full max-h-screen flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-6 w-6 text-primary" />
              <span className="font-headline">MediMind AI</span>
            </a>
          </div>
          <NavContent />
        </div>
      </Sidebar>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
               <SheetHeader className="p-4 border-b">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <a href="/" className="flex items-center gap-2 font-semibold">
                  <Logo className="h-6 w-6 text-primary" />
                  <span className="font-headline">MediMind AI</span>
                </a>
              </SheetHeader>
              <NavContent isMobile={true}/>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
             <h1 className="font-semibold text-lg font-headline capitalize">
                {navItems.find(item => item.id === activeView)?.label}
            </h1>
          </div>
          <ThemeToggle />
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-secondary/20">
          {renderContent()}
        </main>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
                    <Logo className="h-8 w-8" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" className="w-64">
                <DropdownMenuLabel>Quick Access</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navItems.filter(item => item.id !== 'dashboard').map(item => (
                    <DropdownMenuItem key={item.id} onClick={() => setActiveView(item.id as View)} className="cursor-pointer">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
