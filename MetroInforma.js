import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  ActivityIndicator,
  ScrollView,
  Linking,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import Estilos from './Estilos'
import Carousel from 'react-native-new-snap-carousel';
import { scrollInterpolator, animatedStyles } from './js/utils/carouselAgendaAnimations'
import Globals from './Globals'
import { width } from 'deprecated-react-native-prop-types/DeprecatedImagePropType'

/** Estructura dinamica para determinar el tamaño */
const window = Dimensions.get('window')

const monthNames = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: window.width * 0.08,
  },
  container: {
    height: 200,
    padding: 20,
    justifyContent: 'space-around',
  },
  titulo: {
    fontSize: 20,
    marginTop: window.width * 0.08,
    marginLeft: window.width * 0.08,
  },
  subtitulo: {
    fontSize: 16,
    marginTop: window.width * 0.08,
    marginLeft: window.width * 0.08,
  },
  buscador: {
    backgroundColor: '#DDDDDD',
    borderRadius: 10,
    margin: 20,
    padding: 10,
    height: 40,
  },
  boxCarusel: {
    position: 'relative',
    backgroundColor: 'grey',
    borderRadius: 20,
  },
  imgCarusel: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    resizeMode: 'stretch',
  },
  bodyCarusel: {
    backgroundColor: Globals.COLOR.GRIS_1,
    width: '100%',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    position: 'relative',
  },
  bodyCaruselTitulo: {
    position: 'absolute',
    marginTop: 20,
    marginLeft: 16,
    marginRight: 16,
    fontSize: 18,
    lineHeight: 22,
  },
  bodyCaruselLink: {
    textAlign: 'right',
    marginTop: 80,
    marginLeft: '60%',
    fontSize: 12,
    position: 'absolute',
  },
  btnSeccionAbajo: {
    backgroundColor: 'grey',
    borderRadius: 16,
    marginTop: 30,
  },
  tarjeta: {
    backgroundColor: Globals.COLOR.GRIS_1,
    borderRadius: 20,
    padding: window.width * 0.05,
    marginTop: window.width * 0.08,
    marginHorizontal: window.width * 0.05,
    marginBottom: window.width * 0.05,
  },
  tituloMasInformacion: {
    fontSize: 20,
    marginLeft: window.width * 0.03,
    marginVertical: window.width * 0.08,
  },
  contenedorTextoConEnlace: {
    flexDirection: 'row',
    marginTop: window.width * 0.03,
    justifyContent: 'center',
  },
  subtituloMasInformacion: {
    fontSize: 16,
  },
  textoMasInformacion: {
    fontSize: 16,
  },
  enlace: {
    fontSize: 16,
    color: Globals.COLOR.ENLACE,
    textDecorationLine: 'underline',
  },
})

const MetroInforma = (props) => {
  /**
   * Cambiar el nombre del Header.
   */
  const { height, width } = Dimensions.get('window')

  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [registro, setRegistro] = useState([])
  const [searchText, setSearchText] = useState('')
  const [opacity, setOpacity] = useState(0)
  const [url, setUrl] = useState('https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/metroinforma')

  const [sliderWidth, setSliderWidth] = useState(width)
  const [sliderHeight, setSliderHeight] = useState(height)
  const [itemWidth, setItemWidth] = useState(Math.round(width * 0.8))
  const [itemHeight, setItemHeight] = useState(Math.round(Math.round(width * 0.82) * 0.95))
  const [isLandScape, setIsLandScape] = useState(width < height)

  useEffect(() => {
    props.navigation.setOptions({ title: 'MetroInforma' })
    const dimensionsSubscription = Dimensions.addEventListener('change', onChange)
    getRegistro()
    return () => {
      dimensionsSubscription?.remove()
    }
  }, [])

  useEffect(() => {
    initCarousel()
  })

  const onChange = () => {
    const { height: heightPaso, width: widthPaso } = Dimensions.get('window')
    setSliderWidth(widthPaso)
    setSliderHeight(heightPaso)
    setItemWidth(Math.round(widthPaso * 0.9))
    setItemHeight(Math.round(Math.round(widthPaso * 0.9) * 0.95))
  }

  const getRegistro = () => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        /**
         * Revisemos los datos.
         * Mandamos solamente los Indices mayores.
         */
        const eventosActuales = res.Items.filter((item) => Boolean(item.link_imagen)).filter((item) => {
          /**
           * Filtro para determinar si el evento esta dentro de las fechas recientes
           */
          const [dayInicio, monthInicio, yearInicio] = item.Fecha_inicio.split('-')
          const [dayFin, monthFin, yearFin] = item.Fecha_fin.split('-')

          const fechaInicio = new Date(+yearInicio, +monthInicio - 1, +dayInicio)
          const fechaFin = new Date(+yearFin, +monthFin - 1, +dayFin)
          fechaFin.setDate(fechaFin.getDate() + 1)
          const fechaActual = new Date()

          /**
           * Evaluacion de las propiedades es_evento_promocion y Fecha_promocion.
           * La Fecha_promocion, solamente se utilizara cuando el valor de "es_evento_promocion" sea un
           * truthy.
           * Ademas si el valor de 'es_evento_promocion' es truthy pero la fecha de promocion no tiene
           * valor, o esta vacio o es igual a indefinido o esta mal iniciada, no se usara.
           * El evento se mostrara si la fecha actual aun no ha pasado la fecha de fin y la fecha
           * actual es mayot o igual a la fecha de promocion.
           */
          if (item.es_evento_promocion && ![undefined, '', ' '].includes(item.Fecha_promocion)) {
            let [dayPromocion, monthPromocion, yearPromocion] = item.Fecha_promocion.split('-')
            let fechaPromocion = new Date(+yearPromocion, +monthPromocion - 1, +dayPromocion)

            return fechaActual <= fechaFin && fechaActual >= fechaPromocion
          }

          return fechaActual >= fechaInicio && fechaActual <= fechaFin
        })
        setRegistro(eventosActuales)
        setLoading(false)
      })
      .catch((error) => console.error(error))
  }

  /** Item que se repite en el Carusel de Rectangulos.' */
  const CuadroCarusel = ({ item }) => {
    if (!item) {
      return <></>
    }

    const imageUrl = { uri: item.link_imagen }

    return (
      <View style={[styles.boxCarusel, { height: itemHeight }]}>
        <Pressable
          onPress={() => {
            props.navigation.push('MetroInformaDetalle', { data: item })
          }}
        >
          <Image style={[styles.imgCarusel, { height: itemHeight * 0.65 }]} source={imageUrl} />
          <View style={[styles.bodyCarusel, { height: itemHeight * 0.35 }]}>
            <Text style={[styles.bodyCaruselTitulo, Estilos.tipografiaBold]}>{item.Titulo_evento}</Text>

            <Text style={[styles.bodyCaruselLink, Estilos.tipografiaMedium]}>ver más {'>>'}</Text>
          </View>
        </Pressable>
      </View>
    )
  }

  const initCarousel = () => {
    if (opacity == 0) {
      // this.carouselAgenda.snapToItem(0);
      setOpacity(1)
    }
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
        outputRange: [0.4, 1, 0.4],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [0.9, 1, 0.9],
          }),
        },
      ],
    }
  }

  const fecha = monthNames[new Date().getMonth()]

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: sliderHeight / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        {/** Este es el container del carousel.' */}
        <View>
          <Text style={[Estilos.tipografiaBold, styles.titulo]}>Actividades</Text>
          {/* <Text style={[Estilos.tipografiaLight, styles.subtitulo]}>
            Eventos del mes:
            <Text style={[Estilos.tipografiaMedium]}> {fecha}</Text>
          </Text> */}
          {/* Le agregamos al buscador el valor de searchText, de esa manera si se cambia la variable atraves de un setState, se modificaria el valor del texto del buscador
                    <TextInput style={[styles.buscador, Estilos.texto]}  placeholderTextColor='#666' placeholder="Busca eventos históricos"  value={searchText} onChangeText={text=>{
                        //Cada vez que se ejecuta el trigger de onChangeText  (Que es cuando se modifica el texto del buscador), se igualara el searchText a lo que sea que se haya escrito.
                        // this.setState({ searchText:text})
                        //  this.filterData(text)

                        }}>
                    </TextInput>
                    */}

          {/** Este es el carousel del rectangulo.' */}
          <Carousel
            ref={(c) => (this.carouselAgenda = c)}
            data={registro}
            renderItem={CuadroCarusel}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            containerCustomStyle={[styles.carouselContainer, { opacity: opacity }]}
            onSnapToItem={(indexPaso) => setIndex(indexPaso)}
            scrollInterpolator={scrollInterpolator2}
            slideInterpolatedStyle={animatedStyles2}
            useScrollView={false}
          />
        </View>
        <View style={[styles.tarjeta]}>
          <Text
            style={[
              Estilos.tipografiaLight,
              styles.subtituloMasInformacion,
              Estilos.tipografiaBold,
              { textAlign: 'center' },
            ]}
          >
            ¿Te interesa publicar un evento?
          </Text>
          <View style={[styles.contenedorTextoConEnlace]}>
            <Text style={[Estilos.tipografiaLight, styles.textoMasInformacion]}>Para más información presiona </Text>
            <Text
              style={[styles.enlace]}
              onPress={() => {
                Linking.openURL('https://forms.office.com/r/SDvyJH3hHL')
              }}
            >
              aquí
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MetroInforma
