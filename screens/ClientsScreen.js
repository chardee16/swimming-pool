// screens/ClientScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet,Button  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ClientsScreen({ route, navigation }) {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [blockFilter, setBlockFilter] = useState('');
  const [lotFilter, setLotFilter] = useState('');

  // useEffect(() => {
  //   fetch(`${BASE_URL}/clients`) // Update your backend route if needed
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setClients(data);
  //       setFilteredClients(data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching clients:', error);
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
  const fetchClients = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Get token from storage

      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`${BASE_URL}/clients/getallclient`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add token here
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }

      const data = await response.json();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  
  fetchClients();
  }, []);


  useEffect(() => {
  const filtered = clients.filter((client) => {
    const fullName = `${client.FirstName ?? ''} ${client.LastName ?? ''}`.toLowerCase();
    const matchesName = fullName.includes(searchQuery.toLowerCase());

    const matchesBlock =
      blockFilter === '' || (client.BlockNo != null && client.BlockNo.toString() === blockFilter);

    const matchesLot =
      lotFilter === '' || (client.LotNo != null && client.LotNo.toString() === lotFilter);

    return matchesName && matchesBlock && matchesLot;
  });

  setFilteredClients(filtered);
  }, [searchQuery, blockFilter, lotFilter, clients]);


  const clearFilters = () => {
    setSearchQuery('');
    setBlockFilter('');
    setLotFilter('');
  };

  const renderItem = ({ item }) => (
   <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Client Payment', { clientId: item.ClientID })}
   >
    
    <Text style={styles.name}>
      {item.FirstName} {item.MiddleName ? item.MiddleName + ' ' : ''}{item.LastName}
    </Text>
    <Text style={styles.name}>
      Block  {item.BlockNo} Lot  {item.LotNo}
    </Text>
  </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search by name..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TextInput
        style={styles.search}
        placeholder="Filter by Block"
        value={blockFilter}
        onChangeText={setBlockFilter}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.search}
        placeholder="Filter by Lot"
        value={lotFilter}
        onChangeText={setLotFilter}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
        <View style={styles.buttonContent}>
          <Ionicons name="close-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={filteredClients}
        keyExtractor={(item, index) =>
          item.ClientID != null ? item.ClientID.toString() : index.toString()
        }
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  name: {
    fontWeight: 'bold',
  },

  clearButton: {
  backgroundColor: '#007AFF',
  paddingVertical: 10,
  paddingHorizontal: 20,
  margin: 10,
  borderRadius: 8,
  alignItems: 'center',
},

clearButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
buttonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},

});