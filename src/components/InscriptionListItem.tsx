import React from 'react';
import {Image, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface InscriptionListItemProps {
  inscription: string;
  onPress: () => void;
}

const InscriptionListItem: React.FC<InscriptionListItemProps> = ({
  inscription,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>Inscription {inscription.substring(0, 6)}</Text>
      <Image
        style={styles.image}
        source={require('../assets/right-arrow.png')}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  image: {
    width: 10,
  },
});

export default InscriptionListItem;
