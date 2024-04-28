import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

interface SearchComponentProps {
  onSearch: (query: string) => void;
}
const SearchComponent: React.FC<SearchComponentProps> = ({onSearch}) => {
  const [query, setQuery] = useState('');

  const handleChange = (text: string) => {
    setQuery(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Bitcoin wallet address"
        onChangeText={handleChange}
        placeholderTextColor="grey"
        value={query}
      />
      <TouchableOpacity style={styles.button} onPress={() => onSearch(query)}>
        <Text style={styles.buttonText}>Look up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    width: '100%',
    borderColor: 'transparent',
    backgroundColor: '#24252C',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 50,
    color: '#fff',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#465AE9',
    width: '100%',
    padding: 16,
    textAlign: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SearchComponent;
