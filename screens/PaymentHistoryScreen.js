// screens/PaymentHistoryScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Alert, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function PaymentHistoryScreen({ route }) {
  const { clientId } = route.params;
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetch(`${BASE_URL}/payments/${clientId}`)
  //     .then(res => res.json())
  //     .then(data => {
  //       setPayments(data);
  //       setLoading(false);
  //     })
  //     .catch(err => {
  //       console.error('Error fetching payments:', err);
  //       setLoading(false);
  //     });
  // }, [clientId]);


  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Get token from storage

        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch(`${BASE_URL}/payments/${clientId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Add token here
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }

        const data = await response.json();
        setPayments(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

  
    fetchPaymentHistory();
  }, [clientId]);


  const handleDelete = async (paymentId) => {
  Alert.alert(
    'Confirm Deletion',
    'Are you sure you want to delete this payment?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
              alert('Authentication error. Please log in again.');
              return;
            }

            const response = await fetch(`${BASE_URL}/payments/${paymentId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error('Failed to delete payment');
            }

            // Remove item from UI
            setPayments((prev) => prev.filter((item) => item.id !== paymentId));
            alert('Payment deleted successfully.');
          } catch (err) {
            console.error('Error deleting payment:', err);
            alert('Failed to delete payment.');
          }
        },
      },
    ]
  );
};




  const renderItem = ({ item }) => (
    <View style={styles.paymentItem}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
          <Text>No. of Homeowner: {item.homeowner}</Text>
          <Text>No. of Guests: {item.guest}</Text>
          <Text>Total Amount: ₱{item.amount}</Text>
        </View>

        {item.isfetched === 0 && (
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment History</Text>
      {payments.length === 0 ? (
        <Text style={styles.noPayments}>No payments yet.</Text>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  noPayments: { fontStyle: 'italic', color: '#666' },

  paymentItem: {
    backgroundColor: '#e0f7fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  }

});
