import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import BaseView from 'src/container/base';
import Input from 'src/components/input';
import Button from 'src/components/button';
import Logo from 'src/container/logo';
import Text from 'src/components/text';
import Loader from 'src/components/loader';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import { strings } from 'src/translations/locale';
import { SignUpUser } from '../../network/auth-service';
import { navigate } from '@navigation/ref';
import { isValidEmail } from '@utils/helper';
import Header from '@components/header';

const SignUp = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const signUp = async () => {
        if (!isValidEmail(formData?.email)) {
            return ToastError(strings.invalidEmail);
        }
        if (formData.password !== formData.confirmPassword) {
            return ToastError(strings.passwords_do_not_match);
        }
        setLoading(true);
        try {
            await SignUpUser(formData.email, formData.password);
            ToastSuccess(strings.registration_success);
        } catch (error) {
            ToastError(error?.message);
            setLoading(false);
        }
    };

    return (
        <BaseView space>
            <Header back />
            <Loader visible={loading} />
            <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{
                    alignItems: 'center',
                    paddingBottom: 150,
                }}
                automaticallyAdjustKeyboardInsets
                keyboardDismissMode='interactive'
                keyboardShouldPersistTaps="handled">
                <Logo />
                <Text h2 style={{ marginBottom: 20 }}>{strings.register}</Text>
                <Input
                    emailType
                    iconName="email"
                    iconType="Zocial"
                    placeholder={strings.email}
                    value={formData.email}
                    setValue={text => handleInputChange('email', text)}
                />
                <Input
                    iconName="locked"
                    iconType="Fontisto"
                    placeholder={strings.password}
                    value={formData.password}
                    setValue={text => handleInputChange('password', text)}
                    secureTextEntry
                />
                <Input
                    iconName="locked"
                    iconType="Fontisto"
                    placeholder={strings.confirm_password}
                    value={formData.confirmPassword}
                    setValue={text => handleInputChange('confirmPassword', text)}
                />
                <Button label={strings.register} onPress={signUp} />
                <TouchableOpacity hitSlop={20} onPress={() => navigate('SignInWithEmail')}>
                    <Text style={styles.link}>{strings.already_have_account}</Text>
                </TouchableOpacity>
            </ScrollView>
        </BaseView>
    );
};

const styles = StyleSheet.create({
    link: {
        marginTop: 20,
        color: 'blue',
        textAlign: 'center',
    },
});

export default SignUp;
