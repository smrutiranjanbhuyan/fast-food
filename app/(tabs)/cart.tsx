import CartItem from "@/components/CartItem";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import EmptyState from "@/components/EmptyState";
import PaymentInfoStripe from "@/components/PaymentInfoStripe";
import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";
import { useState } from "react";
import {
    Alert,
    FlatList,
    Linking,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Cart = () => {
  const { items, getTotalItems, getTotalPrice } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [showSuccess, setShowSuccess] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // 🔹 Show success UI for 2.5 seconds
  const showOrderSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Optional: Clear cart / navigate to orders page here
    }, 2500);
  };

  const handleUpiPayment = async () => {
    const amount = (totalPrice + 5 - 0.5).toFixed(2);

    const upiUrl = `upi://pay?pa=smrutibhuyan@fifederal&pn=FoodApp&tn=Order%20Payment&am=${amount}&cu=INR`;

    try {
      const supported = await Linking.canOpenURL(upiUrl);

      if (!supported) {
        Alert.alert(
          "No UPI App Found",
          "Install GPay / PhonePe / Paytm to continue."
        );
        return;
      }

      await Linking.openURL(upiUrl);

      // 🎉 Show success UI instead of alert
      showOrderSuccess();
    } catch (error) {
      Alert.alert("Payment Failed ❌", "Please try again.");
    }
  };

  const handleCOD = () => {
    showOrderSuccess();
  };

  return (
    <SafeAreaView className="bg-white h-full">
      {/* SUCCESS MODAL */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="bg-white rounded-3xl p-8 items-center w-72">
            <Text className="text-5xl mb-3">🎉</Text>
            <Text className="text-lg font-bold text-dark-100 mb-2">
              Order Placed!
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              Your delicious food is on the way 🚀
            </Text>
          </View>
        </View>
      </Modal>

      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-40 px-5 pt-5"
        ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
        ListEmptyComponent={() => (
          <EmptyState
            title="Your cart is empty"
            description="Add items to your cart to place an order."
            image={images.emptyState}
          />
        )}
        ListFooterComponent={() =>
          totalItems > 0 && (
            <View className="gap-6">
              {/* Payment Summary */}
              <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                <Text className="h3-bold text-dark-100 mb-5">
                  Payment Summary
                </Text>

                <PaymentInfoStripe
                  label={`Total Items (${totalItems})`}
                  value={`₹${totalPrice.toFixed(2)}`}
                />
                <PaymentInfoStripe label="Delivery Fee" value="₹5.00" />
                <PaymentInfoStripe
                  label="Discount"
                  value="- ₹0.50"
                  valueStyle="!text-success"
                />

                <View className="border-t border-gray-300 my-2" />

                <PaymentInfoStripe
                  label="Total"
                  value={`₹${(totalPrice + 5 - 0.5).toFixed(2)}`}
                  labelStyle="base-bold !text-dark-100"
                  valueStyle="base-bold !text-dark-100 !text-right"
                />
              </View>

              {/* Payment Method */}
              <View className="border border-gray-200 p-5 rounded-2xl">
                <Text className="h3-bold text-dark-100 mb-4">
                  Payment Method
                </Text>

                {["UPI", "Cash on Delivery"].map((method) => (
                  <TouchableOpacity
                    key={method}
                    onPress={() => setPaymentMethod(method)}
                    className="flex-row justify-between items-center py-3"
                  >
                    <Text className="text-dark-100 base-medium">
                      {method}
                    </Text>
                    <View
                      className={`w-5 h-5 rounded-full border 
                        ${
                          paymentMethod === method
                            ? "bg-primary border-primary"
                            : "border-gray-400"
                        }`}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Order Button */}
              <CustomButton
                title={`Pay with ${paymentMethod}`}
                onPress={
                  paymentMethod === "UPI"
                    ? handleUpiPayment
                    : handleCOD
                }
              />
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Cart;
