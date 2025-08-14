import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ActivityIndicator,
  ScrollView,
  Pressable,
  FlatList,
  Linking,
} from 'react-native'
import Estilos from './Estilos'
import Video from 'react-native-video'
import Globals from './Globals'
import TituloCirculoEstacion from './js/components/TituloCirculoEstacion'
import BotonSimple from './components/BotonSimple'
let COLOR = Globals.COLOR
/**
 * Imagenes
 * Iconos de las combinaciones de las lineas.
 */
import EstacionOperativa from './assets/svg/estado_red/EstacionOperativa.svg'
import ChevronDown from './assets/svg/flechas/ChevronDown.svg'
import Linea1 from './assets/svg/lineas/Linea1.svg'
import Linea2 from './assets/svg/lineas/Linea2.svg'
import Linea3 from './assets/svg/lineas/Linea3.svg'
import Linea4 from './assets/svg/lineas/Linea4.svg'
import Linea4A from './assets/svg/lineas/Linea4A.svg'
import Linea5 from './assets/svg/lineas/Linea5.svg'
import Linea6 from './assets/svg/lineas/Linea6.svg'
import Linea7 from './assets/svg/lineas/Linea7.svg'
import NuevosProyectosCirculo from './assets/svg/cultura_comunidad/NuevosProyectosCirculo.svg'
import IconoHorariosRutaExpresa from './assets/svg/cultura_comunidad/IconoHorariosRutaExpresa.svg'
import UbicacionAgendaCultural from './assets/svg/cultura_comunidad/UbicacionAgendaCultural.svg'
import UsuarioPasajeQR from './assets/svg/comun/PersonCircle.svg'

const emailForLinkingComunidadMetro = 'comunidad@metro.cl'
const subjectForLinkingComunidadMetro = 'Consulta desde la app de Metro'
/**
 * Este sera el Contenido para ubicar los Nuevos Proyectos,
 * Seria mucho mejor una api con esta informacion.
 */
const contentProjects = [
  {
    projectIndex: 2,
    linea: '2',
    title: 'Extensión - Línea 2',
    //imgUrl: require('./assets/icons/titulosCirculoEstacion/L2.png'),
    textBotonDesplegable: 'Conoce la ubicación',
    hideButtons: false,
    hideButtonsLine: true,
    isVisibleTheCollapsableElement: false,
    showButtonWithCollapsableAction: true,
    textLargo: 'Mira la Ext. Línea 2 en la Red',
    colorBtn: COLOR.L2,
  },
  {
    projectIndex: 3,
    linea: '3',
    title: 'Extensión - Línea 3',
    //imgUrl: require('./assets/icons/titulosCirculoEstacion/L3.png'),
    textBotonDesplegable: 'Conoce la ubicación',
    hideButtons: false,
    hideButtonsLine: true,
    isVisibleTheCollapsableElement: false,
    showButtonWithCollapsableAction: true,
    textLargo: 'Mira la Ext. Línea 3 en la Red',
    colorBtn: COLOR.L3,
  },
  {
    projectIndex: 6,
    linea: '6',
    title: 'Extensión - Línea 6',
    //imgUrl: require('./assets/icons/titulosCirculoEstacion/L6.png'),
    textBotonDesplegable: 'Conoce la ubicación',
    textLargo: 'Mira la Línea 6 en la Red',
    hideButtons: false,
    hideButtonsLine: true,
    imageVideoSection: true,
    showButtonWithCollapsableAction: true,
    colorBtn: COLOR.L6,
  },
  {
    projectIndex: 7,
    linea: '7',
    title: 'Línea 7',
    textBotonDesplegable: 'Conoce la ubicación',
    textLargo: 'Mira la Línea 7 en la Red',
    hideButtons: false,
    hideButtonsLine: true,
    isVisibleTheCollapsableElement: false,
    showButtonWithCollapsableAction: true,
    colorBtn: COLOR.L7_Gris,
  },
  {
    projectIndex: 8,
    linea: '8',
    title: 'Línea 8',
    //imgUrl: require('./assets/icons/titulosCirculoEstacion/L8.png'),
    textBotonDesplegable: 'Conoce la ubicación',
    textLargo: 'Mira la Línea 8 en la Red',
    hideButtons: false,
    hideButtonsLine: true,
    showButtonWithCollapsableAction: false,
    showButtonWithCollapsableAction: true,
    colorBtn: COLOR.L8,
  },
  {
    projectIndex: 9,
    linea: '9',
    title: 'Línea 9',
    //imgUrl: require('./assets/icons/titulosCirculoEstacion/L9.png'),
    textBotonDesplegable: 'Conoce la ubicación',
    textLargo: 'Mira la Línea 9 en la Red',
    hideButtons: false,
    hideButtonsLine: true,
    showButtonWithCollapsableAction: false,
    colorBtn: COLOR.L9,
  },
]
/**
 * Parametros Dimensionales para la vista.
 */
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
/**
 * Estilos
 */
const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.9,
    marginLeft: 'auto',
    marginRight: 'auto',
    height: SCREEN_HEIGHT * 0.9,
  },
  boxVideo: {
    height: SCREEN_HEIGHT * 0.3,
  },
  boxImagen: {
    marginTop: SCREEN_WIDTH * 0.05,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.3,
  },
  boton: {
    flexDirection: 'row',
    height: 45,
    borderRadius: 23,
  },
  boxLineas: {
    flexDirection: 'row',
    marginLeft: 10,
    marginBottom: 26,
    marginTop: 3,
  },
  boxLineasTextos: {
    marginLeft: 10,
    width: SCREEN_WIDTH * 0.6,
  },
  tarjeta: {
    marginTop: SCREEN_WIDTH * 0.05,
    width: SCREEN_WIDTH * 0.9,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingBottom: SCREEN_WIDTH * 0.05,
    borderRadius: 20,
    backgroundColor: Globals.COLOR.GRIS_1,
  },
  linea: {
    flexDirection: 'row',
    marginTop: SCREEN_WIDTH * 0.05,
    alignItems: 'center',
  },
  textoLinea: {
    ...Estilos.textoGeneral,
    marginLeft: SCREEN_WIDTH * 0.05,
    flex: 1, // Evita overflow del texto dentro de su contenedor
  },
})

const getArregloEstaciones = (estaciones) => {
  let arreglo = {}
  estaciones.forEach((element) => (arreglo[element[0]] = element[1]))
  return Object.entries(arreglo)
}

const CirculoEstacion = () => <EstacionOperativa width={18} height={18} style={{ right: 3 }} />

const CirculoCombinacion = ({ item }) => {
  if (item == undefined || item == '') {
    return <Text style={{ marginLeft: 25 }} />
  }
  return (
    <View style={{ width: 40, height: 20, marginTop: 0, marginLeft: -15 }}>
      {item == '1' && <Linea1 with={20} height={20} />}
      {item == '2' && <Linea2 with={20} height={20} />}
      {item == '3' && <Linea3 with={20} height={20} />}
      {item == '4' && <Linea4 with={20} height={20} />}
      {item == '4A' && <Linea4A with={20} height={20} />}
      {item == '5' && <Linea5 with={20} height={20} />}
      {item == '6' && <Linea6 with={20} height={20} />}
      {item == '7' && <Linea7 with={20} height={20} />}
    </View>
  )
}
const NuevosProyectosDetalle = (props) => {
  /**
   * Obtenemos el indice del proyecto heredado de la vista de nuevos proyectos
   */
  let projectIndex = props.route.params.projectIndex

  const [state, setState] = useState({
    loading: true,
    title: '',
    //imgUrl: undefined,
    textLargo: '',
    colorBtn: '',
    projectIndex: projectIndex,
    comunasBeneficiadas: '',
    cantComunas: '',
    extKilometros: '',
    tiempoViajeAprox: '',
    poblacionBeneficiada: '',
    videoUrl: '',
    imagenUrl: '',
    urlPlanoRed: '',
    iconEstacion: undefined,
    estaciones: [],
    urlNuevosProyectos: `https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/proyectos/${projectIndex}`,
  })

  useEffect(() => {
    props.navigation.setOptions({ title: 'Nuevos proyectos' })
    getRegistroNuevosProyectos()
  }, [])

  const getRegistroNuevosProyectos = () => {
    const { urlNuevosProyectos, projectIndex } = state
    fetch(urlNuevosProyectos)
      .then((res) => res.json())
      .then((res) => {
        /**
         * Se crea una variable que contenga el primer nivel de la data para no tener que escribir todo el tiempo
         * la ubicacion de [0] que es el primer y unico elemento de la lista.
         */
        let primerNivelData = res.Items[0]
        /**
         * Utilizamos Data Extra que no viene del Api.
         */
        let {
          title,
          linea,
          //imgUrl,
          textLargo,
          textBotonDesplegable,
          hideButtons,
          hideButtonsLine,
          imageVideoSection,
          showButtonWithCollapsableAction,
          isVisibleTheCollapsableElement,
          colorBtn,
          iconEstacion,
        } = contentProjects.find((element) => element.projectIndex == projectIndex)
        /**
         * La lista de comunas beneficiadas es un string de las comunas separado por comas (,)
         * Asi que se le puede hace un split para determinar la cantidad de columnas
         */
        let comunasBeneficiadas = primerNivelData['Comunas beneficiadas']
        /**
         * Realizamos el Split aqui.
         * Una vez separado lo que hacemos es contarlo, para tener a mano la cantidad de  comunas.
         */
        let cantComunas = comunasBeneficiadas.split(',').length
        cantComunas += cantComunas == 1 ? ' Comuna' : ' Comunas'
        /**
         * La extension en Kilometros del nuevo proyecto.
         */
        let extKilometros = primerNivelData['Extensión']
        /**
         * El tiempo de viaje aproximado del nuevo proyecto.
         */
        let tiempoViajeAprox = primerNivelData['Tiempo de viaje']
        /**
         * La poblacion beneficiada del nuevo proyecto
         */
        let poblacionBeneficiada = primerNivelData['Población beneficiada']
        /**
         * El video del nuevo proyecto
         */
        let videoUrl = { uri: primerNivelData.Video }
        /**
         * Imagen que reemplaza video.
         */
        let imagenUrl = { uri: primerNivelData.imagenLinea }
        /**
         * Plano de Red.
         */
        let urlPlanoRed = { uri: primerNivelData.planodered }
        /**
         * Lista de estaciones vinculadas a la Linea
         */
        let estaciones = primerNivelData.estaciones
        setState({
          ...state,
          title: title,
          //imgUrl: imgUrl,
          linea: linea,
          textLargo: textLargo,
          colorBtn: colorBtn,
          textBotonDesplegable: textBotonDesplegable,
          hideButtons: hideButtons,
          hideButtonsLine: hideButtonsLine,
          imageVideoSection: imageVideoSection,
          showButtonWithCollapsableAction: showButtonWithCollapsableAction,
          isVisibleTheCollapsableElement: isVisibleTheCollapsableElement,
          comunasBeneficiadas: comunasBeneficiadas,
          cantComunas: cantComunas,
          extKilometros: extKilometros,
          tiempoViajeAprox: tiempoViajeAprox,
          poblacionBeneficiada: poblacionBeneficiada,
          videoUrl: videoUrl,
          imagenUrl: imagenUrl,
          urlPlanoRed: urlPlanoRed,
          iconEstacion: iconEstacion,
          estaciones: estaciones,
          arregloEstaciones: getArregloEstaciones(estaciones),
          loading: false,
        })
      })
      .catch((error) => console.error(error))
  }
  const {
    loading,
    title,
    linea,
    textLargo,
    colorBtn,
    hideButtons,
    imageVideoSection,
    videoUrl,
    imagenUrl,
    urlPlanoRed,
    comunasBeneficiadas,
    cantComunas,
    extKilometros,
    tiempoViajeAprox,
    poblacionBeneficiada,
  } = state
  const [cargandoVideo, setCargandoVideo] = useState(true);
  const [cargandoImagen, setCargandoImagen] = useState(true);
  
  
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: SCREEN_HEIGHT / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  }

  const ItemEstaciones = ({ item, index }) => {
    const { arregloEstaciones, iconEstacion, colorBtn } = state
    let titulo = item[0]
    let lineas = item[1].combinacion
    /**
     * Son un String con las combinaciones asi que lo separamos.
     */
    let listaCombinaciones = lineas.split(',')
    let primeraCombinacion = listaCombinaciones[0]
    let segundaCombinacion = listaCombinaciones[1]

    if (segundaCombinacion == undefined && primeraCombinacion != undefined) {
      segundaCombinacion = primeraCombinacion
      primeraCombinacion = undefined
    }
    return (
      <View >
        {/* <View
          style={{
            position: 'absolute',
            left: 46,
            top: -10,
            width: 20,
            height: 70,
            backgroundColor: 'green'
          }}
        /> */}
        <Pressable
          style={[styles.boxLineas]}
          onPress={() => {
            if (item[1].imagen) {
              props.navigation.push('NuevosProyectosImagenes', { estacion: item, linea })
            }
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: 46,
              top: -30,
              width: 20,
              height: 70,
              backgroundColor: colorBtn,
            }}
          />
          <CirculoCombinacion item={primeraCombinacion} />
          <CirculoCombinacion item={segundaCombinacion} />
          <CirculoEstacion iconEstacion={iconEstacion} />
          <Text style={[Estilos.textoGeneral, { marginLeft: SCREEN_WIDTH * 0.03, width: SCREEN_WIDTH * 0.63 }]}>
            {titulo}
          </Text>
        </Pressable>
        {index == arregloEstaciones.length - 1 && (
          <View
            style={{
              //position: 'absolute',
              left: 36,
              top: -6,
              width: 60,
              height: 20,
              borderRadius: 10,
              backgroundColor: colorBtn,
            }}
          />
        )}
      </View>
    )
  }

  const ButtonNavigation = ({}) => {
    const {
      title,
      //imgUrl,
      colorBtn,
      textBotonDesplegable,
      iconEstacion,
      estaciones,
      projectIndex,
      hideButtonsLine,
      showButtonWithCollapsableAction,
      isVisibleTheCollapsableElement,
      arregloEstaciones,
    } = state

    if (!hideButtonsLine) {
      return (
        <Pressable
          style={[styles.boton, { marginTop: SCREEN_WIDTH * 0.05, backgroundColor: colorBtn }]}
          onPress={() => {
            props.navigation.push('NuevosProyectosEstaciones', {
              //imgUrl,
              title,
              textBotonDesplegable,
              iconEstacion,
              estaciones,
              projectIndex,
            })
          }}
        >
          <Text
            style={[
              Estilos.textoBoton,
              {
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: 'auto',
                marginTop: 'auto',
                color: 'white',
              },
            ]}
          >
            {textBotonDesplegable}
          </Text>
        </Pressable>
      )
    }
    if (showButtonWithCollapsableAction) {
      return (
        <View>
          <Pressable
            style={[styles.boton, { marginTop: SCREEN_WIDTH * 0.05, backgroundColor: colorBtn }]}
            onPress={() => {
              let changeVariable = !isVisibleTheCollapsableElement
              setState({
                ...state,
                isVisibleTheCollapsableElement: changeVariable,
              })
            }}
          >
            <Text
              style={[
                Estilos.textoBoton,
                {
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginBottom: 'auto',
                  marginTop: 'auto',
                  color: 'white',
                },
              ]}
            >
              {textBotonDesplegable}
            </Text>
            <ChevronDown
              width={20}
              height={20}
              fill={'#FFFFFF'}
              style={{
                marginRight: 10,
                marginBottom: 'auto',
                marginTop: 'auto',
                transform: [{ rotate: isVisibleTheCollapsableElement ? '-180deg' : '0deg' }],
              }}
            />
          </Pressable>
          {isVisibleTheCollapsableElement ? (
            <FlatList
              style={{
                // paddingTop: 20,
                // marginTop: 20,
                // marginBottom: 2,
                alignSelf: 'stretch',
              }}
              data={arregloEstaciones}
              ListHeaderComponent={
                <View
                style={{
                  // position: 'absolute',
                  left: 55,
                  top: -20,
                  width: 20,
                  height: 26,
                  backgroundColor: 'transparent'
                }}
              />
              }
              renderItem={ItemEstaciones}
              keyExtractor={(item, index) => index}
            />
          ) : (
            <></>
          )}
        </View>
      )
    }
    return <></>
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: SCREEN_WIDTH * 0.08,
          }}
        >
          <TituloCirculoEstacion linea={linea} texto={title} />
          {/* {projectIndex == 6 && <Linea6 width={32} height={32} />}
          {projectIndex == 7 && <Linea7 width={32} height={32} />}
          {projectIndex == 8 && <Linea8 width={32} height={32} />}
          {projectIndex == 9 && <Linea9 width={32} height={32} />}
          <Text
            style={[
              Estilos.textoSubtitulo,
              { marginBottom: 'auto', marginTop: 'auto', marginLeft: SCREEN_WIDTH * 0.03 },
            ]}
          >
            {title}-({linea})
          </Text> */}
        </View>
        {!imageVideoSection && (
          <>
          <View style={[styles.boxVideo, { marginTop: SCREEN_WIDTH * 0.05 }]}>
            <Video
              source={videoUrl}
              ref={(ref) => {
                this.player = ref
              }}
              onLoad={() => {
                this.player.seek(0.5)
                setCargandoVideo(false)
              }}
              resizeMode="contain"
              controls={true}
              paused={true}
              style={{
                width: '100%',
                height: SCREEN_WIDTH * 0.65,
              }}>
                {/* {cargandoVideo && <ActivityIndicator size="large" style={{marginTop: SCREEN_WIDTH * 0.3}} color="#43464E"/>} */}
              </Video>
          </View>
          </>
        )}
        {imageVideoSection && (
          <View style={[styles.boxImagen]}>
            <Image
              style={{
                width: '100%',
                height: '100%',
              }}
              source={imagenUrl}
              onLoadEnd={() => {
                setCargandoImagen(false)
              }} >
              </Image>
          </View>
        )}
        <ButtonNavigation />
        <View style={styles.tarjeta}>
          <View style={styles.linea}>
            <NuevosProyectosCirculo width={24} height={24} />
            <Text style={styles.textoLinea}>Extensión de la Línea {extKilometros}</Text>
          </View>
          <View style={styles.linea}>
            <IconoHorariosRutaExpresa width={24} height={24} />
            <Text style={styles.textoLinea}>Tiempo de Viaje Aprox. {tiempoViajeAprox}</Text>
          </View>
          <View style={styles.linea}>
            <UsuarioPasajeQR width={24} height={24} />
            <Text style={styles.textoLinea}>Población Beneficiada {poblacionBeneficiada}</Text>
          </View>
          <View style={styles.linea}>
            <UbicacionAgendaCultural width={24} height={24} />
            <Text style={styles.textoLinea}>
              {cantComunas}: {comunasBeneficiadas}
            </Text>
          </View>
        </View>
        {!hideButtons && (
          <View style={{ marginTop: SCREEN_WIDTH * 0.05, alignItems: 'center' }}>
            <BotonSimple
              texto={textLargo}
              colorTexto="#FFFFFF"
              onPress={() => {
                props.navigation.push('NuevosProyectosPlano', {
                  planoDeRed: urlPlanoRed,
                })
              }}
              color={colorBtn}
              width={SCREEN_WIDTH * 0.8}
            />
          </View>
        )}
        <View style={{ marginTop: SCREEN_WIDTH * 0.05, alignItems: 'center' }}>
          <BotonSimple
            texto="Contáctanos"
            colorTexto="#FFFFFF"
            onPress={() => {
              const subject = encodeURI(subjectForLinkingComunidadMetro)
              return Linking.openURL(`mailto:${emailForLinkingComunidadMetro}?subject=${subject}`)
            }}
            color={colorBtn}
            width={SCREEN_WIDTH * 0.8}
          />
        </View>
        <View style={{ height: 70 }} />
      </ScrollView>
    </View>
  )
}

export default NuevosProyectosDetalle
