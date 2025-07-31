import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '@/constants'

const EmptyState = ({
    title = 'No Results Found',
    description = 'Try a different search term or check for typos.',
    image = images.emptyState,
}) => {
    return (
        <View className='flex-1 items-center justify-center bg-white'>
            <Image
                source={image}
                className='h-44 w-44 mb-4'
                resizeMode='contain'
            />
            <Text className='text-gray-500 text-lg mt-4'>
                {title}
            </Text>
            <Text className='text-gray-400 text-base mt-2'>
                {description}
            </Text>
            
        </View>
    )
}

export default EmptyState