import { StyleSheet, SafeAreaView, View, Dimensions, ActivityIndicator, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import Globals from '../Globals'
import Carousel, { Pagination } from 'react-native-new-snap-carousel';

import Linea from '../components/Linea'
import Linea1 from '../assets/svg/lineas/Linea1.svg'
import Linea2 from '../assets/svg/lineas/Linea2.svg'
import Linea3 from '../assets/svg/lineas/Linea3.svg'
import Linea4 from '../assets/svg/lineas/Linea4.svg'
import Linea4A from '../assets/svg/lineas/Linea4A.svg'
import Linea5 from '../assets/svg/lineas/Linea5.svg'
import Linea6 from '../assets/svg/lineas/Linea6.svg'
import Linea7 from '../assets/svg/lineas/Linea7.svg'
import Linea8 from '../assets/svg/lineas/Linea8.svg'
import Linea9 from '../assets/svg/lineas/Linea9.svg'
import CerrarCirculo from '../assets/svg/estados_linea/ErrorBorde.svg'
import CheckCirculo from '../assets/svg/estados_linea/BuenoBorde.svg'
import ExclamasionCirculo from '../assets/svg/estados_linea/AlertaBorde.svg'

/** Estructura dinamica para determinar el tamaño */
const window = Dimensions.get('window')

const EstadoDeLaRed = (props) => {
  const [carousel, setCarousel] = useState(null)
  const [botonSeleccionado, setBotonSeleccionado] = useState('all')
  const [index, setIndex] = React.useState(props.route?.params?.lineaActualPosicionInicial ?? 0)
  const isCarousel = React.useRef(null)
  const [lineaActual, setLineaActual] = useState(props?.route?.params?.lineaActualinicial ?? 'l1')
  const [lineaActualPosicion, setLineaActualPosicion] = useState(props?.route?.params?.lineaActualPosicionInicial ?? 0)

  const [state, setState] = useState({
    ...calculateDimensions(window),
    dimensions: {
      window,
    },
    data: [],
    superData: [],
    index: 0,
    opacity: 0,
    loading: true,
    // urlRutaExpresa:
    //   'https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/ruta',
    urlRutaExpresa: `${Globals.MAIN_URL}/api/estadoRedDetalle.php`,
    // Se genera una propiedad para vincularla al Texto del Buscador.
  })

  useEffect(() => {
    const dimensionsSubscription = Dimensions.addEventListener('change', onChange)
    updateData()
    const _unsubscribe = props.navigation.addListener('focus', () => {
      // updateData();
    })
    return () => {
      _unsubscribe()
      dimensionsSubscription?.remove()
    }
  }, [])

  useEffect(() => {
    initCarousel()
    initLineasFiltradasParaCombinaciones()
  })

  const initLineasFiltradasParaCombinaciones = () => {
    const { data, superData, loading } = state
    if (data.length != 0 && superData.length == 0 && loading) {
      let lineasFiltradas = data
      setState({ ...state, loading: false, superData: lineasFiltradas })
    }
  }

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

  const { superData, loading, sliderHeight, sliderWidth, itemWidth, isLandScape } = state
  const carouselItemWidth = itemWidth

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: sliderHeight / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  }

  const CuadroCarusel = ({ item }) => {
    const { itemWidth, itemHeight, isLandScape, sinuso } = state
    let dynamicStyle = isLandScape
      ? {
          width: itemWidth * 0.95,
          height: 100,
        }
      : {
          width: itemWidth / 2,
          height: itemHeight / 2,
          marginLeft: 65,
        }

    if (!item) {
      return <></>
    }
    const numeroLinea = item.title.toString().substring(1).toUpperCase()
    // const nombreEstilo = item.styleName.toUpperCase();
    /*
    1 - Línea disponible
    2 - Estaciones cerradas
    3 - Servicio interrumpido
    4 - Retraso en frecuencia
    */
    // const estadoicono = [
    //   require('../assets/estados/ok.png'),
    //   require('../assets/estados/ok.png'),
    //   require('../assets/estados/alerta.png'),
    //   require('../assets/estados/error.png'),
    //   require('../assets/estados/alerta.png'),
    // ]
    return (
      <View style={[styles.boxCarusel, dynamicStyle]} key={`linea_${Math.round(Math.random() * 1000)}`}>
        {numeroLinea == '1' && <Linea1 width={104} height={104} />}
        {numeroLinea == '2' && <Linea2 width={104} height={104} />}
        {numeroLinea == '3' && <Linea3 width={104} height={104} />}
        {numeroLinea == '4' && <Linea4 width={104} height={104} />}
        {numeroLinea == '4A' && <Linea4A width={104} height={104} />}
        {numeroLinea == '5' && <Linea5 width={104} height={104} />}
        {numeroLinea == '6' && <Linea6 width={104} height={104} />}
        {numeroLinea == '7' && <Linea7 width={104} height={104} />}
        {numeroLinea == '8' && <Linea8 width={104} height={104} />}
        <View style={{ positin: 'absolute', marginStart: 77, marginTop: -105 }}>{iconoEstado(item.estado)}</View>
      </View>
    )
  }

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
        outputRange: [1, 0.4, 1],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [0.8, 0.65, 0.8],
          }),
        },
      ],
    }
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
        firstItem={lineaActualPosicion}
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
          marginTop: -10,
          marginBottom: 10,
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
      <View style={{ flex: 1, marginTop: 10 }}>
        {carouselView}
        <Linea navigation={props.navigation} linea={lineaActual} />
      </View>
    )
  }
  /**
   * Formato Portrait - Horizontal para el Telefono que inicializa con un ScrollView
   */
  return (
    <View style={{ flex: 1, marginTop: 0 }} nestedScrollEnabled>
      {carouselView}
      <Linea navigation={props.navigation} linea={lineaActual} />
    </View>
  )
}

export default EstadoDeLaRed

let styles = StyleSheet.create({
  boxCarusel: {
    border: 0,
    borderRadius: 1000,
  },
  carouselContainer: {
    marginTop: 10,
    marginBottom: -10,
  },
  paginationContainer: {
    marginBottom: -30,
  },
})
const calculateDimensions = ({ height, width }) => ({
  sliderWidth: width,
  sliderHeight: height,
  itemWidth: Math.round(width / 3.8),
  itemHeight: Math.round((Math.round(width / 3.8) * 3) / 3),
  isLandScape: width < height,
})
