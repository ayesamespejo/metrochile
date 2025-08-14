import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Globals from './Globals';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {
  scrollInterpolator,
  animatedStyles,
} from './js/utils/carouselAnimations';

import Linea from './EstadoDeLaRed';
import EstadoDeLaRed from './EstadoDeLaRed';

/** Estructura dinamica para determinar el tamaño */
const window = Dimensions.get('window');

const RutaExpresa = props => {
  const [carousel, setCarousel] = useState(null);
  const [botonSeleccionado, setBotonSeleccionado] = useState('all');
  const [index, setIndex] = React.useState(0);
  const isCarousel = React.useRef(null);
  const [lineaActual, setLineaActual] = useState('l1');
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
    urlRutaExpresa:
      'https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/ruta',
    // Se genera una propiedad para vincularla al Texto del Buscador.
  });

  useEffect(() => {
    const dimensionsSubscription = Dimensions.addEventListener(
      'change',
      onChange,
    );
    updateData();
    const _unsubscribe = props.navigation.addListener('focus', () => {
      updateData();
    });
    return () => {
      _unsubscribe();
      dimensionsSubscription?.remove();
    };
  }, []);

  useEffect(() => {
    initCarousel();
    initLineasFiltradasParaCombinaciones();
  });

  const CuadroCarusel = ({item}) => {
    const {itemWidth, itemHeight, isLandScape, sinuso} = state;
    let dynamicStyle = isLandScape
      ? {
          width: itemWidth,
          height: itemHeight,
        }
      : {
          width: itemWidth / 2,
          height: itemHeight / 2,
          marginLeft: 65,
        };

    if (!item) {
      return <></>;
    }
    const numeroLinea = item.title.toString().substring(1).toUpperCase();
    const nombreEstilo = item.styleName.toUpperCase();
    return (
      <View
        style={[styles.boxCarusel, styles[nombreEstilo], dynamicStyle]}
        key={`linea_${Math.round(Math.random() * 1000)}`}>
        <Text
          style={[
            styles.textoCarusel,
            {alignSelf: 'center'},
            {
              ...Platform.select({
                ios: {
                  top: itemHeight / 12,
                  right: itemWidth / 15,
                },
                default: {
                  // other platforms, ios, web for example
                },
              }),
            },
          ]}>
          {' '}
          {numeroLinea}{' '}
        </Text>
      </View>
    );
  };

  const initLineasFiltradasParaCombinaciones = () => {
    const {data, superData, loading} = state;
    if (data.length != 0 && superData.length == 0 && loading) {
      let lineasFiltradas = data;
      setState({...state, loading: false, superData: lineasFiltradas});
    }
  };

  const initCarousel = () => {
    if (state.opacity == 0 && state.loading == false) {
      carousel?.snapToItem(1);
      setState({...state, opacity: 1});
    }
  };

  const onChange = ({window: windowPaso}) => {
    setState({
      ...state,
      dimensions: {windowPaso},
      ...calculateDimensions(windowPaso),
    });
  };

  const updateData = () => {
    const {urlRutaExpresa} = state;
    fetch(urlRutaExpresa)
      .then(response => response.json())
      .then(json => {
        var dataJson = json.Items[0];
        var d = [];
        var sectionIndex = 0;
        for (var i in dataJson) {
          if (i == 'id') {
            continue;
          }
          var item = new Object();
          item.title = i;
          item.styleName = i;
          item.estado = dataJson[i].estado;
          item.status = dataJson[i].mensaje_app;
          item.isRutaExpresa = dataJson[i].estaciones.some(
            itemPaso => itemPaso.ruta_expresa,
          );
          item.data = dataJson[i].estaciones.map(e => {
            var obj = new Object();
            obj.title = e.nombre;
            obj.status = e.descripcion_app;
            obj.linea = i;
            obj.visible = false;
            obj.sectionIndex = sectionIndex;
            obj.estado = e.estado;
            obj.codigo = e.codigo;
            obj.combinacion = e.combinacion;
            obj.ruta_expresa = e.ruta_expresa;
            return obj;
          });
          d.push(item);
          sectionIndex++;
        }
        setState({...state, data: d});
      })
      .catch(error => console.error(error))
      .finally(() => {});
  };

  const {
    superData,
    loading,
    opacity,
    sliderHeight,
    sliderWidth,
    itemWidth,
    isLandScape,
  } = state;
  const carouselItemWidth = itemWidth;

  if (loading) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{marginTop: sliderHeight / 2.5}}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Seccion del Carousel
   */
  const carouselView = (
    <View>
      <Carousel
        ref={isCarousel}
        data={superData}
        renderItem={CuadroCarusel}
        sliderWidth={sliderWidth}
        itemWidth={carouselItemWidth}
        firstItem={0}
        layoutCardOffset={30}
        containerCustomStyle={[styles.carouselContainer, {opacity: opacity}]}
        onSnapToItem={indexPaso => {
          setBotonSeleccionado('all');
          setState({...state, index: indexPaso});
          setIndex(indexPaso);
          setLineaActual(superData[indexPaso].title);
        }}
        scrollInterpolator={scrollInterpolator}
        slideInterpolatedStyle={animatedStyles}
        // useScrollView={true}
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
  );

  /**
   * Formato LandScape - Vertical para el Telefono que inicializa con un SafeAreaView
   */
  if (isLandScape) {
    return (
      <View style={{flex: 1}}>
        {carouselView}
        <ScrollView>
          <EstadoDeLaRed
            navigation={props.navigation}
            linea={lineaActual}
            textoBusqueda=""
          />
        </ScrollView>
      </View>
    );
  }

  /**
   * Formato Portrait - Horizontal para el Telefono que inicializa con un ScrollView
   */
  return (
    <ScrollView style={{flex: 1}} nestedScrollEnabled>
      {carouselView}
      <EstadoDeLaRed navigation={props.navigation} linea={lineaActual} />
    </ScrollView>
  );
};

export default RutaExpresa;

let styles = StyleSheet.create({
  boxCarusel: {
    border: 0,
    borderRadius: 1000,
  },

  L1: {
    backgroundColor: Globals.COLOR.L1,
  },

  L2: {
    backgroundColor: Globals.COLOR.L2,
  },

  L3: {
    backgroundColor: Globals.COLOR.L3,
  },

  L4: {
    backgroundColor: Globals.COLOR.L4,
  },

  L4A: {
    backgroundColor: Globals.COLOR.L4A,
  },

  L5: {
    backgroundColor: Globals.COLOR.L5,
  },

  L6: {
    backgroundColor: Globals.COLOR.L6,
  },

  carouselContainer: {
    marginTop: 10,
    marginBottom: -10,
  },

  //Numeros del Carousel Ruta Expresa
  textoCarusel: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  paginationContainer: {
    marginBottom: -30,
  },
});

const calculateDimensions = ({height, width}) => ({
  sliderWidth: width,
  sliderHeight: height,
  itemWidth: Math.round(width / 5),
  itemHeight: Math.round((Math.round(width / 5) * 3) / 3),
  isLandScape: width < height,
});
