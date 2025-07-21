import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { signIn } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignIn = () => {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [from, setFrom] = useState({ email: '', password: '' })


  const submit = async () => {
    if (!from.email || !from.password) {
      Alert.alert(
        "Error",
        "A valid email and password are required."
      );
      return;
    }

    setIsSubmitting(true);

    try {


      await signIn({
        email:from.email,
        password:from.password
      })
      router.replace('/');
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>

      <CustomInput
        placeholder='Enter your email'
        value={from.email}
        onChangeText={(text) => setFrom((prev) => ({ ...prev, email: text }))}
        label='Email'
        keyboardType='email-address'
      />
      <CustomInput
        placeholder='Enter your password'
        value={from.password}
        onChangeText={(text) => setFrom((prev) => ({ ...prev, password: text }))}
        label='Password'
        secureTextEntry={true}
      />
      <CustomButton
        title='Sign In'
        isLoading={isSubmitting}
        onPress={submit}
      />

      <View className='flex justify-center mt-5 flex-row gap-2'>
        <Text className='base-regular text-gray-100'>Don’t have an account?</Text>
        <Link href='/sign-up' className='base-bold text-primary'>
          Sign up
        </Link>
      </View>

    </View>
  )
}

export default SignIn