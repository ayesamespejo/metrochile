import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Dimensions, Image} from 'react-native';
import WebView from 'react-native-webview';
import Globals from './Globals';

const SCREEN_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: SCREEN_WIDTH * 0.08,
    // paddingHorizontal: SCREEN_WIDTH * 0.05,
    backgroundColor: '#FFFFFF',
  },
  boxPlano: {
    flex: 1,
  },
});

const NuevosProyectosPlano = props => {
  /**
   * Obtenemos el indice del proyecto heredado de la vista de nuevos proyectos
   */
  let planoDeRedPaso = props.route.params.planoDeRed;
  const [state, setState] = useState({
    planoDeRed: planoDeRedPaso,
  });

  useEffect(() => {
    console.log(planoDeRedPaso)
    props.navigation.setOptions({title: 'Nuevos proyectos'});
  }, [])

  const {planoDeRed} = state;

  return (
    <View style={styles.container}>
      <View style={styles.boxPlano}>
        <WebView source={planoDeRed}/>
        <Image />
      </View>
    </View>
  );
};

export default NuevosProyectosPlano;
