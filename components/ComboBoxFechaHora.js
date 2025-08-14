import { Pressable, StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'

import Estilos from '../Estilos'
import DatePicker from 'react-native-date-picker'
import CalendarDay from '../assets/svg/comun/CalendarDays.svg'
import Globals from '../Globals'

const WIDTH = Dimensions.get('window').width

const ComboBoxFechaHora = ({ fechaHoraInicial, fechaLimpia, placeHolder, onChange }) => {
  const [fechaHora, setFechaHora] = useState(fechaHoraInicial)
  const [fechaHoraTexto, setFechaHoraTexto] = useState('')
  const [selectVisible, setSelectVisible] = useState(false)

  useEffect(() => {})

  const styles = StyleSheet.create({
    contenedorGeneral: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
    },
    contenedorDatePicker: {
      alignItems: 'center',
    },
    contenedorTexto: {
      height: 45,
      alignItems: 'center',
    },
    texto: {
      fontSize: 16,
      color: fechaLimpia ? Globals.COLOR.GRIS_4 : '#000000',
    },
    contenedorSeparador: {
      alignItems: 'center',
    },
    separador: {
      width: '90%',
      height: 1,
      backgroundColor: Globals.COLOR.GRIS_3,
    },
  })

  // const formateaFechaHora = (fecha) => {
  //   const fechaHoraFormato =
  //     ('00' + fecha.getDate()).slice(-2) +
  //     '/' +
  //     ('00' + (fecha.getMonth() + 1)).slice(-2) +
  //     '/' +
  //     fecha.getFullYear() +
  //     ' ' +
  //     ('00' + fecha.getHours()).slice(-2) +
  //     ':' +
  //     ('00' + fecha.getMinutes()).slice(-2)
  //   // Intl.DateTimeFormat('es-CL').format(fecha).replaceAll('-', '/') +
  //   // ' ' +
  //   // Intl.DateTimeFormat('es-CL', { timeStyle: 'short' }).format(fecha)
  //   // setFechaHoraTexto(fechaHoraFormato)
  //   onChange(fechaHoraFormato)
  // }

  const onAceptar = (fecha) => {
    const fechaHoraFormato =
      ('00' + fecha.getDate()).slice(-2) +
      '/' +
      ('00' + (fecha.getMonth() + 1)).slice(-2) +
      '/' +
      fecha.getFullYear() +
      ' ' +
      ('00' + fecha.getHours()).slice(-2) +
      ':' +
      ('00' + fecha.getMinutes()).slice(-2)
    setFechaHoraTexto(fechaHoraFormato)
    onChange(fechaHoraFormato)
    setSelectVisible(false)
  }

  const onCancelar = () => {
    setSelectVisible(false)
  }

  return (
    <View style={styles.contenedorGeneral}>
      <Pressable
        style={[Estilos.containerComboClaro, styles.contenedorTexto]}
        onPress={() => setSelectVisible(!selectVisible)}
      >
        <Text style={[Estilos.tipografiaLight, styles.texto]}>{fechaLimpia ? placeHolder : fechaHoraTexto}</Text>
        <CalendarDay width={20} height={20} fill={Globals.COLOR.GRIS_3} />
      </Pressable>
      {selectVisible && (
        <View>
          <View>
            <View style={styles.contenedorSeparador}>
              <View style={styles.separador} />
            </View>
            <View style={styles.contenedorDatePicker}>
              <DatePicker
                date={fechaHora}
                locale="es"
                onDateChange={(dateTime) => {
                  // formateaFechaHora(dateTime)
                  setFechaHora(dateTime)
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', borderColor: Globals.COLOR.GRIS_3, borderTopWidth: 1 }}>
            <Pressable
              onPress={() => onAceptar(fechaHora)}
              style={{ flex: 1, alignItems: 'center', padding: WIDTH * 0.04 }}
            >
              <View>
                <Text style={[Estilos.tipografiaMedium, { fontSize: 16, color: '#0798EA' }]}>Aceptar</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={onCancelar}
              style={{
                flex: 1,
                alignItems: 'center',
                borderColor: Globals.COLOR.GRIS_3,
                borderLeftWidth: 1,
                padding: WIDTH * 0.04,
              }}
            >
              <View>
                <Text style={[Estilos.tipografiaMedium, { fontSize: 16 }]}>Cancelar</Text>
              </View>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  )
}

export default ComboBoxFechaHora
