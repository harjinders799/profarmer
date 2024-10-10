import React from 'react';
import { View } from 'react-native';
import { common } from '@utils/style';
import Text from './text';
import Button from './button';
import { useTheme } from '@react-navigation/native';

export const Tooltip = ({
    isFirstStep,
    isLastStep,
    handleNext,
    handlePrev,
    handleStop,
    currentStep,
    labels,
}) => {
    const { colors } = useTheme();
    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            backgroundColor: colors.background,
        }}>
            <Text testID="stepDescription" h4 center >
                {currentStep?.text}
            </Text>
            <View style={[common.row_evenly, { marginTop: 10 }]}>
                {!isLastStep && (
                    <Button small label={labels?.skip || 'Skip'} onPress={handleStop} />
                )}
                {!isFirstStep && (
                    <Button small label={labels?.previous || 'Previous'} onPress={handlePrev} />
                )}
                {!isLastStep ? (
                    <Button small label={labels?.next || 'Next'} onPress={handleNext} />
                ) : (
                    <Button small label={labels?.finish || 'Finish'} onPress={handleStop} />
                )}
            </View>
        </View>
    );
};
