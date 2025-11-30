import CartItem from '@/components/CartItem';
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import EmptyState from '@/components/EmptyState';
import PaymentInfoStripe from '@/components/PaymentInfoStripe';
import { images } from '@/constants';
import { useCartStore } from "@/store/cart.store";
import { useState } from 'react';
import { Alert, FlatList, Linking, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const Cart = () => {
    const { items, getTotalItems, getTotalPrice } = useCartStore();
    const [paymentMethod, setPaymentMethod] = useState("UPI");

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();


    const handleUpiPayment = async () => {
        const amount = (totalPrice + 5 - 0.5).toFixed(2);

        
        const upiUrl = `upi://pay?pa=smrutibhuyan@fifederal&pn=FoodApp&tn=Order%20Payment&am=${amount}&cu=INR`;

        try {
            const supported = await Linking.canOpenURL(upiUrl);

            if (!supported) {
                Alert.alert("No UPI App Found", "Install GPay / PhonePe / Paytm to continue.");
                return;
            }

            await Linking.openURL(upiUrl);

          
            Alert.alert("Payment Successful 🎉", "Your Order Has Been Placed!");
        } catch (error) {
            Alert.alert("Payment Failed ❌", "Please try again.");
        }
    };

    return (
        <SafeAreaView className="bg-white h-full">
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
                ListFooterComponent={() => totalItems > 0 && (
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
                            <PaymentInfoStripe
                                label="Delivery Fee"
                                value="₹5.00"
                            />
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

                        {/* Payment Method Section */}
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
                                            ${paymentMethod === method
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
                                    : () => Alert.alert("Order Placed", "Cash on Delivery Selected")
                            }
                        />
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default Cart;
