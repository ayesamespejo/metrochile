import React from 'react';
import {View, Text} from 'react-native';
import {styles} from '../../styles/incidentForm.styles';

export const SectionCard = ({title, children}) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <View style={styles.cardBody}>{children}</View>
  </View>
);
