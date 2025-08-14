import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PlanificadorWeb = (props) => {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    // props.navigation.setOptions({title: 'JJ Carga bip!'});
    const _unsubscribe = props.navigation.addListener('focus', () => {
      AsyncStorage.getItem('@urlCargaBip').then((url) => {
        setUrl(url)
      })
    })
    return () => {
      _unsubscribe?.remove()
    }
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{
          uri: 'https://ifmetrosantiago.ualabee.com/',
          headers: {
            'Accept-Language': `es`,
          },
        }}
      />
    </View>
  )
}

export default PlanificadorWeb
