import CustomButton from '@/components/CustomButton';
import { images } from '@/constants';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

const Success = () => {
    return (

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView className='bg-white h-full ' keyboardShouldPersistTaps="handled">
                <View className='w-full relative' style={{ height: Dimensions.get('screen').height / 2.25 }}>
                    <ImageBackground source={images.loginGraphic} className='size-full rounded-b-lg' resizeMode='stretch' />
                    <Image source={images.logo} className='self-center size-48 absolute -bottom-16 z-10' />
                </View>

                <View className=" bg-white rounded-lg  p-5 mt-5' flex-1 items-center justify-center  ">

                    <View className="w-14 h-1.5 bg-gray-300 rounded-xl self-center mb-6 mt-2" />

                    {/* Success Badge Image */}
                    <View className="mb-8">
                        <Image
                            source={images.success}
                            resizeMode="contain"
                            className="h-40 w-48"
                            alt="Success"
                        />
                    </View>

                    {/* Title */}
                    <Text className="text-xl font-semibold text-black mb-2">
                        Login Successful
                    </Text>

                    {/* Subtitle */}
                    <Text className="text-base text-gray-500 text-center mb-8">
                        You’re all set to continue where you left off.
                    </Text>

                    {/* Button */}
                    <CustomButton
                        title='Go to Home Page'
                        onPress={() => router.replace('/')
                        }
                    />

                </View>
            </ScrollView>

        </KeyboardAvoidingView>


    );
};

export default Success;
