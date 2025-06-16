// screens/ClientDetailScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Switch } from 'react-native';

export default function ClientDetailScreen({ route }) {
  const { clientId } = route.params;
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientType, setClientType] = useState(null); // 'homeowner' or 'guest'
  const navigation = useNavigation();
  const [homeownerCount, setHomeownerCount] = useState(0);
  const [guestCount, setGuestCount] = useState(0);
  const [isPaid, setIsPaid] = useState(false);

  const totalAmount = homeownerCount * 30 + guestCount * 70;

  // useEffect(() => {
  //   fetch(`${BASE_URL}/clients/${clientId}`)
  //     .then(res => res.json())
  //     .then(data => {
  //       setClient(data);
  //       setLoading(false);
  //     })
  //     .catch(err => {
  //       console.error('Error fetching client:', err);
  //       setLoading(false);
  //     });
  // }, [clientId]);


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Get token from storage

        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch(`${BASE_URL}/clients/${clientId}`, {
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
        setClient(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

  
    fetchClients();
  }, [clientId]);


  

  
  const handleAddPayment = async () => {
    if (homeownerCount === 0 && guestCount === 0) {
        alert('Please add at least one pool user.');
        return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('Authentication error. Please log in again.');
        return;
      }

      const response = await fetch(`${BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Token is added here
        },
        body: JSON.stringify({
          clientId: clientId,
          amount: totalAmount, // fixed flat fee
          type: 0,
          homeowners: homeownerCount,
          guests: guestCount,
          date: new Date(),
          ispaid: isPaid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record payment');
      }

      const data = await response.json();
      alert('Payment recorded!');
      navigation.navigate('Client List');

    } catch (err) {
      console.error('Error recording payment:', err);
      alert('Failed to record payment');
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (!client) return <Text>Client not found.</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.clientInfoCard}>
        <Text style={styles.name}>{client.FirstName} {client.LastName}</Text>
        <Text style={styles.address}>Block {client.BlockNo}, Lot {client.LotNo}</Text>
      </View>

    <Text style={styles.label}>Select Pool Users:</Text>

    <View style={styles.counterRow}>
      <Text style={styles.counterLabel}>Homeowners</Text>
      <View style={styles.counterControls}>
        <TouchableOpacity onPress={() => setHomeownerCount(Math.max(0, homeownerCount - 1))}>
          <Ionicons name="remove-circle-outline" size={30} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.counterValue}>{homeownerCount}</Text>
        <TouchableOpacity onPress={() => setHomeownerCount(homeownerCount + 1)}>
          <Ionicons name="add-circle-outline" size={30} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.counterRow}>
      <Text style={styles.counterLabel}>Guests</Text>
      <View style={styles.counterControls}>
        <TouchableOpacity onPress={() => setGuestCount(Math.max(0, guestCount - 1))}>
          <Ionicons name="remove-circle-outline" size={30} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.counterValue}>{guestCount}</Text>
        <TouchableOpacity onPress={() => setGuestCount(guestCount + 1)}>
          <Ionicons name="add-circle-outline" size={30} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.totalContainer}>
      <Text style={styles.totalLabel}>Total Amount</Text>
      <Text style={styles.totalAmount}>₱{totalAmount}</Text>
    </View>

    <View style={styles.checkboxRow}>
      <Text style={styles.checkboxLabel}>Mark as Paid</Text>
      <Switch
        value={isPaid}
        onValueChange={setIsPaid}
        trackColor={{ false: '#ccc', true: '#007AFF' }}
        thumbColor={isPaid ? '#007AFF' : '#f4f3f4'}
      />
    </View>

      <TouchableOpacity style={styles.clearButton} onPress={handleAddPayment} >
        <View style={styles.buttonContent}>
          <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.clearButtonText}>Add Pool Usage Payment</Text>
        </View>
      </TouchableOpacity>
      
      
      <TouchableOpacity style={styles.clearButton} onPress={() => navigation.navigate('Payment History', { clientId })}>
        <View style={styles.buttonContent}>
          <Ionicons name="aperture-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.clearButtonText}>View Payment History</Text>
        </View>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  padding: 20,
  backgroundColor: '#F5F7FA', // soft light background
  flex: 1,
},

clientInfoCard: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 16,
  marginBottom: 25,
  // subtle shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 6,
  borderWidth: 1,
  borderColor: '#ddd',
  alignItems: 'center',
},

name: {
  fontSize: 26,
  fontWeight: '700',
  color: '#222',
  marginBottom: 8,
},

address: {
  fontSize: 16,
  color: '#555',
},
  
label: {
  fontSize: 20,
  fontWeight: '600',
  color: '#444',
  marginBottom: 15,
  paddingLeft: 8,
},

  buttonRow: { flexDirection: 'row', marginVertical: 10 },
  typeButton: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  selected: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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



  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  counterLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },

  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  counterValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginHorizontal: 10,
    minWidth: 40,
    textAlign: 'center',
  },


  totalContainer: {
  marginVertical: 20,
  alignItems: 'center',
  backgroundColor: '#f0f8ff',
  padding: 15,
  borderRadius: 10,
  borderColor: '#007AFF',
  borderWidth: 1,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 3,
  },

  totalLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },

  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },


  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },

  checkboxLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },

});
