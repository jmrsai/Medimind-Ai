'use client';

import { useState, useRef, useEffect } from 'react';
import { generateFromDoodle } from '@/ai/flows/generate-from-doodle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Download, Loader2, Image as ImageIcon, Eraser, Palette } from 'lucide-react';
import Image from 'next/image';
import { Slider } from '../ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';

const colors = [
  '#000000', '#FF0000', '#0000FF', '#008000', '#FFFF00', '#800080', '#FFFFFF'
];

export function MedicalDoodleGenerator() {
  const [prompt, setPrompt] = useState('');
  const [advancements, setAdvancements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSubmit = async () => {
    if (!prompt) {
      toast({
        variant: 'destructive',
        title: 'Prompt required',
        description: 'Please enter a description for the illustration.',
      });
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if canvas is empty
    const context = canvas.getContext('2d');
    if (!context) return;
    const pixelBuffer = new Uint32Array(
      context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );
    const isEmpty = !pixelBuffer.some(color => color !== 0);

    if (isEmpty) {
        toast({
            variant: 'destructive',
            title: 'Doodle required',
            description: 'Please draw something on the canvas.',
        });
        return;
    }


    const doodleDataUri = canvas.toDataURL('image/png');

    setIsLoading(true);
    setImageUrl(null);
    try {
      const { imageUrl } = await generateFromDoodle({ prompt, doodleDataUri, advancementsAndResults: advancements });
      setImageUrl(imageUrl);
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
    a.download = 'medical-illustration-from-doodle.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Medical Doodle Generator</CardTitle>
          <CardDescription>Draw a doodle, describe it, and let AI create a detailed illustration.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div>
                  <Label>Doodle Canvas</Label>
                  <div className="mt-2 rounded-lg border bg-white overflow-hidden">
                      <canvas
                          ref={canvasRef}
                          width={512}
                          height={512}
                          className="w-full h-auto cursor-crosshair"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                      />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                      <div className='flex items-center gap-4'>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon"><Palette /></Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2">
                                <div className="flex gap-1">
                                {colors.map(color => (
                                    <button 
                                        key={color}
                                        className={cn("h-8 w-8 rounded-full border-2", brushColor === color ? 'border-primary' : 'border-transparent')}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setBrushColor(color)}
                                    />
                                ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                        <div className='flex items-center gap-2 w-40'>
                            <Label className='text-sm'>Size</Label>
                            <Slider
                                min={1}
                                max={50}
                                step={1}
                                value={[brushSize]}
                                onValueChange={(value) => setBrushSize(value[0])}
                            />
                        </div>
                      </div>
                      <Button variant="destructive" size="sm" onClick={clearCanvas}><Eraser className="mr-2 h-4 w-4" /> Clear</Button>
                  </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="prompt">Illustration Description</Label>
                    <Textarea
                    id="prompt"
                    placeholder="e.g., 'A detailed diagram of a human neuron, showing the dendrites, axon, and synapse.'"
                    className="min-h-[100px]"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="advancements">Optional: Advancements and Results</Label>
                    <Textarea
                        id="advancements"
                        placeholder="e.g., 'Illustrate the new protein folding mechanism discovered in the latest research...'"
                        className="min-h-[100px]"
                        value={advancements}
                        onChange={(e) => setAdvancements(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
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
              <CardDescription>The AI is creating your illustration from the doodle. This may take a moment.</CardDescription>
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
                <Image src={imageUrl} alt="Generated medical illustration from doodle" fill className="object-contain" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
