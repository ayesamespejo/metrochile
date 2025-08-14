import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView, Image, Dimensions, StyleSheet, ScrollView, View, Text } from 'react-native'
import Estilos from './Estilos'
import VideoPlayer from 'react-native-video-player'
import Carousel, { Pagination } from 'react-native-new-snap-carousel'
import TituloCirculoEstacion from './js/components/TituloCirculoEstacion'
import Globals from './Globals'
import Tecnica from './assets/svg/MetroArte/Tecnica.svg'
import Medidas from './assets/svg/MetroArte/Medidas.svg'
import CalendarioAgendaCultural from './assets/svg/cultura_comunidad/CalendarioAgendaCultural.svg'
import PersonCircle from './assets/svg/comun/PersonCircle.svg'

const SCREEN_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = Math.round(SCREEN_WIDTH * 0.9)
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 0.95)

const styles = StyleSheet.create({
  boxVideo: {
    position: 'relative',
    height: ITEM_HEIGHT,
    top: 10,
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  boxVideoCarrusel: {
    position: 'relative',
    height: SCREEN_WIDTH * 0.60,
    width: SCREEN_WIDTH * 0.83,
    // borderRadius: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    overflow: 'hidden',
  },
  item: {
    width: SCREEN_WIDTH - 60,
    height: SCREEN_WIDTH - 150,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    height: SCREEN_WIDTH * 0.6,
    resizeMode: 'auto',
    borderRadius: 10,
  },
  titulo: [
    Estilos.textoTitulo,
    {
      marginTop: SCREEN_WIDTH * 0.05,
    },
  ],
  tarjeta: {
    marginTop: SCREEN_WIDTH * 0.05,
    borderRadius: 20,
    backgroundColor: Globals.COLOR.GRIS_1,
    padding: SCREEN_WIDTH * 0.05,
  },
  linea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SCREEN_WIDTH * 0.05,
  },
  textoLinea: [
    Estilos.textoGeneral,
    {
      marginHorizontal: SCREEN_WIDTH * 0.05,
    },
  ],
  texto: [
    Estilos.textoGeneral,
    { lineHeight: 25, paddingHorizontal: SCREEN_WIDTH * 0.08, marginTop: SCREEN_WIDTH * 0.05 },
  ],
})

function getFileExtension(filename) {
  return filename.split('.').pop()
}

const renderItem = ({ item, index }) => {
  if (getFileExtension(item) == 'jpg' || getFileExtension(item) == 'jpeg') {
    return (
      <View style={styles.item}>
        <Image source={{ uri: item }} containerStyle={styles.imageContainer} style={styles.image} />
      </View>
    )
  } else if (getFileExtension(item) == 'mp4') {
    return (
      <View style={styles.boxVideoCarrusel}>
        <VideoPlayer
          video={{ uri: item }}
          videoWidth={SCREEN_WIDTH * 0.8}
          videoHeight={SCREEN_WIDTH * 0.6}
          // thumbnail={{ uri: 'https://d76lghb7e30c0.cloudfront.net/47fundaciondelaudechile_06.jpg' }}
        />
      </View>
    )
  } else {
    ;<View style={styles.item}>
      <Text>Tipo de archivo no soportado</Text>
    </View>
  }
}

const setDataFromObra = (dataObra) => {
  let videoUri = Array.isArray(dataObra[13]) && dataObra[13].length > 0 ? dataObra[13] : ''

  return {
    titulo: dataObra[12] ?? undefined,
    autor: dataObra[3] ?? undefined,
    tecnica: dataObra[11] ?? undefined,
    fecha: dataObra[6] ?? undefined,
    texto: dataObra[4] ?? '',
    superficie: dataObra[14] ?? undefined,
    // unidadMedida: dataObra[14] ?? 'mts2',
    galeria: dataObra[0] ?? [],
    videoUri: videoUri,
  }
}

const MetroArteDetalleObra = (props) => {
  const [state, setState] = useState({
    ...props.route.params,
    data: setDataFromObra(props.route.params.newDataMetro),
    estacion: props.route.params.estacion,
    linea: props.route.params.linea,
  })
  const [opacity, setOpacity] = useState(0)
  const [index, setIndex] = useState(0)
  const [datosCarrusel, setDatosCarrusel] = useState([])

  const carouselRef = useRef(null)

  useEffect(() => {
    props.navigation.setOptions({ title: 'Información Estaciones' })
    setDatosCarrusel([...state.data.galeria, ...state.data.videoUri])
    initCarousel()
  }, [])

  const formatText = (txt) => {
    var regex = /<br\s*[\/]?>/gi

    var regex2 = /(<([^>]+)>)/gi

    return txt.replace(regex, '\n').replace(regex2, ' ')
  }

  let { data, estacion, linea } = state
  linea = linea.substring(1).toUpperCase()

  const initCarousel = () => {
    if (opacity == 0) {
      // this.carouselAgenda.snapToItem(0);
      setOpacity(1)
    }
  }

  return (
    <SafeAreaView>
      <ScrollView style={{ height: Dimensions.get('window').height - 110 }}>
        <View style={{ marginTop: SCREEN_WIDTH * 0.08, alignSelf: 'center' }}>
          <TituloCirculoEstacion texto={estacion} linea={linea} />
        </View>
        <Text style={[Estilos.textoTitulo, { marginTop: SCREEN_WIDTH * 0.05, marginLeft: SCREEN_WIDTH * 0.05 }]}>
          MetroArte
        </Text>
        <View style={{ marginTop: SCREEN_WIDTH * 0.05 }}>
          <Carousel
            ref={carouselRef}
            sliderWidth={SCREEN_WIDTH}
            // sliderHeight={SCREEN_WIDTH * 0.3}
            itemWidth={SCREEN_WIDTH - 60}
            data={datosCarrusel}
            renderItem={renderItem}
            onSnapToItem={(indexPaso) => setIndex(indexPaso)}
          />
          {/* <View style={{ top: -20, backgroundColor: 'red' }}> */}
          <Pagination
            containerStyle={{ paddingVertical: 0, marginTop: SCREEN_WIDTH * 0.05 }}
            dotsLength={datosCarrusel.length}
            activeDotIndex={index}
            carouselRef={carouselRef}
            onSnapToItem={(indexPaso) => setIndex(indexPaso)}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              //marginHorizontal: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.92)',
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            tappableDots={true}
          />
          {/* </View> */}
        </View>
        <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.05}}>
          <View style={[styles.tarjeta, ]}>
            {data.titulo && (
                <Text style={Estilos.textoTitulo}>{data.titulo}</Text>

            )}
            {data.autor && (
              <View style={styles.linea}>
                <PersonCircle width={24} height={24} />
                <Text style={[styles.textoLinea,]}>{data.autor}</Text>
              </View>
            )}
            {data.tecnica && (
              <View style={styles.linea}>
                <Tecnica width={24} height={24} />
                <Text style={styles.textoLinea}>{data.tecnica}</Text>
              </View>
            )}
            {data.superficie && (
              <View style={styles.linea}>
                <Medidas width={24} height={24} />
                <Text style={styles.textoLinea}>{data.superficie}</Text>
              </View>
            )}
            {data.fecha && (
              <View style={styles.linea}>
                <CalendarioAgendaCultural width={24} height={24} />
                <Text style={styles.textoLinea}>{data.fecha}</Text>
              </View>
            )}
            <Text style={[Estilos.textoSubtitulo, {marginTop: SCREEN_WIDTH * 0.05}]}>
              Descripción
            </Text>
            <Text style={[Estilos.textoGeneral, {marginTop: SCREEN_WIDTH * 0.03, textAlign: 'justify',}]}>{formatText(data.texto)}</Text>
            
          </View>
          <View style={{height: SCREEN_WIDTH * 0.05}}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MetroArteDetalleObra
