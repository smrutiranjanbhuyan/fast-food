import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createUser } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const { setIsAuthenticated } = useAuthStore();
  const submit = async () => {
    if (!form.name || !form.email || !form.password || !form.phone) {
      Alert.alert("Error", "Name, email, phone number and password are required.");
      return;
    }

    const formattedPhone = form.phone.startsWith("+91")
      ? form.phone
      : `+91${form.phone}`;

    setIsSubmitting(true);

    try {
      await createUser({
        name: form.name,
        email: form.email,
        phone: formattedPhone,
        password: form.password,
      });

      setIsAuthenticated(true);
      router.replace("/success");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        label="Full name"
        placeholder="Enter your full name"
        value={form.name}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, name: text }))
        }
      />

      <CustomInput
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, email: text }))
        }
      />

      <CustomInput
        label="Phone number"
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, phone: text }))
        }
      />

      <CustomInput
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        value={form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
      />

      <CustomButton
        title="Sign Up"
        isLoading={isSubmitting}
        onPress={submit}
      />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Already have an account?
        </Text>
        <Link href="/sign-in" className="base-bold text-primary">
          Sign In
        </Link>
      </View>
    </View>
  );
};

export default SignUp;
