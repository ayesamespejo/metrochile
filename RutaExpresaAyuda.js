import React, { useState } from 'react'
import { View, Text, Pressable, Dimensions, FlatList, StyleSheet } from 'react-native'
import Estilos from './Estilos'
import Globals from './Globals'
import ChevronDown from './assets/svg/flechas/ChevronDown.svg'

import ComunRutaExpresa from './assets/svg/ruta_expresa/IconoComunRutaExpresa.svg'
import IconoRojoRutaExpresa from './assets/svg/ruta_expresa/IconoRojoRutaExpresa.svg'
import IconoVerdeRutaExpresa from './assets/svg/ruta_expresa/IconoVerdeRutaExpresa.svg'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

// Este sera el contenido de la pagina.
const data = [
  {
    id: 'question0',
    question: '¿Qué es Ruta Expresa?',
    visible: 0,
    onlyText: true,
    answer: (
      <Text style={[Estilos.textoGeneral, { width: Dimensions.get('window').width - 90 }]}>
        La Ruta Expresa consiste en la detención alternada de los trenes en las estaciones, con dos rutas de viaje
        (verde y roja).{' '}
      </Text>
    ),
  },
  {
    id: 'question1',
    question: '¿Cómo identificar la Ruta Expresa?',
    visible: 0,
    onlyText: true,
    answer: (
      <Text style={[Estilos.textoGeneral, { width: Dimensions.get('window').width - 90 }]}>
        Todos los trenes están señalizados en la cabina y en sus puertas con el color que corresponde a la ruta de viaje
        que realiza ese tren.{' '}
      </Text>
    ),
  },
  {
    id: 'question2',
    question: '¿Cómo viajar usando Ruta Expresa?',
    visible: 0,
    onlyText: false,
    answer: [
      {
        origen: 'Estación Común',
        destino: 'Estación Verde o Roja',
        descripcion: 'Puedes abordar el tren que se identifica con el color de tu estación de destino.',
        aproxHeight: 2,
        tipo: 24,
      },
      {
        origen: 'Estación Roja',
        destino: 'Estación Verde ',
        descripcion:
          'Puedes descender en una estación común intermedia y hacer trasbordo a un tren de Ruta Verde en esa estación.',
        aproxHeight: 1,
        tipo: 25,
      },
      {
        origen: 'Estación Verde',
        destino: 'Estación Roja ',
        descripcion:
          'Puedes descender en una estación común intermedia y hacer trasbordo a un tren de Ruta Roja en esa estación.',
        aproxHeight: 1,
        tipo: 26,
      },
      {
        origen: 'Estación del mismo color',
        destino: 'Estación del mismo color',
        descripcion: 'Puedes abordar el tren que se identifica con el color de tu estación de destino.',
        aproxHeight: 2,
        tipo: 27,
      },
      {
        origen: 'Estación Verde o Roja',
        destino: 'Estación Común',
        descripcion: 'Puedes abordar el tren que te trasladará a tu estación de destino.',
        aproxHeight: 2,
        tipo: 28,
      },
      {
        origen: 'Estación Común',
        destino: 'Estación Común',
        descripcion: 'Puedes abordar cualquier tren (tanto Ruta Roja como Ruta Verde).',
        aproxHeight: 2,
        tipo: 29,
      },
    ],
  },
]

// Seccion de la Respuesta a las preguntas.
const AnswerSection = ({ item }) => {
  return (
    <View>
      {item.visible == true && (
        <View>
          <View
            style={{
              height: 1,
              backgroundColor: Globals.COLOR.GRIS_3,
            }}
          />
          {item.visible == true && item.onlyText && (
            <Text style={{ marginTop: SCREEN_WIDTH * 0.03 }}>{item.answer}</Text>
          )}
          {!item.onlyText && (
            <View style={{ marginTop: SCREEN_WIDTH * 0.03 }}>
              <FlatList
                data={item.answer}
                nestedScrollEnabled
                maxHeight={SCREEN_HEIGHT / 2}
                renderItem={(answerPaso) => <AnswerRutaExpresa answer={answerPaso} />}
                keyExtractor={(item, index) => index + Math.round(Math.random() * 1000).toString()}
                // ListFooterComponent={<View style={{ height: 100 }} />}
              />
            </View>
          )}
        </View>
      )}
    </View>
  )
}

// Es el contenido de la pregunta 3.
const AnswerRutaExpresa = ({ answer }) => {
  return (
    <View
      key={`answerRutaExpresa${Math.round(Math.random() * 10000000)}_`}
      style={{ marginBottom: SCREEN_WIDTH * 0.05, flexDirection: 'row', paddingBottom: SCREEN_WIDTH * 0.03 }}
    >
      <IconosAyuda tipo={answer.item.tipo} />
      <View style={{ marginLeft: SCREEN_WIDTH * 0.03 }}>
        <View style={{ width: SCREEN_WIDTH * 0.7 }}>
          <Text style={[Estilos.textoSubtitulo]}>
            Origen
            <Text style={[Estilos.textoGeneral]}> {answer.item.origen} </Text>
          </Text>
          <Text style={[Estilos.textoSubtitulo, { paddingTop: SCREEN_WIDTH * 0.03 }]}>
            Destino
            <Text style={[Estilos.textoGeneral]}> {answer.item.destino} </Text>
          </Text>
          <Text style={[Estilos.textoGeneral, { paddingTop: SCREEN_WIDTH * 0.03 }]}>{answer.item.descripcion} </Text>
        </View>
      </View>
    </View>
  )
}

const IconosAyuda = ({ tipo }) => {
  return (
    <View>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          backgroundColor: Globals.COLOR.GRIS_3,
          width: 20,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        {tipo == 24 && <ComunRutaExpresa width={18} height={18} style={{ left: 1 }} />}
        {tipo == 24 && <IconoRojoRutaExpresa width={18} height={18} style={{ left: 1 }} />}

        {tipo == 25 && <IconoRojoRutaExpresa width={18} height={18} style={{ left: 1 }} />}
        {tipo == 25 && <ComunRutaExpresa width={18} height={18} style={{ left: 1 }} />}
        {tipo == 25 && <IconoVerdeRutaExpresa width={18} height={18} style={{ left: 1 }} />}

        {tipo == 26 && <IconoVerdeRutaExpresa width={18} height={18} style={{ left: 1 }} />}
        {tipo == 26 && <ComunRutaExpresa width={18} height={18} style={{ left: 1 }} />}
        {tipo == 26 && <IconoRojoRutaExpresa width={18} height={18} style={{ left: 1 }} />}

        {tipo == 27 && <IconoVerdeRutaExpresa width={18} height={18} style={{ left: 1 }} />}
        {tipo == 27 && <IconoVerdeRutaExpresa width={18} height={18} style={{ left: 1 }} />}

        {tipo == 28 && <IconoVerdeRutaExpresa width={18} height={18} style={{ left: 1 }} />}
        {tipo == 28 && <ComunRutaExpresa width={18} height={18} style={{ left: 1 }} />}

        {tipo == 29 && <ComunRutaExpresa width={18} height={18} style={{ left: 1 }} />}
        {tipo == 29 && <ComunRutaExpresa width={18} height={18} style={{ left: 1 }} />}
      </View>
    </View>
  )
}

const RutaExpresaAyuda = () => {
  const [questions, setQuestions] = useState(data)

  const styles = StyleSheet.create({
    tarjetaPregunta: {
      marginTop: SCREEN_WIDTH * 0.05,
      width: SCREEN_WIDTH * 0.9,
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: Globals.COLOR.GRIS_1,
      borderRadius: 20,
      padding: SCREEN_WIDTH * 0.05,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    tarjetaRespuesta: {
      // marginTop: SCREEN_WIDTH * 0.05,
      width: SCREEN_WIDTH * 0.9,
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: Globals.COLOR.GRIS_1,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      padding: SCREEN_WIDTH * 0.05,
      paddingTop: 0,
    },
  })

  return (
    <View style={{ marginTop: SCREEN_WIDTH * 0.03 }}>
      {questions.map((item, index) => (
        <View key={`k__${item.id}`}>
          <Pressable
            onPress={(e) => {
              const questionsPaso = []
              questions.forEach((itemPaso) => {
                questionsPaso.push(itemPaso)
              })
              if (!questionsPaso[index].visible) {
                questionsPaso.forEach((v, i) => (questionsPaso[i].visible = 0))
              }
              questionsPaso[index].visible = !questionsPaso[index].visible
              setQuestions(questionsPaso)
            }}
          >
            <View
              style={[
                styles.tarjetaPregunta,
                {
                  borderBottomLeftRadius: item.visible ? 0 : 20,
                  borderBottomRightRadius: item.visible ? 0 : 20,
                },
              ]}
            >
              {/**
               * Aqui colocamos la pregunta.
               */}
              <Text style={[Estilos.textoSubtitulo]}> {item.question} </Text>
              <ChevronDown
                width={20}
                height={20}
                fill={Globals.COLOR.GRIS_3}
                style={{ transform: [{ rotate: item.visible ? '-180deg' : '0deg' }] }}
              />
            </View>
          </Pressable>
          {item.visible == true && (
            <View style={styles.tarjetaRespuesta}>
              <AnswerSection item={item} />
            </View>
          )}
        </View>
      ))}
    </View>
  )
}

export default RutaExpresaAyuda
