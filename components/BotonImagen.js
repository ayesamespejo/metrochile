import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import DocumentPicker from 'react-native-document-picker'

import Estilos from '../Estilos'
import Imagen from '../assets/svg/image.svg'
import Photo from '../assets/svg/photo.svg'
import Documento from '../assets/svg/document.svg'
import XmarkSolid from '../assets/svg/combobox/xmark-solid.svg'
import Globals from '../Globals'

const BotonImagen = ({ onTomarImagen }) => {
  const [imagen, setImagen] = useState(false)

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
    },
    contenedorSeparador: {
      alignItems: 'center',
    },
    separador: {
      width: '90%',
      height: 1,
      backgroundColor: '#CCCCCC',
    },
    contenedorImagen: {
      padding: 10,
      alignItems: 'center',
    },
    imagen: {
      height: 200,
      width: 200,
    },
  })

  const seleccionarImagen = () => {
    const opciones = {
      title: 'Sellecciona una imagen',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }
    launchImageLibrary(opciones, (response) => {
      console.log(response.assets[0])
      setImagen(response.assets[0])
      onTomarImagen(response.assets[0])
    })
  }

  const seleccionarDocumento = () => {
    try {
      DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx]
      }).then((doc) => {
        console.log(doc)
      })
    } catch (err) {
      if (DocumentPicker.isCancel(err)) console.log('Usuario canceló selección de documento')
      else console.log(err)
    }
  }

  const tomarFoto = () => {
    const opciones = {
      title: 'Tomar una foto',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      includeBase64: true,
    }

    launchCamera(opciones, (response) => {
      if (response.errorCode) {
        console.log(response.errorMessage)
      } else if (response.didCancel) {
        console.log('Se canceló la foto')
      } else {
        console.log(response.assets[0])
        setImagen(response.assets[0])
        onTomarImagen(response.assets[0])
      }
    })
  }

  const cancelar = () => {
    setImagen(false)
    onTomarImagen(false)
  }

  return (
    <View style={styles.contenedorGeneral}>
      <View style={[Estilos.containerComboClaro, styles.contenedorTexto]}>
        <Text style={[Estilos.textoGeneral, { color: Globals.COLOR.GRIS_4 }]}>
          {imagen ? 'Imagen seleccionada' : 'Selecciona una imagen'}
        </Text>
        {!imagen && (
          <Pressable onPress={() => seleccionarDocumento()}>
            <Documento width={20} height={20} fill={Globals.COLOR.GRIS_3} />
          </Pressable>
        )}
        {!imagen && (
          <Pressable onPress={() => seleccionarImagen()}>
            <Imagen width={20} height={20} fill={Globals.COLOR.GRIS_3} />
          </Pressable>
        )}
        {!imagen && (
          <Pressable onPress={() => tomarFoto()}>
            <Photo width={20} height={20} fill={Globals.COLOR.GRIS_3} />
          </Pressable>
        )}
        {imagen && (
          <Pressable onPress={() => cancelar()}>
            <XmarkSolid width={20} height={20} />
          </Pressable>
        )}
      </View>
      {imagen.uri && (
        <View>
          <View>
            <View style={styles.contenedorSeparador}>
              <View style={styles.separador} />
            </View>
          </View>
          {imagen.uri && (
            <View style={styles.contenedorImagen}>
              <Image source={{ uri: imagen.uri }} style={styles.imagen} />
            </View>
          )}
          {/* <View style={{flexDirection: 'row', borderColor: Globals.COLOR.GRIS_SEPARADOR, borderTopWidth:1}}>
            <View style={{flex: 1, alignItems: 'center', padding: WIDTH*0.04}}>
              <Pressable onPress={() => console.log('Aceptar imagen')}>
                <Text style={[Estilos.tipografiaMedium, {fontSize: 16, color: '#0798EA'}]}>Aceptar</Text>
              </Pressable>
            </View>
            <View style={{flex: 1, alignItems: 'center', borderColor: Globals.COLOR.GRIS_SEPARADOR, borderLeftWidth: 1, padding: WIDTH*0.04}}>
              <Pressable onPress={() => {console.log('Cancelar imagen')}}>
                <Text style={[Estilos.tipografiaMedium, {fontSize: 16}]}>Cancelar</Text>
              </Pressable>
            </View>
          </View> */}
        </View>
      )}
    </View>
  )
}

export default BotonImagen
