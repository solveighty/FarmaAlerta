import { useState, useCallback } from 'react';

export interface AlertOptions {
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    buttons?: Array<{
        text: string;
        onPress?: () => void;
        style?: 'default' | 'cancel' | 'destructive';
    }>;
}

export const useCustomAlert = () => {
    const [alertState, setAlertState] = useState<{
        visible: boolean;
        title: string;
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
        buttons?: Array<{
            text: string;
            onPress?: () => void;
            style?: 'default' | 'cancel' | 'destructive';
        }>;
    }>({
        visible: false,
        title: '',
        message: '',
        type: 'info',
    });

    const show = useCallback((options: AlertOptions) => {
        setAlertState({
            visible: true,
            title: options.title,
            message: options.message,
            type: options.type || 'info',
            buttons: options.buttons,
        });
    }, []);

    const hide = useCallback(() => {
        setAlertState(prev => ({ ...prev, visible: false }));
    }, []);

    return {
        ...alertState,
        show,
        hide,
    };
};
