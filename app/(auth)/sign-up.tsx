import { View, Text,Button } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const signUp = () => {
  return (
    <View>
      <Text>signUp</Text>
        <Button title='sign in' onPress={() => router.push('/sign-in')} />
    </View>
  )
}

export default signUp