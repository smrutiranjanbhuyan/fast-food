import React from 'react';
import { Image, Text, View } from 'react-native';

const ProfileName = ({
  icon = null,
  title = 'Full Name',
  subtitle = 'Adrian Hajdin',
}) => {
  return (
    <View className='flex-row items-center bg-white p-4 rounded-lg'>
      {/* Icon Wrapper */}
      <View className='w-12 h-12 bg-orangesoft border border-orangesoft rounded-full items-center justify-center mr-3'>
        <Image
          source={icon!}
          resizeMode='contain'
          className='w-4 h-4'
          alt="Icon"
        />
      </View>

      {/* Text Section */}
      <View>
        <Text className='text-xs text-gray-500'>{title}</Text>
        <Text className='text-base font-semibold text-gray-900'>{subtitle}</Text>
      </View>
    </View>
  );
};

export default ProfileName;
