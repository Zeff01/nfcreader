import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import NfcManager, {NfcTech, NfcEvents} from 'react-native-nfc-manager';

NfcManager.start();

function App(): React.JSX.Element {
  const [tagData, setTagData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    NfcManager.start();
    return () => {
      // Use cancelTechnologyRequest for cleanup instead of the non-existent stop method
      NfcManager.cancelTechnologyRequest().catch(() => {
        console.warn('Error cancelling NFC tech request');
      });
    };
  }, []);

  async function startScan() {
    setIsScanning(true); // Start scanning
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.log('Tag found:', tag);
      setTagData(tag); // Store the tag data
    } catch (ex) {
      console.warn('Error scanning for NFC tag:', ex);
      alert(`Error scanning for NFC tag: ${ex.toString()}`);
    } finally {
      NfcManager.cancelTechnologyRequest();
      setIsScanning(false); // Stop scanning
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={startScan}
        disabled={isScanning}>
        <Text style={styles.buttonText}>
          {isScanning ? 'Scanning...' : 'Scan NFC Tag'}
        </Text>
      </TouchableOpacity>

      {isScanning && <ActivityIndicator size="large" color="#0000ff" />}

      {tagData && (
        <View style={styles.tagDataContainer}>
          <Text style={styles.tagDataTitle}>Tag Data:</Text>
          {Object.entries(tagData).map(([key, value]) => (
            <Text
              key={key}
              style={styles.tagDataText}>{`${key}: ${value}`}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  tagDataContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  tagDataTitle: {
    fontWeight: 'bold',
  },
  tagDataText: {
    textAlign: 'left',
  },
});

export default App;
