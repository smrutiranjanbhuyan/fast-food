import CustomButton from '@/components/CustomButton';
import CustomHeader from '@/components/CustomHeader';
import ProfileName from '@/components/ProfileName';
import { images } from '@/constants';
import { signOut } from '@/lib/appwrite';
import useAuthStore from '@/store/auth.store';
import React from 'react';
import { Alert, Image, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Profile = () => {
  const { user } = useAuthStore();
  console.log('User:', user);
  const { logOutUser } = useAuthStore();
  const handelLogout = () => {
    try {
      signOut();
      logOutUser();
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert(
        'Logout Failed',
        'An error occurred while trying to log out. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  }

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
              alt='User Avatar'
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
            <ProfileName icon={images.phone} title="Phone Number" subtitle={user?.phone} />
            <ProfileName icon={images.location} title="Address" subtitle="New York, USA" />
          </View>

          {/* Buttons */}
          <View className="mt-10 w-full space-y-4 gap-4">
            <CustomButton
              title="Edit Profile"
              style="bg-primary/10 rounded-full py-4 w-full border border-primary flex-row items-center justify-center gap-x-3"
              textStyle="text-primary font-semibold text-base"
              onPress={() => console.log('Edit Profile')}
            />
            <CustomButton
              title="Logout"
              style="bg-error/10 rounded-full py-4 w-full border border-error flex-row items-center justify-center gap-x-3"
              textStyle="text-error font-semibold text-base"
              leftIcon={<Image source={images.logout} className="h-5 w-5" resizeMode="contain" />}
              onPress={handelLogout}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
