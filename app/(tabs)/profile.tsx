import CustomButton from '@/components/CustomButton';
import CustomHeader from '@/components/CustomHeader';
import ProfileName from '@/components/ProfileName';
import { images } from '@/constants';
import useAuthStore from '@/store/auth.store';
import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const { user } = useAuthStore();
  console.log('User:', user);

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 20, paddingTop: 20 }}
      >
        {/* Header */}
        <CustomHeader title="Profile" />

        <View className="items-center">
          {/* Avatar with Edit Icon */}
          <View className="mt-5 mb-7 items-center justify-center relative">
            <Image
              source={{ uri: user?.avatar }}
              className="w-[100px] h-[100px] rounded-full"
              resizeMode="cover"
            />
            <View className="absolute bottom-0 right-0 bg-primary rounded-full h-8 w-8 items-center justify-center">
              <Image
                source={images.pencil}
                className="h-4 w-4"
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Profile Info Card */}
          <View className="w-full bg-white rounded-2xl px-[14px] py-5 shadow-md space-y-[30px]">
            <ProfileName icon={images.user} title="Full Name" subtitle={user?.name} />
            <ProfileName icon={images.envelope} title="Email" subtitle={user?.email} />
            <ProfileName icon={images.phone} title="Phone Number" subtitle="1132323" />
            <ProfileName icon={images.location} title="Address" subtitle="New York, USA" />
          </View>

          {/* Buttons */}
          <View className="mt-10 w-full space-y-4 gap-4">
            <CustomButton
              title="Edit Profile"
              style="bg-[#FE8C00]/10 rounded-full py-4 w-full border border-[#FE8C00] flex-row items-center justify-center gap-x-3"
              textStyle="text-[#FE8C00] font-semibold text-base"
              onPress={() => console.log('Edit Profile')}
            />
            <CustomButton
              title="Logout"
              style="bg-[#F14141]/10 rounded-full py-4 w-full border border-[#F14141] flex-row items-center justify-center gap-x-3"
              textStyle="text-[#F14141] font-semibold text-base"
              onPress={() => console.log('Logout')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
