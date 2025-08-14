import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
} from 'react-native';
import TituloCirculoEstacion from './js/components/TituloCirculoEstacion';
import Estilos from './Estilos';
/**
 * Parametros Dimensionales para la vista.
 */
const SCREEN_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: SCREEN_WIDTH * 0.9,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  titulo: {
    alignItems: 'center', 
    marginTop: SCREEN_WIDTH * 0.08,
  },
  boxImage: {
    flex: 1,
    marginTop: SCREEN_WIDTH * 0.05,
  },
  imgIcon: {
    width: 80,
    height: 96,
    alignSelf: 'center',
    marginTop: 10,
  },
  imgPlano: {
    borderRadius: 20,
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
    //resizeMode: 'stretch',
  },
  boxText: {
    width: SCREEN_WIDTH * 0.86,
    alignSelf: 'center',
    marginTop: SCREEN_WIDTH * 0.93,
  },
  textInsideTheBox: [
    Estilos.textoGeneral,
    {
      textAlign: 'justify',
    },
  ],
});

const NuevosProyectosImagenes = props => {
  /**
   * Obtenemos la informacion necesaria para que aparezca la imagen y el titulo de la estacion.
   */
  let {estacion, linea} = props.route.params;
  let tituloPaso = estacion[0];
  /**
   * Nos traemos la imagen.
   */
  let imgUrlPaso = {uri: estacion[1].imagen};
  /**
   * Nos traemos la icono.
   */
  let iconUrlPaso =
    estacion[1].icono != '' ? {uri: estacion[1].icono} : undefined;
  const [state, setState] = useState({
    titulo: tituloPaso,
    imgUrl: imgUrlPaso,
    iconUrl: iconUrlPaso,
  });

  useEffect(() => {
    props.navigation.setOptions({title: 'Nuevos proyectos'});
    console.log(JSON.stringify(estacion))
  }, [])

  const {titulo, imgUrl, iconUrl} = state;

  return (
    <View styles={[styles.container]}>
      {/**
       * Si el Icono existe entonces lo agregamos a la vista.
       */}
      {iconUrl && (
        <View>
          <Image style={styles.imgIcon} source={iconUrl} />
        </View>
      )}
      <View style={[styles.titulo, {alignSelf: 'center'}]}>
      <TituloCirculoEstacion linea={linea} texto={titulo}/>
      </View>
      {/* <Text style={[styles.title]}>{titulo}</Text> */}
      <View>
        <View style={styles.boxImage}>
          <Image style={styles.imgPlano} source={imgUrl} />
        </View>
        <View style={[styles.boxText]}>
          <Text style={styles.textInsideTheBox}>
            Esta imagen es una representación gráfica. Las distancias son
            aproximadas. La ubicación final puede variar en algunos metros.{' '}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NuevosProyectosImagenes;
