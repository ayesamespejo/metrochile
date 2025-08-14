import React, { useState, useEffect } from 'react'
import {
  AppState,
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import TrackPlayer from 'react-native-track-player'
import Estilos from './Estilos'
import ShareIcon from './js/components/BotonCompartirAudio'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

// Metodo para determinar si el track se encuentra dentro de las fechas actuales.
const compareDates = (element) => {
  // Extraemos los valores de las fechas
  let [endDay, endMonth, endYear] = element[7].split('/')
  let [startDay, startMonth, startYear] = element[8].split('/')
  // Creamos valores de las fechas.
  let dateNow = new Date()
  let start = new Date(+startYear, startMonth - 1, +startDay)
  let end = new Date(+endYear, endMonth - 1, +endDay)
  // Comparamos y mandamos el resultado.
  return dateNow >= start && dateNow <= end
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '6%',
  },
  title: {
    marginLeft: 15,
    marginTop: 15,
    lineHeight: 22,
  },
  trackItem: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 8,
    height: SCREEN_HEIGHT * 0.12,
    borderTopColor: '#CCC',
    borderTopWidth: 1,
  },
  imgTrackItem: {
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
    height: SCREEN_HEIGHT * 0.1,
    resizeMode: 'stretch',
    ...Platform.select({
      android: {
        borderRadius: 42,
      },
      ios: {
        borderRadius: 18,
      },
      default: {
        // other platforms, ios, web for example
      },
    }),
  },
  imgTrackHeader: {
    borderRadius: 20,
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_HEIGHT * 0.2,
  },
  trackHeader: {
    alignSelf: 'center',
    maxHeight: SCREEN_HEIGHT * 0.4,
  },
  trackHeaderController: {
    display: 'flex',
    flexDirection: 'row',
  },
  textLight: [
    Estilos.subtitulos,
    Estilos.tipografiaLight,
    {
      textAlign: 'left',
      lineHeight: 22,
    },
  ],
  textBold: [
    Estilos.bajada,
    Estilos.tipografiaMedium,
    {
      textAlign: 'left',
      lineHeight: 22,
    },
  ],
})

const AudioDigital = (props) => {
  // Cambiar el nombre del Header.
  props.navigation.setOptions({ title: 'MetroPodcast' })
  // Se setea el Estado del Componente.
  const [state, setState] = useState({
    loading: true,
    tracks: [],
    nowPlayingTrack: undefined,
    lastPlayingTrack: undefined,
    url: 'https://8pt7kdrkb0.execute-api.us-east-1.amazonaws.com/UAT/audio',
  })

  const getTracks = async (AudioDigital) => {
    const { url } = state
    let res = await fetch(url)
    let datos = await res.json()
    //let datosEditados = datos['audio'].filter(element => compareDates(element) ).map((element) =>
    let datosEditados = datos['audio']
      .map((element) => ({
        id: element[0],
        url: { uri: element[4] },
        title: element[3],
        urlSpotify: element[2],
        duration: element[5],
        createdAt: element[6],
        artwork: { uri: element[1] },
        isPlaying: false,
      }))
      .sort((a, b) => a.id > b.id)
      .map((element, index) => ({ ...element, ...{ positionIndex: index } }))
    setState({ ...state, tracks: datosEditados, loading: false })

    return datosEditados
  }

  const setUpTrackPlayer = async (AudioDigital) => {
    try {
      const tracks = await getTracks(AudioDigital)
      // Configuraciones del TrackPlayer
      await TrackPlayer.setupPlayer().then(
        TrackPlayer.updateOptions({
          stopWithApp: true,
          android: {
            // This is the default behavior
            appKilledPlaybackBehavior: 'pause-playback',
          },
          capabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_STOP,
            TrackPlayer.CAPABILITY_SEEK_TO,
          ],
          // Capabilities that will show up when the notification is in the compact form on Android
          compactCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_STOP,
            TrackPlayer.CAPABILITY_SEEK_TO,
          ],
        }),
      )
      await TrackPlayer.add(tracks)
        .then(console.log('Tracks Added'))
        .catch((error) => console.log(error))
    } catch (e) {
      console.log(e)
    }
  }

  // Funcion para obtener la cancion actual, utilizando un switch para determinar cual es la cancion que se ha mantenido.
  const getCurrentlyTrack = (track, lastTrack) => {
    let currentlyTrack = undefined
    switch (true) {
      case Boolean(track):
        currentlyTrack = track
        break
      case Boolean(lastTrack):
        currentlyTrack = lastTrack
        break
    }
    return currentlyTrack
  }

  // Seccion de Cabecera del audio que actualmente se esta reproduciendo.
  const TrackItemHeader = ({ track, lastTrack }) => {
    // Obtenemos la cancion actual.
    let currentlyTrack = getCurrentlyTrack(track, lastTrack)
    // Si la cancion esta indefinida, osea no hay ninguna cancion activa entonces....
    return !currentlyTrack ? (
      <></>
    ) : (
      <View style={[styles.trackHeader]}>
        <View style={{ alignSelf: 'center' }}>
          <Image style={[styles.imgTrackHeader]} source={currentlyTrack.artwork} />
        </View>
        <View style={styles.trackHeaderController}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => TrackItemOnPressFunction(parseInt(currentlyTrack.positionIndex) - 1)}
          >
            <FontAwesome5
              style={{ textAlign: 'right', marginTop: 15, fontSize: 20, color: '#43464E' }}
              name="step-backward"
            />
          </Pressable>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => TrackItemOnPressFunction(parseInt(currentlyTrack.positionIndex))}
          >
            <FontAwesome5
              style={{ textAlign: 'center', marginTop: 10, fontSize: 30, color: '#E32731' }}
              name={currentlyTrack.isPlaying ? 'pause' : 'play'}
            />
          </Pressable>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => TrackItemOnPressFunction(parseInt(currentlyTrack.positionIndex) + 1)}
          >
            <FontAwesome5
              style={{ textAlign: 'left', marginTop: 15, fontSize: 20, color: '#43464E' }}
              name="step-forward"
            />
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          <Text style={[styles.textBold, Estilos.bajada, { alignSelf: 'center', marginTop: 10 }]}>
            {' '}
            {currentlyTrack.title}{' '}
          </Text>
          {currentlyTrack.urlSpotify != '' && (
            <ShareIcon
              message={currentlyTrack.urlSpotify}
              style={{ left: 10, fontSize: 25, color: '#43464E', marginTop: 14 }}
            />
          )}
        </View>
        <Text
          style={[
            styles.textLight,
            Estilos.subtitulos,
            { alignSelf: 'center', marginTop: 19, bottom: 10, color: '#43464E' },
          ]}
        >
          {currentlyTrack.createdAt} - {currentlyTrack.duration}{' '}
        </Text>
      </View>
    )
  }

  //Elemento de la lista de Audios.
  const TrackItem = ({ item, index, keyValue }) => {
    let titleTextStyle = item.isPlaying ? [styles.textBold, Estilos.bajada] : [styles.textLight]
    return (
      <Pressable onPress={() => TrackItemOnPressFunction(index)} key={keyValue} style={styles.trackItem}>
        {/** Esta es la seccion de la imagen que cubre el 25% del elemento */}
        <View style={[{ flex: 1 }]}>
          <Image style={[styles.imgTrackItem]} source={item.artwork} />
        </View>
        {/** Esta es la seccion donde esta el texto y la informacion del audio que conforma 75% del elemento */}
        <View style={[{ flex: 3, paddingLeft: 10 }]}>
          <Text style={[titleTextStyle, { top: 25, color: '#43464E' }]}> {item.title} </Text>
          <Text style={[Estilos.subtitulos, styles.textLight, { top: 28, color: '#43464E' }]}>
            {' '}
            {item.createdAt} - {item.duration}{' '}
          </Text>
        </View>
      </Pressable>
    )
  }

  //Controlador de la lista de Reproducciones.
  const TrackItemOnPressFunction = (index) => {
    const { tracks, nowPlayingTrack, lastPlayingTrack } = state
    // hequeamos si el index es -1 o mayor al length de la lista de canciones, de ser el caso, entonces debe moverse a la primera o ultima posicion respectivamente.
    switch (true) {
      case index == -1:
        index = tracks.length - 1
        break
      case index >= tracks.length:
        index = 0
        break
    }
    // Buscamos en la lista de canciones cual es la cancion que fue escogida.
    let choosedTrack = tracks[index]
    let newValue = !choosedTrack.isPlaying
    // Reinicio de la lista de canciones.
    tracks.forEach((element) => (element.isPlaying = 0))
    choosedTrack.isPlaying = newValue
    // Condicional para saber si , se reproducira el mismo que ya se reproducio antes
    let currentlyTrackIsTheSameAsTheLastTrack = lastPlayingTrack != undefined && choosedTrack.id == lastPlayingTrack.id
    // Determinar cual es la Cancion que se reproduce ahora.
    const playingTrack = choosedTrack.isPlaying ? choosedTrack : undefined
    // Guardamos en la variable la ultima reproduccion.
    let lastPlayingTrackAux = playingTrack == undefined && nowPlayingTrack != undefined ? nowPlayingTrack : undefined
    TrackPlayerControl(playingTrack, currentlyTrackIsTheSameAsTheLastTrack)
    setState({ ...state, tracks, nowPlayingTrack: playingTrack, lastPlayingTrack: lastPlayingTrackAux })
  }

  //Controlador del Reproductor.
  const TrackPlayerControl = (track, currentlyTrackIsTheSameAsTheLastTrack) => {
    if (track != undefined) {
      if (currentlyTrackIsTheSameAsTheLastTrack) {
        TrackPlayer.play()
        return
      }
      let indiceTrack = parseInt(track.positionIndex)
      // El index se toma a partir de la posicion 0. y los tracks parten desde el numero 1.
      TrackPlayer.skip(indiceTrack)
        .then(TrackPlayer.play())
        .catch((error) => console.log(error))
    } else {
      TrackPlayer.pause()
    }
  }

  // Accion que se ejecuta una vez antes de renderizar la primera vez.

  useEffect(() => {
    setUpTrackPlayer(this)
    AppState.addEventListener('change', handleAppStateChange)
  }, [])

  // Funcion para controlar cuando se sale de la pantalla.
  const handleAppStateChange = (nextAppState) => {
    // Reproductor de Audio
    // Que se limpien las opciones cuando se abra la aplicacion.
    if (nextAppState == 'active') {
      const { tracks } = state
      tracks.forEach((element) => (element.isPlaying = 0))
      setState({ ...state, tracks: tracks, nowPlayingTrack: undefined })
    }
    // Reproductor de Audio
    // Que se detenga cuando la aplicacion se vuelva a abrir.
    if (nextAppState == 'background') {
      TrackPlayer.pause().catch((error) => console.log(error))
    }
  }

  const { tracks, nowPlayingTrack, lastPlayingTrack, loading } = state
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ marginTop: SCREEN_HEIGHT / 2.5 }}>
          <ActivityIndicator size="large" color="#43464E" />
        </View>
      </SafeAreaView>
    )
  }

  // Obtener el valor del MaxHeight dependiendo si en la vista esta activo o no el reproductor
  let maxHeightValue = !nowPlayingTrack ? SCREEN_HEIGHT * 0.85 : SCREEN_HEIGHT * 0.57

  return (
    <View style={styles.container}>
      <TrackItemHeader track={nowPlayingTrack} lastTrack={lastPlayingTrack} />
      <ScrollView style={{ maxHeight: maxHeightValue }} showsVerticalScrollIndicator={false}>
        <Text style={[Estilos.textoTitulo]}> Todos los Episodios: </Text>
        {tracks.map((item, index) => (
          <TrackItem
            item={item}
            index={index}
            key={`k_pro_${Math.round(Math.random() * 1000)}`}
            keyValue={`k_projects_${Math.round(Math.random() * 1000)}`}
          />
        ))}
      </ScrollView>
    </View>
  )
}

export default AudioDigital
