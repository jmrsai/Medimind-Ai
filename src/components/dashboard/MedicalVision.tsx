'use client';

import { useState } from 'react';
import { generateMedicalIllustration } from '@/ai/flows/generate-medical-illustration';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Download, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export function MedicalVision() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!prompt) {
      toast({
        variant: 'destructive',
        title: 'Prompt required',
        description: 'Please enter a description for the illustration.',
      });
      return;
    }
    setIsLoading(true);
    setImageUrl(null);
    try {
      const { illustrationUrl } = await generateMedicalIllustration({ prompt });
      setImageUrl(illustrationUrl);
    } catch (error) {
      console.error('Illustration generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'An error occurred while generating the image. Please try again.',
      });
    }
    setIsLoading(false);
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'medical-illustration.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Medical Vision</CardTitle>
          <CardDescription>Generate a medical illustration from a text description.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="prompt">Illustration Description</Label>
            <Textarea
              id="prompt"
              placeholder="e.g., 'A diagram of the human heart showing the four chambers and major vessels, with clear labels.'"
              className="min-h-[150px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate Illustration
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="space-y-6">
        {isLoading && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Generating Image...</CardTitle>
              <CardDescription>The AI is creating your illustration. This may take a moment.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </CardContent>
          </Card>
        )}
        {imageUrl && (
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="font-headline">Generated Illustration</CardTitle>
                <CardDescription>Review the AI-generated image below.</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                <span className="sr-only">Download Image</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square w-full overflow-hidden rounded-md border">
                <Image src={imageUrl} alt="Generated medical illustration" fill className="object-contain" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
