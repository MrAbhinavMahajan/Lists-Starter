import React, { memo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Character } from "../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type CharacterListItem = {
  character: Character;
};

export const CHARACTER_LIST_ITEM_HEIGHT = SCREEN_WIDTH;
export const CHARACTER_LIST_ITEM_WIDTH = SCREEN_WIDTH;

const CharacterListItem = ({ character }: CharacterListItem) => {
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);

  const stopLoading = () => setLoading(false);

  const onLoadStart = () => {
    // Invoked on load start.
    startLoading();
  };

  const onLoadEnd = () => {
    // Invoked when load either succeeds or fails.
    stopLoading();
  };

  const onError = ({ nativeEvent }) => {
    // Invoked on load error.
    console.log("onError: ", nativeEvent);
    // ! Set Error Source
    stopLoading();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText} allowFontScaling={false}>
        {character.name}
      </Text>
      <View style={styles.imageView}>
        {loading && <ActivityIndicator size={"large"} style={styles.loader} />}
        <Image
          source={{ uri: character?.image, cache: "force-cache" }}
          // loadingIndicatorSource={} // * displayed unless the source is ready to display
          style={styles.image}
          onError={onError}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: CHARACTER_LIST_ITEM_HEIGHT,
    width: CHARACTER_LIST_ITEM_WIDTH,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "darkslategrey",
    alignSelf: "center",
    marginVertical: 10,
  },
  imageView: {
    width: "100%",
    height: "100%",
    backgroundColor: "#dbeafe",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loader: {
    position: "absolute",
    zIndex: 1000,
    alignSelf: "center",
  },
});

export default memo(
  CharacterListItem,
  (prevProps, nextProps) => prevProps.character.id == nextProps.character.id
);
