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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Estilos from './Estilos';
import Carousel from 'react-native-new-snap-carousel';
import Globals from './Globals';
import {
  scrollInterpolator,
  animatedStyles,
} from './js/utils/carouselAgendaAnimations';

const HEIGHT = Dimensions.get('window').width

/** Estructura dinamica para determinar el tamaño */
const window = Dimensions.get('window');
const {width, height} = window;
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
];

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 0,
  },
  container: {
    height: 200,
    padding: 20,
    justifyContent: 'space-around',
  },
  titulo: {
    fontSize: 20,
    marginVertical: width * 0.08,
    marginLeft: width * 0.08,
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
});

const getInputRangeFromIndexes = (range, index, carouselProps) => {
  const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
  let inputRange = [];
  for (let i = 0; i < range.length; i++) {
      inputRange.push((index - range[i]) * sizeRef);
  }
  return inputRange;
}

const scrollInterpolator2 = (index, carouselProps) => {
  const range = [1, 0, -1];
  const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
  const outputRange = range;
  return { inputRange, outputRange };
}

const animatedStyles2 = (index, animatedValue, carouselProps) => {
  return {
      opacity: animatedValue.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0.4, 1, 0.4],
          extrapolate: 'clamp'
      }),
      transform: [{
        scale: animatedValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [0.95, 1, 0.95]
        })
    }]
  }
}

const Agenda = props => {
  /**
   * Cambiar el nombre del Header.
   */
  useEffect(() => {
    props.navigation.setOptions({ title: 'Agenda Cultural' });
  }, []);

  // const [dimensions, setDimensions] = useState(...calculateDimensions(window));

  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [registro, setRegistro] = useState([]);
  // const [searchText, setSearchText] = useState('');
  const [opacity, setOpacity] = useState(0);
  const url =
    'https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/agendacultural';

  const [sliderWidth, setSliderWidth] = useState(width);
  const [sliderHeight, setSliderHeight] = useState(height);
  const [itemWidth, setItemWidth] = useState(Math.round(width * 0.8));
  const [itemHeight, setitemHeight] = useState(
    Math.round(Math.round(width * 0.85) * 0.95),
  );
  const [isLandScape, setisLandScape] = useState(width < height);

  // this.state = {
  //   ...this.calculateDimensions(window),
  //   loading: true,
  //   index: 0,
  //   registro: [],
  //   searchText: '',
  //   opacity: 0,
  //   url: 'https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/agendacultural',
  // };

  useEffect(() => {
    const dimensionsSubscription = Dimensions.addEventListener(
      'change',
      onChange,
    );
    getRegistro();

    initCarousel();

    return () => {
      dimensionsSubscription?.remove();
    };
  }, []);

  //   const calculateDimensions = ({height, width}) => ({
  //     sliderWidth: width,
  //     sliderHeight: height,
  //     itemWidth: Math.round(width * 0.9),
  //     itemHeight: Math.round(Math.round(width * 0.9) * 0.95),
  //     isLandScape: width < height,
  //   });

  const onChange = () => {
    setSliderWidth(width);
    setSliderHeight(height);
    setItemWidth(Math.round(width * 0.9));
    setitemHeight(Math.round(Math.round(width * 0.9) * 0.95));
    setisLandScape(width < height);

    // this.setState({dimensions: {window}, ...this.calculateDimensions(window)});
  };

  const getRegistro = () => {
    fetch(url)
      .then(res => res.json())
      .then(res => {
        /**
         * Revisemos los datos.
         * Mandamos solamente los Indices mayores.
         */
        const eventosActuales = res.Items.filter(item =>
          Boolean(item.link_imagen),
        ).filter(item => {
          /**
           * Filtro para determinar si el evento esta dentro de las fechas recientes
           */
          const [dayInicio, monthInicio, yearInicio] =
            item.Fecha_inicio.split('-');
          const [dayFin, monthFin, yearFin] = item.Fecha_fin.split('-');

          const fechaInicio = new Date(
            +yearInicio,
            +monthInicio - 1,
            +dayInicio,
          );
          const fechaFin = new Date(+yearFin, +monthFin - 1, +dayFin);
          fechaFin.setDate(fechaFin.getDate() + 1);
          const fechaActual = new Date();

          /**
           * Evaluacion de las propiedades es_evento_promocion y Fecha_promocion.
           * La Fecha_promocion, solamente se utilizara cuando el valor de "es_evento_promocion" sea un
           * truthy.
           * Ademas si el valor de 'es_evento_promocion' es truthy pero la fecha de promocion no tiene
           * valor, o esta vacio o es igual a indefinido o esta mal iniciada, no se usara.
           * El evento se mostrara si la fecha actual aun no ha pasado la fecha de fin y la fecha
           * actual es mayot o igual a la fecha de promocion.
           */
          if (
            item.es_evento_promocion &&
            ![undefined, '', ' '].includes(item.Fecha_promocion)
          ) {
            let [dayPromocion, monthPromocion, yearPromocion] =
              item.Fecha_promocion.split('-');
            let fechaPromocion = new Date(
              +yearPromocion,
              +monthPromocion - 1,
              +dayPromocion,
            );

            return fechaActual <= fechaFin && fechaActual >= fechaPromocion;
          }

          return fechaActual >= fechaInicio && fechaActual <= fechaFin;
        });

        setRegistro(eventosActuales);
        setLoading(false);
      })
      .catch(error => console.error(error));
  };

  /** Item que se repite en el Carusel de Rectangulos.' */
  const CuadroCarusel = ({item}) => {
    if (!item) {
      return <></>;
    }

    const imageUrl = {uri: item.link_imagen};

    return (
      <View style={[styles.boxCarusel, {height: itemHeight, width: itemWidth, backgroundColor: '#000'}]}>
        <Pressable
          onPress={() => {
            props.navigation.push('AgendaDetalle', {data: item});
          }}>
            <Image
              style={[styles.imgCarusel, {height: itemHeight * 0.65}]}
              source={imageUrl}
            />
          <View style={[styles.bodyCarusel, {height: itemHeight * 0.35}]}>
            <Text style={[styles.bodyCaruselTitulo, Estilos.tipografiaBold]}>
              {item.Titulo_evento}
            </Text>
            <Text style={[styles.bodyCaruselLink, Estilos.tipografiaMedium]}>
              ver más {'>>'}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  };

  const initCarousel = () => {
    if (opacity == 0) {
      // this.carouselAgenda.snapToItem(0);
      setOpacity(1);
    }
  };

  const fecha = monthNames[new Date().getMonth()];
  // const {sliderWidth, sliderHeight, itemWidth} = this.state;

  if (loading) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{marginTop: sliderHeight / 2.5}}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        {/** Este es el container del carousel.' */}
        <View>
          <Text style={[Estilos.tipografiaBold, styles.titulo]}>
            Cartelera
          </Text>
          {/* <Text
            style={[
              Estilos.tipografiaLight,
              {fontSize: 16, left: 25, top: 25},
            ]}>
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
            ref={c => (this.carouselAgenda = c)}
            data={registro}
            renderItem={CuadroCarusel}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            containerCustomStyle={[
              styles.carouselContainer,
              {opacity: opacity},
            ]}
            onSnapToItem={index => setIndex(index)}
            scrollInterpolator={scrollInterpolator2}
            slideInterpolatedStyle={animatedStyles2}
            useScrollView={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Agenda;
