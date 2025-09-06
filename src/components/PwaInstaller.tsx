'use client';

import { useEffect } from 'react';
import { useToast } from './ui/use-toast';

const PwaInstaller = () => {
    const { toast } = useToast();

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(
                    (registration) => {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    },
                    (err) => {
                        console.error('ServiceWorker registration failed: ', err);
                        toast({
                            variant: 'destructive',
                            title: 'Service Worker Failed',
                            description: 'Could not register service worker for offline capabilities.',
                        });
                    }
                );
            });
        }
    }, [toast]);

    return null;
};

export default PwaInstaller;
