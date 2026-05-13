'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'gemini-api-key';

export function useGeminiKey() {
    const [apiKey, setApiKeyState] = useState('');
    const [isConfigured, setIsConfigured] = useState(false);
    const [isSystemConfigured, setIsSystemConfigured] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setApiKeyState(stored);
            setIsConfigured(true);
        }

        // Check if system key is available
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setIsSystemConfigured(data.isSystemConfigured);
            })
            .catch(err => console.error('Failed to check system settings:', err));
    }, []);

    const setApiKey = useCallback((key: string) => {
        setApiKeyState(key);
        if (key.trim()) {
            localStorage.setItem(STORAGE_KEY, key.trim());
            setIsConfigured(true);
        } else {
            localStorage.removeItem(STORAGE_KEY);
            setIsConfigured(false);
        }
    }, []);

    const clearApiKey = useCallback(() => {
        setApiKeyState('');
        localStorage.removeItem(STORAGE_KEY);
        setIsConfigured(false);
    }, []);

    return { apiKey, setApiKey, clearApiKey, isConfigured, isSystemConfigured };
}