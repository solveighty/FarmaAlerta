import { Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

export const useHapticAnimation = () => {
    const scaleAnim = new Animated.Value(1);

    const triggerHapticAnimation = (
        hapticType: 'light' | 'medium' | 'heavy' = 'medium'
    ) => {
        // Trigger haptic feedback
        if (hapticType === 'light') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (hapticType === 'medium') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }

        // Trigger animation
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return { scaleAnim, triggerHapticAnimation };
};
