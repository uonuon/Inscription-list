import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const PaginationLoader: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
});

export default PaginationLoader;
