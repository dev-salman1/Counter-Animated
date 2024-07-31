import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const BUTTON_WIDTH = 250;
const ICON_SIZE = 25;
const MAX_SLIDE_OFFSET = BUTTON_WIDTH * 0.4;

const clamp = (value: number, lowerBound: number, upperBound: number) => {
  "worklet";
  return Math.min(Math.max(lowerBound, value), upperBound);
};

const App = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [count, setCount] = useState(0);
  const scale = useSharedValue(1);

  const incrementCount = () => {
    setCount((prev) => prev + 1);
  };
  const decrementCount = () => {
    setCount((prev) => prev - 1);
  };
  const resetCount = () => {
    setCount(0);
  };
  const panGesture = Gesture.Pan()
    .onTouchesUp(() => {
      runOnJS(incrementCount)();
    })
    .onUpdate((event) => {
      translateX.value = clamp(
        event.translationX,
        -MAX_SLIDE_OFFSET,
        MAX_SLIDE_OFFSET
      );
      translateY.value = clamp(event.translationY, 0, MAX_SLIDE_OFFSET * 0.5);
    })
    .onEnd(() => {
      if (translateY.value === MAX_SLIDE_OFFSET * 0.5) {
        runOnJS(resetCount)();
      } else if (translateX.value > MAX_SLIDE_OFFSET * 0.7) {
        runOnJS(incrementCount)();
      } else if (translateX.value == -MAX_SLIDE_OFFSET && count > 0) {
        runOnJS(decrementCount)();
      }
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
    })

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        {
          translateY: translateY.value,
        },
        { scale: scale.value },
      ],
    };
  });

  const rPlusMinusIconStyle = useAnimatedStyle(() => {
    const opacityX = interpolate(
      translateX.value,
      [-MAX_SLIDE_OFFSET, 0, MAX_SLIDE_OFFSET],
      [0.4, 0.9, 0.4]
    );

    const OpacityY = interpolate(
      translateY.value,
      [0, MAX_SLIDE_OFFSET * 0.5],
      [1, 0]
    );
    return {
      opacity: opacityX * OpacityY,
    };
  });

  const rCloseIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, MAX_SLIDE_OFFSET * 0.5],
      [0, 0.8]
    );
    return {
      opacity: opacity,
    };
  });

  const rButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value * 0.1 },
        {
          translateY: translateY.value * 0.1,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.button, rButtonStyle]}>
        <Animated.View style={rPlusMinusIconStyle}>
          <AntDesign name="minus" size={ICON_SIZE} color="#F7F7F7" />
        </Animated.View>
        <Animated.View style={rCloseIconStyle}>
          <AntDesign name="close" size={ICON_SIZE} color="#F7F7F7" />
        </Animated.View>

        <Animated.View style={rPlusMinusIconStyle}>
          <AntDesign name="plus" size={ICON_SIZE} color="#F7F7F7" />
        </Animated.View>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.circle, rStyle]}>
              <Text style={styles.count}>{count}</Text>
            </Animated.View>
          </GestureDetector>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: BUTTON_WIDTH,
    height: 80,
    backgroundColor: "#1E1E1E",
    borderCurve: "continuous",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  circle: {
    backgroundColor: "#444444",
    height: 60,
    width: 60,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    elevation: 0,
    shadowOpacity: 0.6,
    shadowRadius: 5,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  count: {
    fontSize: 25,
    color: "#F7F7F7",
  },
});
