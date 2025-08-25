import React from 'react';
import { Image, Text, View } from 'react-native';
import { images } from '../constants';

const Rating = ({ rating = 0, maxRating = 5, starSize = 20, showRating = true }) => {

  const renderStar = (index:any) => {
    const starValue = index + 1;
    let opacity;
    
    if (rating >= starValue) {
      opacity = 1; // Full star
    } else if (rating >= starValue - 0.5) {
      opacity = 0.5; // Half star
    } else {
      opacity = 0.2; // Empty star
    }
    
    return (
      <Image
        key={index}
        source={images.star}
        style={{
          width: starSize,
          height: starSize,
          opacity: opacity,
        }}
        className="mr-1"
        resizeMode="contain"
      />
    );
  };

  return (
    <View className="flex-row items-center">
      <View className="flex-row items-center mr-2">
        {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
      </View>
      {showRating && (
        <Text className="text-sm text-gray-600 font-medium">
          {rating.toFixed(1)}/5
        </Text>
      )}
    </View>
  )
}

export default Rating;

