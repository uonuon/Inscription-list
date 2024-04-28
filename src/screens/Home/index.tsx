import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import {useNavigation, RouteProp} from '@react-navigation/native';
import SearchComponent from '../../components/Search';
import InscriptionListItem from '../../components/InscriptionListItem';
import PaginationLoader from '../../components/PaginationLoader';
import useInscriptions, {
  Inscription,
  UseInscriptionsResult,
} from '../../hooks/useInscription';

type HomeProps = {};

const Home: React.FC<HomeProps> = () => {
  const [address, setAddress] = useState<string>('');
  const {inscriptions, loading, loadMore, error}: UseInscriptionsResult =
    useInscriptions(address);
  const navigation = useNavigation<any>();

  const handleSearch = (query: string) => {
    setAddress(query);
  };

  const handleInscriptionPress = (inscription: Inscription) => {
    navigation.navigate('OrdinalDetails', {
      inscriptionId: inscription.id,
      address,
    });
  };

  const renderInscriptionItem = ({item}: {item: Inscription}) => {
    return (
      <InscriptionListItem
        inscription={item.id}
        onPress={() => handleInscriptionPress(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={<SearchComponent onSearch={handleSearch} />}
        data={inscriptions}
        renderItem={renderInscriptionItem}
        keyExtractor={item => item.id}
        onEndReached={loadMore}
        ListEmptyComponent={<Text style={styles.error}>{error}</Text>}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <PaginationLoader /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 16,
  },
  error: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Home;
