import React from 'react';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';

const BiciMetroReglamento = props => {
  const data = props.route.params.data;

  props.navigation.setOptions({title: 'BiciMetro'});

  /**
   * El indice 6 de lo que viene en estacion, es la posicion del PDF
   */
  const pdfUrl = data.estacion[0][6];

  return (
    <View style={{flex: 1}}>
      <WebView
        source={{
          uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=${pdfUrl}`,
        }}
      />
    </View>
  );
};

export default BiciMetroReglamento;
