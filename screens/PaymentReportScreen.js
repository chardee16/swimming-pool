import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function PaymentReportScreen() {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [payments, setPayments] = useState([]);

  // const fetchReport = () => {
    
  //   const formatDate = (date) => date.toISOString().split('T')[0]; // 'YYYY-MM-DD'

  //   fetch(`${BASE_URL}/payments?from=${formatDate(fromDate)}&to=${formatDate(toDate)}`)
  //     .then(res => res.json())
  //     .then(data => setPayments(data))
  //     .catch(err => {
  //       console.error('Error fetching report:', err);
  //       alert('Failed to load report');
  //     });
  // };


  const fetchReport = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Get token from storage

      if (!token) {
        console.error('No token found');
        return;
      }
      const formatDate = (date) => date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
      //const response = await fetch(`${BASE_URL}/payments?from=${formatDate(fromDate)}&to=${formatDate(toDate)}`, {
      const response = await fetch(`${BASE_URL}/payments/fetchpayment`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add token here
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      const data = await response.json();
      
      console.log(data);
      setPayments(data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } 

  };

  // useEffect(() => {
  //   fetchReport();
  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Date Range</Text>

      <View style={styles.dateRow}>
        <TouchableOpacity onPress={() => setShowFromPicker(true)} style={styles.dateBox}>
          <Text>From: {fromDate.toDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowToPicker(true)} style={styles.dateBox}>
          <Text>To: {toDate.toDateString()}</Text>
        </TouchableOpacity>
      </View>

      {showFromPicker && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowFromPicker(false);
            if (selectedDate) setFromDate(selectedDate);
          }}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          value={toDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowToPicker(false);
            if (selectedDate) setToDate(selectedDate);
          }}
        />
      )}

      <Button title="Generate Report" onPress={fetchReport} />

      <FlatList
        data={payments}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 20 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 10 }}>No payments found.</Text>}
        renderItem={({ item }) => (
          <View style={styles.paymentItem}>
            <Text>{item.Fullname}</Text>
            <Text>Homeowner: {item.homeowner}</Text>
            <Text>Guest: {item.guest}</Text>
            <Text>₱{item.amount}</Text>
            <Text>{new Date(item.date).toDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#F9F9F9' },
  label: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  dateBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  paymentItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderColor: '#eee',
    borderWidth: 1,
  },
});
