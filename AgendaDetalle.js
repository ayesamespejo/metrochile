import { StyleSheet, Text, View, Dimensions, Image, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import Estilos from './Estilos'
import ShareIcon from './js/components/BotonCompartirAudio'
import Globals from './Globals'

const SCREEN_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = Math.round(SCREEN_WIDTH * 0.9)
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 0.9)

import CalendarioAgendaCultural from './assets/svg/cultura_comunidad/CalendarioAgendaCultural.svg'
import IconoHorariosRutaExpresa from './assets/svg/cultura_comunidad/IconoHorariosRutaExpresa.svg'
import EmpresaAgendaCultural from './assets/svg/cultura_comunidad/EmpresaAgendaCultural.svg'
import UbicacionAgendaCultural from './assets/svg/cultura_comunidad/UbicacionAgendaCultural.svg'
import EstacionAgendaCultural from './assets/svg/cultura_comunidad/EstacionAgendaCultural.svg'
import TarifasHome from './assets/svg/cultura_comunidad/TarifasHome.svg'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH * 0.9,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: SCREEN_WIDTH * 0.08,
    backgroundColor: Globals.COLOR.GRIS_1,
    borderRadius: 20,
    padding: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_WIDTH * 0.1,
  },
  imgCarusel: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: SCREEN_WIDTH * 0.8,
    marginLeft: 'auto',
    marginRight: 'auto',
    height: ITEM_HEIGHT * 0.65,
    resizeMode: 'stretch',
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
  textoDescripcion: {
    ...Estilos.textoGeneral,
    marginTop: SCREEN_WIDTH * 0.03,
    textAlign: 'justify',
  },
})

const AgendaDetalle = (props) => {
  /**
   * Obtenemos el evento heredado del Carusel
   */
  const evento = props.route.params.data

  /**
   * Funcion que entrega la seccion de las fechas que se diferencia de un evento unico de los evntos normales.
   * @param {obj} data Tiene la data del evento
   * @returns JSX.Element
   */
  const SeccionFechas = (data) => {
    let texto = data.evento.es_evento_unico
      ? data.evento.Fecha_fin
      : data.evento.Fecha_inicio + ' al ' + data.evento.Fecha_fin

    return <Text style={[Estilos.textoGeneral, { marginLeft: SCREEN_WIDTH * 0.05 }]}>{texto}</Text>
  }

  const imageUrl = { uri: evento.link_imagen }

  useEffect(() => {
    props.navigation.setOptions({ title: 'Agenda Cultural' })
  }, [])

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Image style={[styles.imgCarusel]} source={imageUrl} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: SCREEN_WIDTH * 0.03 }}>
          <View style={{ paddingRight: SCREEN_WIDTH * 0.03, flex: 1 }}>
            <Text style={[Estilos.textoTitulo]}>{evento.Titulo_evento}</Text>
          </View>
          <View style={{ justifyContent: 'center', minHeight: 40,}}>
            {Boolean(evento.link_compartir) && evento.link_compartir != '' && (
              <ShareIcon message={evento.link_compartir} />
            )}
          </View>
        </View>
        <View style={styles.linea}>
          <CalendarioAgendaCultural width={24} height={24} />
          <SeccionFechas evento={evento} />
        </View>
        <View style={styles.linea}>
          <IconoHorariosRutaExpresa width={24} height={24} />
          <Text style={styles.textoLinea}>{evento.Horario}</Text>
        </View>
        <View style={styles.linea}>
          <EmpresaAgendaCultural width={24} height={24} />
          <Text style={styles.textoLinea}>{evento.Entidad}</Text>
        </View>
        <View style={styles.linea}>
          <UbicacionAgendaCultural width={24} height={24} />
          <Text style={styles.textoLinea}>{evento.Dirección}</Text>
        </View>
        <View style={styles.linea}>
          <EstacionAgendaCultural width={24} height={24} />
          <Text style={styles.textoLinea}>{evento.Estación}</Text>
        </View>
        <View style={styles.linea}>
          <TarifasHome width={24} height={24} />
          <Text style={styles.textoLinea}>{evento.Precio}</Text>
        </View>
        <Text style={[Estilos.textoSubtitulo, { marginTop: SCREEN_WIDTH * 0.05 }]}>Descripción:</Text>
        <Text style={styles.textoDescripcion}>{evento.Descripción}</Text>
      </View>
    </ScrollView>
  )
}

export default AgendaDetalle
