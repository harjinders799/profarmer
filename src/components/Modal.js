import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Modal as ModalRN,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from './icon';

const { height: heightWindow } = Dimensions.get('window');

const getHeightView = (heightFull = heightWindow, ratio = 0.5) => {
  const getRatio = ratio < 0.3 ? 0.3 : ratio > 1 ? 0.9 : ratio;
  return heightFull * getRatio;
};

function Modal(props) {
  const { colors } = useTheme();
  const {
    topLeftElement,
    topRightElement,
    underTopElement,
    ratioHeight,
    children,
    setModalVisible,
  } = props;

  const [visible, setVisible] = useState(false)
  const [opacity, setOpacity] = useState(new Animated.Value(0))
  const [height, setHeight] = useState(getHeightView(heightWindow, props.ratioHeight))

  const animation = (type = 'open', cb = () => { }) => {
    const toValue = type === 'open' ? 0.5 : 0;
    const duration = 350;
    Animated.timing(opacity, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start(cb);
  };

  const onShow = () => {
    animation();
  };

  useEffect(() => {
    let visible = props.visible;
    // Close
    if (!visible) {
      animation('close', () => setVisible(visible));
    }
    // Open
    if (visible) {
      updateVisible(visible);
    }
  }, [visible, props]);
  const updateVisible = visible => {
    setVisible(visible);
  };

  const topLeft = topLeftElement ? (
    topLeftElement
  ) : (
    <TouchableOpacity
      hitSlop={30}
      onPress={() => setModalVisible(false)}
      style={styles.iconClose}>
      <Icon name="x" type="Feather" size={20} />
    </TouchableOpacity>
  );

  const topRight = topRightElement ? topRightElement : null;

  const bottom = opacity.interpolate({
    inputRange: [0, 0.5],
    outputRange: [-height, 0],
  });

  return (
    <ModalRN transparent visible={visible} onShow={onShow} onRequestClose={() => setModalVisible(false)}>
      <View
        style={styles.flex}
        onLayout={event => {
          let { height: heightFull } = event.nativeEvent.layout;
          setHeight(getHeightView(heightFull, ratioHeight));
        }}>
        <Animated.View
          style={[
            styles.flex,
            {
              backgroundColor: colors.background,
              opacity: opacity,
            },
          ]}>
          <TouchableOpacity
            style={styles.flex}
            onPress={() => setModalVisible(false)}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.modal,
            {
              height: height,
              backgroundColor: colors.border,
              bottom: bottom,
            },
          ]}>
          <View style={styles.header}>
            {topLeft}
            {topRight}
          </View>

          {underTopElement}

          <View style={styles.flex}>{children}</View>
        </Animated.View>
      </View>
    </ModalRN>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  modal: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconClose: {
    padding: 2,
  },
});


export default Modal;
