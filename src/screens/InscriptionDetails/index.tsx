import React from 'react';
import {View, Text, StyleSheet, Image, ActivityIndicator} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import useOrdinalDetails from '../../hooks/useOrdinalDetails';
import Video from 'react-native-video';
import WebView from 'react-native-webview';

type OrdinalDetailsScreenProps = {
  route: {
    params: {
      inscriptionId: string;
      address: string;
    };
  };
};

const OrdinalDetailsScreen: React.FC<OrdinalDetailsScreenProps> = ({route}) => {
  const {inscriptionId, address} = route.params;
  const {inscriptionDetails, content, loading, error} = useOrdinalDetails(
    address,
    inscriptionId,
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#465AE9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load inscription details.
        </Text>
      </View>
    );
  }

  if (!inscriptionDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Inscription details not found.</Text>
      </View>
    );
  }
  const renderContent = (content: any) => {
    if (
      typeof content === 'string' ||
      (content && typeof content === 'object' && content.hasOwnProperty('url'))
    ) {
      return renderMediaContent(content);
    }
  };

  const renderMediaContent = (content: any) => {
    if (content.url) {
      if (inscriptionDetails.content_type?.includes('video')) {
        return (
          <Video
            controls
            paused={false}
            source={{uri: content.url}}
            style={styles.image}
          />
        );
      } else {
        return (
          <Image
            source={{uri: content.url}}
            style={styles.image}
            resizeMode={'cover'}
          />
        );
      }
    } else if (content.includes('<script')) {
      const dataCollectionRegex = /data-collection="([^"]+)"/;
      const dataSrcRegex = /src="([^"]+)"/;
      const dataPRegex = /data-p="([^"]+)"/;
      const matches = dataCollectionRegex.exec(content);
      const matchesSrc = dataSrcRegex.exec(content);
      const matchesP = dataPRegex.exec(content);

      if (matches) {
        const src = matches[1];
        return (
          <Image
            source={{uri: `https://ord.xverse.app/content/${src}`}}
            resizeMode="cover"
            style={styles.image}
          />
        );
      } else if (matchesP) {
        const src = matchesP[1].split(',')[0];
        return (
          <Image
            source={{uri: `https://ord.xverse.app/content/${src}`}}
            resizeMode="cover"
            style={styles.image}
          />
        );
      } else if (matchesSrc) {
        const src = matchesSrc[1];
        return (
          <WebView
            source={{uri: `https://ord.xverse.app${src}`}}
            style={{flex: 1, height: 200}}
          />
        );
      }
    } else if (content.includes('<html>')) {
      return (
        <WebView source={{uri: `content`}} style={{flex: 1, height: 200}} />
      );
    }
    return <Text style={styles.viewText}>{content}</Text>;
  };

  return (
    <ScrollView style={styles.container}>
      {renderContent(content)}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Inscription {inscriptionDetails.number}
        </Text>
        <DetailItem title="Inscription ID" value={inscriptionDetails.id} />
        <DetailItem title="Owner Address" value={address} />
        <Text style={styles.title}>Attributes</Text>
        <DetailItem
          title="Output Value"
          value={inscriptionDetails.genesis_fee}
        />
        <DetailItem
          title="Content Type"
          value={inscriptionDetails.content_type}
        />
        <DetailItem
          title="Content Length"
          value={inscriptionDetails.content_length}
        />
        <DetailItem title="Location" value={inscriptionDetails.location} />
        <DetailItem
          title="Genesis Transaction"
          value={inscriptionDetails.genesis_tx_id}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  image: {
    width: '100%',
    height: 300,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    borderBottomWidth: 1,
    marginVertical: 16,
    borderBottomColor: '#CDCDCD',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
    opacity: 0.7,
    marginTop: 10,
  },
  text: {
    fontSize: 14,
    color: 'white',
    marginBottom: 16,
    lineHeight: 0,
  },
  itemContainer: {
    borderRadius: 8,
    backgroundColor: '#24252C',
    paddingHorizontal: 16,
    paddingVertical: 2,
    height: 40,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  itemText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 0,
  },
  viewText: {
    margin: 16,
    fontSize: 14,
    color: 'white',
  },
});

const DetailItem = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <>
    <Text style={styles.subtitle}>{title}</Text>
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{value}</Text>
    </View>
  </>
);

export default OrdinalDetailsScreen;
