import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
  Dimensions,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import Estilos from './Estilos'
import Globals from './Globals'
import Carousel, { Pagination } from 'react-native-new-snap-carousel';
import IconoComunRutaExpresa from './assets/svg/ruta_expresa/IconoComunRutaExpresa.svg'
import IconoVerdeRutaExpresa from './assets/svg/ruta_expresa/IconoVerdeRutaExpresa.svg'
import IconoRojoRutaExpresa from './assets/svg/ruta_expresa/IconoRojoRutaExpresa.svg'
import ComunAltoContrasteRutaExpresa from './assets/svg/ruta_expresa/ComunAltoContrasteRutaExpresa.svg'
import VerdeAltoContrasteRutaExpresa from './assets/svg/ruta_expresa/VerdeAltoContrasteRutaExpresa.svg'
import RojoAltoContrasteRutaExpresa from './assets/svg/ruta_expresa/RojoAltoContrasteRutaExpresa.svg'
import IconoComunBordeNegroRutaExpresa from './assets/svg/ruta_expresa/IconoComunBordeNegroRutaExpresa.svg'
import L1AltoContrasteRutaExpresa from './assets/svg/ruta_expresa/L1AltoContrasteRutaExpresa.svg'
import L2AltoContrasteRutaExpresa from './assets/svg/ruta_expresa/L2AltoContrasteRutaExpresa.svg'
import L3AltoContrasteRutaExpresa from './assets/svg/ruta_expresa/L3AltoContrasteRutaExpresa.svg'
import L4AltoContrasteRutaExpresa from './assets/svg/ruta_expresa/L4AltoContrasteRutaExpresa.svg'
import L4AAltoContrasteRutaExpresa from './assets/svg/ruta_expresa/L4AAltoContrasteRutaExpresa.svg'
import L5AltoContrasteRutaExpresa from './assets/svg/ruta_expresa/L5AltoContrasteRutaExpresa.svg'
import L6AltoContrasteRutaExpresa from './assets/svg/ruta_expresa/L6AltoContrasteRutaExpresa.svg'
import TodoAltoContrasteRutaExpresa from './assets/svg/ruta_expresa/TodoAltoContrasteRutaExpresa.svg'
import CombinacionAltoContrasteRutaExpresa from './assets/svg/ruta_expresa/CombinacionAltoContrasteRutaExpresa'
import OjoNormalAltoContrasteRutaExpresa from './assets/svg/ruta_expresa/OjoNormalAltoContrasteRutaExpresa.svg'
import OjoAltoContrasteRutaExpresa from './assets/svg/ruta_expresa/OjoAltoContrasteRutaExpresa.svg'
import IconoHorariosRutaExpresa from './assets/svg/ruta_expresa/IconoHorariosRutaExpresa.svg'
import IconoPreguntasRutaExpresa from './assets/svg/ruta_expresa/IconoPreguntasRutaExpresa.svg'
import Linea2AltoContraste from './assets/svg/lineas/Linea2AltoContraste.svg'
import Linea4AltoContraste from './assets/svg/lineas/Linea4AltoContraste.svg'
import Linea5AltoContraste from './assets/svg/lineas/Linea5AltoContraste.svg'
import Linea2 from './assets/svg/lineas/Linea2.svg'
import Linea4 from './assets/svg/lineas/Linea4.svg'
import Linea5 from './assets/svg/lineas/Linea5.svg'
import CerrarCirculo from './assets/svg/comun/CerrarCirculo.svg'
/** Estructura dinamica para determinar el tamaño */
const window = Dimensions.get('window')
const SCREEN_WIDTH = Dimensions.get('window').width

const calculateDimensions = ({ height, width }) => ({
  sliderWidth: width,
  sliderHeight: height,
  itemWidth: Math.round(width / 2.6),
  itemHeight: Math.round((Math.round(width / 2.6) * 3) / 3),
  isLandScape: width < height,
})

const RutaExpresa = (props) => {
  const [carousel, setCarousel] = useState(null)
  const [showMessage, setShowMessage] = useState('none')
  const [seccionAbajoColor, setSeccionAbajoColor] = useState(Globals.COLOR.GRIS_1)
  const [botonSeleccionado, setBotonSeleccionado] = useState('all')
  var dataSeccionAbajo = {} // useState gener re-render
  const [accessibility, setAccessibility] = useState(0)
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
    urlRutaExpresa: 'https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/ruta',
    // Se genera una propiedad para vincularla al Texto del Buscador.
    searchText: '',
  })
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    props.navigation.setOptions({ title: 'Ruta expresa' })
    const dimensionsSubscription = Dimensions.addEventListener('change', onChange)
    updateData()
    const _unsubscribe = props.navigation.addListener('focus', () => {
      updateData()
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

  let styles = StyleSheet.create({
    carouselContainer: {
      marginHorizontal: -30,
      height: 100,
    },
    lineaAyuda: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: SCREEN_WIDTH * 0.8,
      marginTop: SCREEN_WIDTH * 0.08,
    },
    ayudaHorario: {
      position: 'absolute',
      width: window.width * 0.9,
      height: window.width * 0.5,
      backgroundColor: Globals.COLOR.GRIS_2,
      borderRadius: 20,
      top: 60,
      zIndex: 3, // Esto es para Ios
      elevation: 3, // Esto es para Android
      justifyContent: 'center',
    },
    textoAyudaHorario1: [
      Estilos.textoGeneral,
      {
        textAlign: 'justify',
        marginTop: window.width * 0.05,
        marginHorizontal: window.width * 0.05,
        paddingLeft: window.width * 0.03,
      },
    ],
    textoAyudaHorario2: [
      Estilos.textoGeneral,
      {
        textAlign: 'justify',
        marginTop: window.width * 0.03,
        marginHorizontal: window.width * 0.05,
        paddingLeft: window.width * 0.03,
      },
    ],
    contenedorBotones: {
      alignSelf: 'stretch',
      marginTop: SCREEN_WIDTH * 0.05,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: SCREEN_WIDTH * 0.05,
    },
    tarjeta: {
      marginTop: SCREEN_WIDTH * 0.01,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      width: SCREEN_WIDTH * 0.9,
      marginLeft: 'auto',
      marginRight: 'auto',
      height: window.height * 0.65,
    },
    textoBoton: [Estilos.textoSubtitulo, { marginTop: SCREEN_WIDTH * 0.03 }],
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      margin: SCREEN_WIDTH * 0.05,
      backgroundColor: Globals.COLOR.GRIS_1,
      borderRadius: 20,
      padding: SCREEN_WIDTH * 0.05,
    },
  })

  const getInputRangeFromIndexes = (range, index, carouselProps) => {
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
        outputRange: [0.4, 1, 0.4],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [0.45, 0.55, 0.45],
          }),
        },
      ],
    }
  }

  const pagination = () => {
    const { index, superData } = state
    if (carousel) {
      return (
        <View style={{ paddingTop: SCREEN_WIDTH * 0.03 }}>
          <Pagination
            dotsLength={superData.length}
            activeDotIndex={index}
            containerStyle={{ backgroundColor: 'transparent', margin: -20, height: 65 }}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: Globals.COLOR.GRIS_4,
            }}
            carouselRef={carousel}
            tappableDots={true}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        </View>
      )
    }
  }

  const CirculoEstacion = ({ item }) => {
    let desplazamiento = -19
    if (item.combinacion !== '' && (item.primera || item.ultima)) desplazamiento = -19
    else if (item.combinacion == '' && !item.primera && !item.ultima) desplazamiento = -23
    else if (item.combinacion == '' && (item.primera || item.ultima)) desplazamiento = -23
    return (
      <View>
        <View
          style={{
            width: 40,
            height: 20,
            marginTop: 6,
            right: desplazamiento,
            top: 7,
          }}
        >
          {iconoEstacion(item)}
        </View>
      </View>
    )
  }

  const CirculoCombinacion = (item) => {
    if (item.combinacion == '' || item.extremoInicial || item.extremoFinal) {
      return <Text style={{ marginLeft: 40 }} />
    } else {
      switch (item.combinacion) {
        case '1':
          return (
            <L1AltoContrasteRutaExpresa
              width={20}
              height={20}
              fill={accessibility ? Globals.COLOR.NEGRO_ALTO_CONTRASTE : Globals.COLOR.L1}
              style={{ marginLeft: 24, marginTop: 13 }}
            />
          )
        case '2':
          return (
            <L2AltoContrasteRutaExpresa
              width={20}
              height={20}
              fill={accessibility ? Globals.COLOR.NEGRO_ALTO_CONTRASTE : Globals.COLOR.L2}
              style={{ marginLeft: 24, marginTop: 13 }}
            />
          )
        case '3':
          return (
            <L3AltoContrasteRutaExpresa
              width={20}
              height={20}
              fill={accessibility ? Globals.COLOR.NEGRO_ALTO_CONTRASTE : Globals.COLOR.L3}
              style={{ marginLeft: 24, marginTop: 13 }}
            />
          )
        case '4':
          return (
            <L4AltoContrasteRutaExpresa
              width={20}
              height={20}
              fill={accessibility ? Globals.COLOR.NEGRO_ALTO_CONTRASTE : Globals.COLOR.L4}
              style={{ marginLeft: 24, marginTop: 13 }}
            />
          )
        case '4A':
          return (
            <L4AAltoContrasteRutaExpresa
              width={20}
              height={20}
              fill={accessibility ? Globals.COLOR.NEGRO_ALTO_CONTRASTE : Globals.COLOR.L4A}
              style={{ marginLeft: 24, marginTop: 13 }}
            />
          )
        case '5':
          return (
            <L5AltoContrasteRutaExpresa
              width={20}
              height={20}
              fill={accessibility ? Globals.COLOR.NEGRO_ALTO_CONTRASTE : Globals.COLOR.L5}
              style={{ marginLeft: 24, marginTop: 13 }}
            />
          )
        case '6':
          return (
            <L6AltoContrasteRutaExpresa
              width={20}
              height={20}
              fill={accessibility ? Globals.COLOR.NEGRO_ALTO_CONTRASTE : Globals.COLOR.L6}
              style={{ marginLeft: 24, marginTop: 13 }}
            />
          )
      }
    }
  }

  const iconoEstacion = (item) => {
    if (item.ruta_expresa == 'roja')
      return accessibility ? (
        <RojoAltoContrasteRutaExpresa width={18} height={18} fill={Globals.COLOR.NEGRO_ALTO_CONTRASTE} />
      ) : (
        <IconoRojoRutaExpresa width={18} height={18} />
      )
    else if (item.ruta_expresa == 'verde')
      return accessibility ? (
        <VerdeAltoContrasteRutaExpresa width={18} height={18} fill={Globals.COLOR.NEGRO_ALTO_CONTRASTE} />
      ) : (
        <IconoVerdeRutaExpresa width={18} height={18} />
      )
    else if (item.ruta_expresa == 'común' && item.combinacion == '')
      return accessibility ? (
        <ComunAltoContrasteRutaExpresa width={18} height={18} fill={Globals.COLOR.NEGRO_ALTO_CONTRASTE} />
      ) : (
        <IconoComunRutaExpresa width={18} height={18} />
      )
    else
      return accessibility ? (
        <CombinacionAltoContrasteRutaExpresa width={18} height={18} fill={Globals.COLOR.NEGRO_ALTO_CONTRASTE} />
      ) : (
        <IconoComunBordeNegroRutaExpresa width={18} height={18} />
      )
  }

  const ItemEstaciones = ({ item, index }) => {
    let opacityMensaje = showMessage == 'none' ? 1 : 0.2
    let colorLinea = accessibility ? '#231F20' : Globals.COLOR[item.linea.toUpperCase()]
    let rallitaSeparadora =
      index == dataSeccionAbajo.station.length - 1 ? (
        <></>
      ) : (
        <View
          style={{
            position: 'absolute',
            left: 62,
            top: 10,
            width: 20,
            height: 58,
            borderRadius: 10,
            backgroundColor: colorLinea,
          }}
        />
      )
    return (
      <Pressable
        style={{
          flexDirection: 'row',
          marginLeft: 20,
          marginBottom: 0,
          marginTop: SCREEN_WIDTH * 0.03,
          opacity: opacityMensaje,
        }}
      >
        {rallitaSeparadora}
        {CirculoCombinacion(item)}
        {item.extremoInicial && (
          <View
            style={{
              position: 'absolute',
              left: 42,
              top: 0,
              width: 60,
              height: 20,
              backgroundColor: colorLinea,
              borderRadius: 13,
            }}
          />
        )}
        {item.extremoFinal && (
          <>
            <View
              style={{
                position: 'absolute',
                left: 42,
                top: 15,
                width: 60,
                height: 20,
                backgroundColor: colorLinea,
                borderRadius: 13,
              }}
            />
            <View
              style={{
                left: 35,
                width: 75,
                height: 40,
              }}
            ></View>
          </>
        )}
        {!item.extremoInicial && !item.extremoFinal && (
          <CirculoEstacion item={item} color={colorLinea} instance={this} />
        )}
        {!item.extremoInicial && !item.extremoFinal && (
          <Text style={[{ marginLeft: 20, top: 11 }, Estilos.textoGeneral]}>{item.title} </Text>
        )}
      </Pressable>
    )
  }

  const CuadroCarusel = ({ item }) => {
    const { itemWidth, itemHeight, isLandScape, sinuso } = state
    let dynamicStyle = isLandScape
      ? {
          width: itemWidth,
          height: itemHeight,
        }
      : {
          width: itemWidth / 2,
          height: itemHeight / 2,
          marginLeft: 65,
        }
    // Se cambian los colores del carusel cuando se activan la accesibilidad.
    if (accessibility) {
      dynamicStyle.backgroundColor = '#231F20'
    }
    if (!item) {
      return <></>
    }
    const numeroLinea = item.title.toString().substring(1).toUpperCase()
    if (accessibility) {
      if (numeroLinea == 2) {
        return <Linea2AltoContraste width={itemWidth} height={itemHeight} style={{ marginTop: -30 }} />
      }
      if (numeroLinea == 4) {
        return <Linea4AltoContraste width={itemWidth} height={itemHeight} style={{ marginTop: -30 }} />
      }
      if (numeroLinea == 5) {
        return <Linea5AltoContraste width={itemWidth} height={itemHeight} style={{ marginTop: -30 }} />
      }
    } else {
      if (numeroLinea == 2) {
        return <Linea2 width={itemWidth} height={itemHeight} style={{ marginTop: -30 }} />
      }
      if (numeroLinea == 4) {
        return <Linea4 width={itemWidth} height={itemHeight} style={{ marginTop: -30 }} />
      }
      if (numeroLinea == 5) {
        return <Linea5 width={itemWidth} height={itemHeight} style={{ marginTop: -30 }} />
      }
    }
  }
  // Esto lo tuvo que entregar el api de una para no realizar este proceso.
  const initLineasFiltradasParaCombinaciones = () => {
    const { data, superData, loading } = state
    if (data.length != 0 && superData.length == 0 && loading) {
      // Se utiliza el resultado del endpoint de las linas con ruta expresa para filtrar el contenido de las lineas
      // del api de estado de red.
      let lineasFiltradas = data.filter((item) => item.isRutaExpresa)
      setState({ ...state, loading: false, superData: lineasFiltradas })
    }
  }

  const initCarousel = () => {
    if (state.opacity == 0 && state.loading == false) {
      carousel?.snapToItem(1)
      setState({ ...state, opacity: 1 })
    }
  }

  const filterDataStation = (value) => {
    setBotonSeleccionado(value)
    setState({ ...state })
  }

  const switchAccesibility = (accessibilityPaso) => {
    setAccessibility(accessibilityPaso)
  }

  const setInfoSeccionAbajo = () => {
    const { index, superData } = state
    if (superData[index]) {
      let stations = []
      switch (botonSeleccionado) {
        case 'both':
          stations = superData[index].data.filter(
            (item) => item.ruta_expresa == 'común' && !item.extremoInicial && !item.extremoFinal,
          )
          stations.unshift({ ...stations[0], extremoInicial: true })
          stations.push({ ...stations[stations.length - 1], extremoFinal: true })
          break
        case 'red':
          stations = superData[index].data.filter(
            (item) => item.ruta_expresa == 'roja' && !item.extremoInicial && !item.extremoFinal,
          )
          break
        case 'green':
          stations = superData[index].data.filter(
            (item) => item.ruta_expresa == 'verde' && !item.extremoInicial && !item.extremoFinal,
          )
          break
        default:
          stations = superData[index].data.filter((item) => !item.extremoInicial && !item.extremoFinal)
          stations.unshift({ ...stations[0], extremoInicial: true })
          stations.push({ ...stations[stations.length - 1], extremoFinal: true })
          break
      }
      dataSeccionAbajo = {
        title: superData[index].title.toString().substring(1).toUpperCase(),
        station: stations,
      }
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
        var dataJson = json.Items[0]
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
          const cantidad = dataJson[i].estaciones.length
          let listaEstaciones = dataJson[i].estaciones.map((e, indice) => {
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
            obj.indice = indice
            obj.primera = indice == 0
            obj.ultima = indice == cantidad - 1
            obj.extremoInicial = false
            obj.extremoFinal = false
            return obj
          })
          item.data = listaEstaciones
          d.push(item)
          sectionIndex++
        }
        setState({ ...state, data: d, searchText: '' })
      })
      .catch((error) => console.error(error))
      .finally(() => {})
  }
  const { superData, loading, opacity, sliderHeight, itemWidth, isLandScape } = state
  const carouselItemWidth = itemWidth * 0.8
  setInfoSeccionAbajo()
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: sliderHeight / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  }
  // Seccion del Carousel
  const carouselView = (
    <View style={{ marginTop: SCREEN_WIDTH * 0.05 }}>
      <Carousel
        ref={(c) => setCarousel(c)}
        data={superData}
        renderItem={CuadroCarusel}
        sliderWidth={window.width * 1.1}
        itemWidth={carouselItemWidth}
        layoutCardOffset={10}
        firstItem={1}
        containerCustomStyle={[styles.carouselContainer, { opacity: opacity }]}
        onSnapToItem={(index) => {
          setBotonSeleccionado('all')
          setState({ ...state, index })
        }}
        scrollInterpolator={scrollInterpolator2}
        slideInterpolatedStyle={animatedStyles2}
        useScrollView={true}
        loop={true}
      />
      {/** Estos son los botonsitos de la paginacion */}
      {pagination()}
    </View>
  )
  // Seccion de Abajo para los botones y las estaciones.
  const abajoView = (
    <View style={[styles.tarjeta, { backgroundColor: seccionAbajoColor }]}>
      {/** Estos son los botones en forma de circulo de la seccion de abajo*/}
      <View style={styles.contenedorBotones}>
        {/** Este es el boton de 'Todo' */}
        <Pressable
          accessibilityHint="Toca 2 veces para activar"
          onPress={(e) => {
            filterDataStation('all')
          }}
        >
          <View style={{ alignItems: 'center' }}>
            {accessibility ? (
              <TodoAltoContrasteRutaExpresa width={48} height={48} fill={Globals.COLOR.NEGRO_ALTO_CONTRASTE} />
            ) : (
              <TodoAltoContrasteRutaExpresa width={48} height={48} />
            )}
            <Text style={styles.textoBoton}>Todo</Text>
          </View>
          {/**Rallita de elemento 'boton' seleccionado */}
          {botonSeleccionado == 'all' && (
            <View
              style={{
                position: 'relative',
                top: SCREEN_WIDTH * 0.03,
                width: 40,
                height: 2,
                backgroundColor: '#000000',
                left: 5,
              }}
            />
          )}
        </Pressable>
        {/** Este es el boton de 'Comun' */}
        <Pressable
          accessibilityHint="Toca 2 veces para activar"
          onPress={(e) => {
            filterDataStation('both')
          }}
        >
          <View style={{ alignItems: 'center' }}>
            {accessibility ? (
              <ComunAltoContrasteRutaExpresa width={48} height={48} fill={Globals.COLOR.NEGRO_ALTO_CONTRASTE} />
            ) : (
              <IconoComunRutaExpresa width={48} height={48} />
            )}
            <Text style={styles.textoBoton}>Común</Text>
          </View>
          {/**Rallita de elemento 'boton' seleccionado */}
          {botonSeleccionado == 'both' && (
            <View
              style={{
                position: 'relative',
                top: SCREEN_WIDTH * 0.03,
                width: 54,
                height: 2,
                backgroundColor: '#000000',
              }}
            />
          )}
        </Pressable>
        {/** Este es el boton de 'Rojo' */}
        <Pressable
          accessibilityHint="Toca 2 veces para activar"
          onPress={(e) => {
            filterDataStation('red')
          }}
        >
          <View style={{ alignItems: 'center' }}>
            {accessibility ? (
              <RojoAltoContrasteRutaExpresa width={48} height={48} fill={Globals.COLOR.NEGRO_ALTO_CONTRASTE} />
            ) : (
              <IconoRojoRutaExpresa width={48} height={48} />
            )}
            <Text style={styles.textoBoton}>Roja</Text>
          </View>
          {/**Rallita de elemento 'boton' seleccionado */}
          {botonSeleccionado == 'red' && (
            <View
              style={{
                position: 'relative',
                left: 5,
                top: SCREEN_WIDTH * 0.03,
                width: 39,
                height: 2,
                backgroundColor: '#000000',
              }}
            />
          )}
        </Pressable>
        {/** Este es el boton de 'Verde' */}
        <Pressable
          accessibilityHint="Toca 2 veces para activar"
          onPress={(e) => {
            filterDataStation('green')
          }}
        >
          <View style={{ alignItems: 'center' }}>
            {accessibility ? (
              <VerdeAltoContrasteRutaExpresa width={48} height={48} fill={Globals.COLOR.NEGRO_ALTO_CONTRASTE} />
            ) : (
              <IconoVerdeRutaExpresa width={48} height={48} />
            )}
            <Text style={styles.textoBoton}>Verde</Text>
          </View>
          {/**Rallita de elemento 'boton' seleccionado */}
          {botonSeleccionado == 'green' && (
            <View
              style={{
                position: 'relative',
                left: 3,
                top: SCREEN_WIDTH * 0.03,
                width: 43,
                height: 2,
                backgroundColor: '#000000',
              }}
            />
          )}
        </Pressable>
      </View>
      <View style={[styles.lineaAyuda]}>
        {/** Este es el Titulo de la seccion de abajo */}
        <View style={{ flex: 1 }}>
          <Text style={[Estilos.textoTitulo]}>Línea {dataSeccionAbajo.title}</Text>
        </View>
        {/** Este es el icono del Reloj en la seccion de Abajo. */}
        <View style={{ marginRight: SCREEN_WIDTH * 0.08 }}>
          <IconoHorariosRutaExpresa
            onPress={(e) => {
              setModalVisible(true)
            }}
            width={24}
            height={24}
          />
        </View>
        <View style={{ marginRight: SCREEN_WIDTH * 0.03 }}>
          {/* *Boton de Ayuda* */}
          <IconoPreguntasRutaExpresa
            onPress={(e) => {
              props.navigation.push('Ayuda Ruta Expresa')
            }}
            width={24}
            height={24}
          />
        </View>
      </View>
      <FlatList
        nestedScrollEnabled
        style={{
          marginTop: SCREEN_WIDTH * 0.05,
          marginBottom: SCREEN_WIDTH * 0.05,
          alignSelf: isLandScape ? 'stretch' : 'center',
        }}
        data={dataSeccionAbajo.station}
        renderItem={ItemEstaciones}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      />
      <Pressable
        accessibilityHint="Toca 2 veces para activar"
        style={{ position: 'absolute', bottom: 40, right: 10 }}
        onPress={(e) => {
          switchAccesibility(!accessibility)
        }}
      >
        {accessibility ? (
          <OjoAltoContrasteRutaExpresa width={50} height={50} fill={Globals.COLOR.NEGRO_ALTO_CONTRASTE} />
        ) : (
          <OjoNormalAltoContrasteRutaExpresa width={50} height={50} fill={Globals.COLOR.NEGRO_ALTO_CONTRASTE} />
        )}
      </Pressable>
    </View>
  )
  const modalAyudaHorario = (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.')
      }}
      backgroundColor={'red'}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={[Estilos.textoSubtitulo]}>Horario</Text>
            <Pressable
              onPress={() => {
                setModalVisible(false)
              }}
            >
              <CerrarCirculo width={20} height={20} fill={Globals.COLOR.GRIS_3}/>
            </Pressable>
          </View>
          <View style={{ padding: SCREEN_WIDTH * 0.03 }}>
            <Text style={Estilos.textoGeneral}>
              La Ruta Expresa funciona de 6:00 a 9:00 hrs y de 18:00 a 21:00 hrs en días hábiles.
            </Text>
            <Text style={[Estilos.textoGeneral, {marginTop: SCREEN_WIDTH * 0.05}]}>Horario de inicio o término puede variar por estación.</Text>
          </View>
        </View>
      </View>
    </Modal>
  )
  // Formato LandScape - Vertical para el Telefono que inicializa con un SafeAreaView
  if (isLandScape) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {carouselView}
        {abajoView}
        {modalAyudaHorario}
      </SafeAreaView>
    )
  }
  // Formato Portrait - Horizontal para el Telefono que inicializa con un ScrollView
  return (
    <ScrollView style={{ flex: 1 }} nestedScrollEnabled>
      {carouselView}
      {abajoView}
      {modalAyudaHorario}
      {modalAyudaHorario}
    </ScrollView>
  )
}

export default RutaExpresa
