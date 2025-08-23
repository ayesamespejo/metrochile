import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  Platform,
  ScrollView,
  Image,
  Pressable,
  Linking
} from 'react-native'

import Globals from '../Globals';
import Estilos from '../Estilos';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import CargaBipHome from '../assets/svg/home/CargaBip-Home.svg';
import RutaExpresHome from '../assets/svg/home/RutaExpresa-Home.svg';
import PlanificadorDeViaje from '../assets/svg/home/PlanificadorDeViaje.svg';
import PlanoDeLaRedHome from '../assets/svg/home/PlanoDeLaRed-Home.svg';
import TarifasHome from '../assets/svg/home/Tarifas-Home.svg';
import CulturaComunidadHome from '../assets/svg/home/CulturaComunidad-Home.svg';
import MetroQR from '../assets/svg/pasaje_QR/MetroQR.svg';
import ManoHome from '../assets/svg/home/Mano-Home.svg';
import Linea1 from '../assets/svg/lineas/Linea1.svg';
import Linea2 from '../assets/svg/lineas/Linea2.svg';
import Linea3 from '../assets/svg/lineas/Linea3.svg';
import Linea4 from '../assets/svg/lineas/Linea4.svg';
import Linea4A from '../assets/svg/lineas/Linea4A.svg';
import Linea5 from '../assets/svg/lineas/Linea5.svg';
import Linea6 from '../assets/svg/lineas/Linea6.svg';
import Linea7 from '../assets/svg/lineas/Linea7.svg';
import Linea8 from '../assets/svg/lineas/Linea8.svg';
import Linea9 from '../assets/svg/lineas/Linea9.svg';
import CerrarCirculo from '../assets/svg/estados_linea/ErrorBorde.svg';
import CheckCirculo from '../assets/svg/estados_linea/BuenoBorde.svg';
import ExclamasionCirculo from '../assets/svg/estados_linea/AlertaBorde.svg';
import { useNavigation } from "@react-navigation/native";
import CarouselHome from "./CarouselHome";

const iconoEstado = (estado) => {
    switch (estado) {
      case '0':
        return <CheckCirculo width={40} height={40} fill={Globals.COLOR.L5} />
      case '1':
        return <CheckCirculo width={40} height={40} fill={Globals.COLOR.L5} />
      case '2':
        return <ExclamasionCirculo width={40} height={40} fill={Globals.COLOR.L2} />
      case '3':
        return <CerrarCirculo width={40} height={40} fill={Globals.COLOR.ROJO_METRO} />
      case '4':
        return <ExclamasionCirculo width={40} height={40} fill={Globals.COLOR.L2} />
    }
  }

const CuadroCarusel = ({ item, itemWidth, itemHeight, isLandScape }) => {
  const navigation = useNavigation();

  let dynamicStyle = isLandScape
    ? { width: itemWidth * 0.95, height: 100 }
    : { width: itemWidth / 2, height: itemHeight / 2, marginLeft: 65 };
  if (!item) return null;

    const numeroLinea = item.title.toString().substring(1).toUpperCase();
    const nombreEstilo = item.styleName.toUpperCase();

    return (
      <Pressable
        onPress={() =>
          navigation.push('Estado de la Red', {
            lineaActualinicial: item.title,
            lineaActualPosicionInicial: item.data[0].sectionIndex,
          })
        }
      >
        <View style={[dynamicStyle]} key={`linea_${Math.round(Math.random() * 1000)}`}>
          {numeroLinea == '1' && <Linea1 width={104} height={104} />}
          {numeroLinea == '2' && <Linea2 width={104} height={104} />}
          {numeroLinea == '3' && <Linea3 width={104} height={104} />}
          {numeroLinea == '4' && <Linea4 width={104} height={104} />}
          {numeroLinea == '4A' && <Linea4A width={104} height={104} />}
          {numeroLinea == '5' && <Linea5 width={104} height={104} />}
          {numeroLinea == '6' && <Linea6 width={104} height={104} />}
          {numeroLinea == '7' && <Linea7 width={104} height={104} />}
          {numeroLinea == '8' && <Linea8 width={104} height={104} />}
          {numeroLinea == '9' && <Linea9 width={104} height={104} />}
          <View style={{ positin: 'absolute', marginStart: 77, marginTop: -105 }}>{iconoEstado(item.estado)}</View>
        </View>
      </Pressable>
    )
  }


const Home = (props) => {
     /** Estructura dinamica para determinar el tamaño */
  const window = Dimensions.get('window');

  const calculateDimensions = ({ height, width }) => ({
    sliderWidth: width,
    sliderHeight: height,
    itemWidth: Math.round(width / 3.8),
    itemHeight: Math.round((Math.round(width / 3.8) * 3) / 3),
    isLandScape: width < height,
  });

  const [carousel, setCarousel] = useState(null)
  const [botonSeleccionado, setBotonSeleccionado] = useState('all')
  const [index, setIndex] = React.useState(0)
  const isCarousel = React.useRef(null)
  const [lineaActual, setLineaActual] = useState('l1')
  const [mostrarCarousel, setMostrarCarousel] = useState(false);
  const [state, setState] = useState({
    ...calculateDimensions(window),
    dimensions: {
      window,
    },
    data: [],
    superData: [],
    index: 1,
    opacity: 0,
    loading: true,
    urlRutaExpresa: `${Globals.MAIN_URL}/api/estadoRedDetalle.php`,
    // Se genera una propiedad para vincularla al Texto del Buscador.
  })

  console.log('superData ', superData);

  useEffect(() => {
    initCarousel()
    // const _refrescoLineas = setInterval(() => {
    //   updateData();
    // }, 5000);
    const dimensionsSubscription = Dimensions.addEventListener('change', onChange)
    updateData()
    const _unsubscribe = props.navigation.addListener('focus', () => {
      updateData()
    })
    return () => {
      _unsubscribe()
      dimensionsSubscription?.remove()
      // if( _refrescoLineas) {
      //   clearInterval(_refrescoLineas)
      // }
    }
  }, [])

  useEffect(() => {
    initCarousel()
    initLineasFiltradasParaCombinaciones()
  })

    const [posts, setPosts] = useState([]);
    const fetchPosts = async () => {
  try {
    const response = await fetch('https://www.metro.cl/api/estadoRedDetalle.php');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const test = data ? data?.l1?.estaciones[0] : '';
    setPosts(test);
  
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return null;
  }
};



   useEffect(() => {
    fetchPosts();
  }, []);

  const initLineasFiltradasParaCombinaciones = () => {
    const { data, superData, loading } = state
    if (data.length != 0 && superData.length == 0 && loading) {
      let lineasFiltradas = data
      setState({ ...state, loading: false, superData: lineasFiltradas })
    }
  }

   const initCarousel = () => {
    if (state.opacity == 0 && state.loading == false) {
      carousel?.snapToItem(1)
      setState({ ...state, opacity: 1 })
    }
  }

  const onChange = ({ window: windowPaso }) => {
    setState({
      ...state,
      dimensions: { windowPaso },
      ...calculateDimensions(windowPaso),
    })
  }

  const updateData = () => {
    const { urlRutaExpresa } = state
    fetch(urlRutaExpresa)
      .then((response) => response.json())
      .then((json) => {
        var dataJson = json
        var d = []
        var sectionIndex = 0
        for (var i in dataJson) {
          if (i == 'id') {
            continue
          }
          var item = new Object()
          item.title = i
          item.styleName = i
          item.estado = dataJson[i].estado
          item.status = dataJson[i].mensaje_app
          item.isRutaExpresa = dataJson[i].estaciones.some((itemPaso) => itemPaso.ruta_expresa)
          item.data = dataJson[i].estaciones.map((e) => {
            var obj = new Object()
            obj.title = e.nombre
            obj.status = e.descripcion_app
            obj.linea = i
            obj.visible = false
            obj.sectionIndex = sectionIndex
            obj.estado = e.estado
            obj.codigo = e.codigo
            obj.combinacion = e.combinacion
            obj.ruta_expresa = e.ruta_expresa
            return obj
          })
          d.push(item)
          sectionIndex++
        }
        setState({ ...state, data: d })
      })
      .catch((error) => console.error(error))
      .finally(() => {})
  }


   

  const { superData, loading, sliderHeight, sliderWidth, itemHeight, itemWidth, isLandScape } = state;
  const carouselItemWidth = itemWidth;

  /*if (!loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: sliderHeight / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  }*/
 console.log('superData ', superData);
 

  function getInputRangeFromIndexes(range, index, carouselProps) {
    const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth
    let inputRange = []
    for (let i = 0; i < range.length; i++) {
      inputRange.push((index - range[i]) * sizeRef)
    }
    return inputRange
  }

  const scrollInterpolator2 = (index, carouselProps) => {
    const range = [1, 0, -1]
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps)
    const outputRange = range
    return { inputRange, outputRange }
  }

  const animatedStyles2 = (index, animatedValue, carouselProps) => {
    return {
      opacity: animatedValue.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [1, 1, 1],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [0.8, 0.8, 0.8],
          }),
        },
      ],
    }
  }

  const navigationThroughMenu = (title) => {
    console.log('Navigating to:', title.replace('_', ''));
    props.navigation.push(title, { screen: title.replace('_', '') })
  }

  /**
   * Seccion del Carousel
   */
  const carouselView = (
    
    <View style={[styles.carrusel]}>
      {}
      <Carousel
        ref={isCarousel}
        data={superData}
        renderItem={({ item }) => (
    <CuadroCarusel
      item={item}
      itemWidth={itemWidth}
      itemHeight={itemHeight}
      isLandScape={isLandScape}
    />
  )}
        sliderWidth={sliderWidth}
        itemWidth={carouselItemWidth}
        firstItem={index}
        layoutCardOffset={30}
        containerCustomStyle={[styles.carouselContainer, { opacity: 1 }]}
        onSnapToItem={(indexPaso) => {
          setBotonSeleccionado('all')
          setState({ ...state, index: indexPaso })
          setIndex(indexPaso)
          setLineaActual(superData[indexPaso].title)
        }}
        crollInterpolator={scrollInterpolator2}
        slideInterpolatedStyle={animatedStyles2}
        useScrollView={true}
        loop={true}
      />
      {/** Estos son los botonsitos de la paginacion */}
      <Pagination
        dotsLength={superData.length}
        activeDotIndex={index}
        carouselRef={isCarousel}
        containerStyle={styles.paginationContainer}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.92)',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        tappableDots={true}
      />
    </View>
  )


  

  /**
   * Formato LandScape - Vertical para el Telefono que inicializa con un SafeAreaView
   */
  if (isLandScape) {
    return (
      <View style={{ flex: 1, height: 300 }}>
        <View style={[styles.fondoTitulo]}>
          <Text style={[Estilos.textoTitulo, { marginTop: 20, marginLeft: 20, marginBottom: 10 }]}>
            Estado de la red
          </Text>
        </View>
        {/*carouselView*/}
        {<CarouselHome data={superData}/>}
        <Text style={[Estilos.textoTitulo, { top: 20, left: 20, marginBottom: 20 }]}>Accesos directos</Text>
        <View style={[styles.container]}>
          <ScrollView>            
            <View style={[styles.fila]}>              
              <Pressable onPress={() => navigationThroughMenu('Ruta Expresa')}>
                <View style={styles.cardContainerOpcion}>
                  <RutaExpresHome fill={Globals.COLOR.ROJO_METRO} style={styles.imagenSVGMayor} />
                  <Text style={[Estilos.textoGeneral, styles.opcion, { lineHeight: 18 }]}>Ruta{'\n'}expresa</Text>
                </View>
              </Pressable>
              <Pressable onPress={() => navigationThroughMenu('Planificador de Viajes')}>
                <View style={styles.cardContainerOpcion}>
                  <PlanificadorDeViaje fill={Globals.COLOR.ROJO_METRO} style={styles.imagenSVG} />
                  <Text style={[Estilos.textoGeneral, styles.opcion, { lineHeight: 18 }]}>
                    Planificador{'\n'}de viajes
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={() => navigationThroughMenu('Plano de Red')}>
                <View style={styles.cardContainerOpcion}>
                  <PlanoDeLaRedHome fill={Globals.COLOR.ROJO_METRO} style={styles.imagenSVG} />
                  <Text style={[Estilos.textoGeneral, styles.opcion, { lineHeight: 18 }]}>Plano{'\n'}de red</Text>
                </View>
              </Pressable>

            </View>
            <View style={[styles.fila]}>
              <Pressable onPress={() => navigationThroughMenu('Tarifas')}>
                <View style={styles.cardContainerOpcion}>
                  <TarifasHome fill={Globals.COLOR.ROJO_METRO} style={styles.imagenSVG} />
                  <Text style={[Estilos.textoGeneral, styles.opcion, { lineHeight: 18 }]}>Tarifas</Text>
                </View>
              </Pressable>
              <Pressable onPress={() => navigationThroughMenu('Consulta bip!_')}>
                <View style={styles.cardContainerOpcion}>
                  <CargaBipHome fill={Globals.COLOR.ROJO_METRO} style={styles.imagenSVGMayor} />
                  <Text style={[Estilos.textoGeneral, styles.opcion, { lineHeight: 18 }]}>Consulta y carga bip!</Text>
                </View>
              </Pressable>            
             <Pressable
                onPress={() => {
                  if (Platform.OS == 'ios') {
                    console.log('Intentando abrir App desde IOS...')
                    Linking.canOpenURL('metromuv://').then((posible) => {
                      console.log('Verificando: ', posible)
                      if (posible) {
                        console.log('Abriendo App..')
                        Linking.openURL('metromuv://')
                      } else {
                        Linking.openURL('https://apps.apple.com/us/app/metroqr/id6501962024')
                      }
                    })
                  } else {
                    console.log('Intentando abrir App desde Android...')
                    Linking.canOpenURL('metromuv://').then((posible) => {
                      console.log('Verificando: ', posible)
                      if (posible) {
                        console.log('Abriendo App..')
                        Linking.openURL('metromuv://')
                      } else {
                        Linking.openURL('https://play.google.com/store/apps/details?id=cl.metromuv.app')
                      }
                    })
                  }
                }}
              >
                <View style={[styles.cardContainerOpcion, { alignItems: 'center', justifyContent: 'center' }]}>
                  <MetroQR fill={Globals.COLOR.ROJO_METRO} style={[styles.imagenSVGMayor, { width: 50, height: 50 }]} />
                </View>
              </Pressable>
              
            </View>
            <View style={[styles.fila]}>  
                       
              <Pressable onPress={() => navigationThroughMenu('Cultura y Comunidad')}>
                <View style={styles.cardContainerOpcion}>
                  <CulturaComunidadHome fill={Globals.COLOR.ROJO_METRO} style={styles.imagenSVG} />
                  <Text style={[Estilos.textoGeneral, styles.opcion, { lineHeight: 18 }]}>Cultura y comunidad</Text>
                </View>
              </Pressable>
              <Pressable onPress={() => Linking.openURL(`tel:1488`)}>
                <View style={styles.cardContainerOpcion1488}>
                  <ManoHome fill="#FFFFFF" style={styles.imagenSVG} />
                  <Text style={[Estilos.textoBotonLlamadaTelefono, styles.opcionLlamar]}>1488</Text>
                </View>
              </Pressable>              
            </View>            
          </ScrollView>
        </View>
      </View>
    )
  }
}


export default Home;

/**
 * Dimensiones de la pantalla
 */
const SLIDER_HEIGHT = Dimensions.get('window').height;
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 0.75);

let styles = StyleSheet.create({
  fondoTitulo: {
    backgroundColor: '#FFFFFF',
  },
  titulo: {
    marginTop: 20,
    marginLeft: 20,
  },
  carouselContainer: {
    marginTop: 10,
    marginBottom: -20,
  },
  paginationContainer: {
    marginBottom: -10,
  },
  container: {
    flex: 1,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '2%',
    position: 'relative',
    height: ITEM_HEIGHT,
    paddingBottom: 15,
  },
  cardContainerOpcion: {
    borderRadius: 20,
    width: 96,
    height: 98,
    maxHeight: 98,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
    marginHorizontal: 8,
  },
  cardContainerOpcion1488: {
    borderRadius: 20,
    width: 96,
    height: 98,
    maxHeight: 98,
    backgroundColor: Globals.COLOR.ROJO_METRO,
    justifyContent: 'flex-start',
    marginHorizontal: 8,
  },
  imagen: {
    width: 30,
    height: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 20,
  },
  imagenSVG: {
    width: 30,
    height: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 20,
  },
  imagenMayor: {
    width: 40,
    height: 40,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
    marginBottom: 15,
  },
  imagenSVGMayor: {
    width: 40,
    height: 40,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
    marginBottom: 15,
  },
  imagenPronto: {
    width: 60,
    height: 60,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
    marginBottom: 10,
  },
  opcion: {
    // fontFamily: 'Helvetica-Bold',
    marginLeft: 'auto',
    marginRight: 'auto',
    bottom: 10,
    textAlign: 'center',
  },
  opcionDeshablitada: {
    marginLeft: 'auto',
    marginRight: 'auto',
    bottom: 10,
    textAlign: 'center',
    fontSize: 16,
    color: '#9E9E9E',
  },
  opcionLlamar: {
    //fontFamily: 'Helvetica-Bold',
    marginLeft: 'auto',
    marginRight: 'auto',
    bottom: 10,
    textAlign: 'center',
    //fontSize: 25,
    color: '#FFFFFF',
  },
  fila: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  carrusel: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
})