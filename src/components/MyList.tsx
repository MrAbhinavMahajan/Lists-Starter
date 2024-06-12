import React, { useCallback, useEffect, useRef, useState } from "react";
import CharacterListItem, {
  CHARACTER_LIST_ITEM_HEIGHT,
} from "./CharacterListItem";
import { ActivityIndicator, FlatList } from "react-native";

const MyList = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const initialPageUrl = "https://rickandmortyapi.com/api/character";
  const [pageURL, setPageURL] = useState(initialPageUrl);
  const abortController = new AbortController(); // API abort controller

  const listRef = useRef(null);

  const fetchItems = async (url: string) => {
    if (loading) {
      // * Throttling to avoid multiple API call at same time
      return;
    }
    console.log("Fetch Items::", url);
    setLoading(true);
    const response = await fetch(url, {
      signal: abortController.signal,
    });
    const responseJson = await response.json();
    setItems((existingItems) => [...existingItems, ...responseJson.results]);
    setPageURL(responseJson.info.next);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems(initialPageUrl);
    return () => {
      abortController.abort();
    };
  }, []);

  const onEndReached = () => {
    fetchItems(pageURL);
  };

  const onRefresh = () => {
    fetchItems(initialPageUrl);
  };

  const getItemLayout = (data, index) => ({
    length: CHARACTER_LIST_ITEM_HEIGHT,
    offset: (CHARACTER_LIST_ITEM_HEIGHT + 10) * index,
    index,
  });

  const renderItem = useCallback(
    ({ item }) => <CharacterListItem character={item} />,
    []
  );

  const onViewableItemsChanged = ({ changed, viewableItems }) => {
    changed.forEach((changedItem) => {
      if (changedItem?.isViewable) {
        console.log("++ Impression for: ", changedItem.item.id);
      }
    });
  };

  const scrollToIndex = (index: number) => {
    listRef?.current?.scrollToIndex({ index, viewPosition: 0, animated: true });
  };

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: {
        minimumViewTime: 500, // invoke item change when item is visible for more than 30 secs
        itemVisiblePercentThreshold: 50, // invoke item change when item is visible more than half of it
      },
      onViewableItemsChanged,
    },
  ]).current;

  return (
    <FlatList
      ref={listRef}
      data={items}
      renderItem={renderItem}
      contentContainerStyle={{ gap: 10 }}
      onEndReached={onEndReached}
      onEndReachedThreshold={3} // Used for customizing FlatList when to call onEndReached
      ListFooterComponent={() => loading && <ActivityIndicator />}
      refreshing={loading} // ! refreshing required for onRefresh
      onRefresh={onRefresh}
      initialNumToRender={3} // * To speed-up the initial mount
      keyExtractor={(item) => `${item?.id}`} // Unique key used for caching FlatList data
      getItemLayout={getItemLayout} // Reducing FlatList effort calculate layout for every item
      // windowSize={3} // * Larger for less blanked spaces & Smaller for saving Memory
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs} // ! Changing on the fly is not supported -> memoised item needed
    />
  );
};

export default MyList;

/*
# Observation-1
 * fetchItems was being called 2 times initially
(one call by useEffect and one call by onEndReached)

# Observation-2
 ! if there's nothing in the footer & data provided is empty then "onEndReached" won't be called
 * so it's important to have initial load using useEffect for fetching data

 # Observation-3
 * basically FlatList calls onEndReached when last item is fully visible
 ! user will scroll faster he will be able to see loading indicator for a while
 * as an improvement we can set onEndReachedThreshold for customizing FlatList when to call onEndReached 

# Observation-4
 * we won't be able to find onEndReached in React Native documentation since these are the properties of base class VirtualizedList
 */
