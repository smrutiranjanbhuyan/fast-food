import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { createUser } from '@/lib/appwrite'
import useAuthStore from '@/store/auth.store'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignUp = () => {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [from, setFrom] = useState({ name: "", email: '', password: '' })
  const { setIsAuthenticated } = useAuthStore();



  const submit = async () => {
    if (!from.email || !from.password || !from.name) {
      Alert.alert(
        "Error",
        "A valid name , email and password are required."
      );
      return;
    }

    setIsSubmitting(true);

    try {

      await createUser({
        email: from.email,
        password: from.password,
        name: from.name
      })

      setIsAuthenticated(true);


      router.replace('/success');
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
      <CustomInput
        placeholder='Enter your full name'
        value={from.name}
        onChangeText={(text) => setFrom((prev) => ({ ...prev, name: text }))}
        label='Full name'

      />
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
        title='Sign Up'
        isLoading={isSubmitting}
        onPress={submit}
      />

      <View className='flex justify-center mt-5 flex-row gap-2'>
        <Text className='base-regular text-gray-100'>Already have an account?</Text>
        <Link href='/sign-in' className='base-bold text-primary'>
          Sign In
        </Link>
      </View>

    </View>
  )
}

export default SignUp