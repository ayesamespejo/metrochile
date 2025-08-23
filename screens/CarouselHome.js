import React, { useRef, useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Dimensions, Pressable } from 'react-native';

const ITEM_SIZE = 85;
const ITEM_SPACING = 18;
const REPEAT_COUNT = 10;
const { width } = Dimensions.get('window');

import Globals from '../Globals';
import Linea1 from '../assets/svg/lineas/Linea1.svg';
import Linea2 from '../assets/svg/lineas/Linea2.svg';
import Linea3 from '../assets/svg/lineas/Linea3.svg';
import Linea4 from '../assets/svg/lineas/Linea4.svg';
import Linea4A from '../assets/svg/lineas/Linea4A.svg';
import Linea5 from '../assets/svg/lineas/Linea5.svg';
import Linea6 from '../assets/svg/lineas/Linea6.svg';
import CerrarCirculo from '../assets/svg/estados_linea/ErrorBorde.svg';
import CheckCirculo from '../assets/svg/estados_linea/BuenoBorde.svg';
import ExclamasionCirculo from '../assets/svg/estados_linea/AlertaBorde.svg';
import { useNavigation } from '@react-navigation/native';

const items = [
    { title: 'L1', line: <Linea1 width={ITEM_SIZE} height={ITEM_SIZE} /> },
    { title: 'L2', line: <Linea2 width={ITEM_SIZE} height={ITEM_SIZE} /> },
    { title: 'L3', line: <Linea3 width={ITEM_SIZE} height={ITEM_SIZE} /> },
    { title: 'L4', line: <Linea4 width={ITEM_SIZE} height={ITEM_SIZE} /> },
    { title: 'L4A', line: <Linea4A width={ITEM_SIZE} height={ITEM_SIZE} /> },
    { title: 'L5', line: <Linea5 width={ITEM_SIZE} height={ITEM_SIZE} /> },
    { title: 'L6', line: <Linea6 width={ITEM_SIZE} height={ITEM_SIZE} /> },
  ];

const CarouselHome = (props) => {
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const data = props.data || ''; // Usa los datos pasados como props o los ítems por defecto
  const itemTotalWidth = ITEM_SIZE + ITEM_SPACING;
  const stadeRedSize = 32;
  const repeatedItems = Array.from({ length: REPEAT_COUNT }, () => data).flat();

  const originalItemCount = data.length;
  const totalItems = repeatedItems.length;
  const initialIndex = Math.floor(REPEAT_COUNT / 2) * originalItemCount;
  const initialOffset = initialIndex * itemTotalWidth;

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: initialOffset, animated: false });
  }, []);

  function getLine(title) {
    const numeroLinea = title.toUpperCase();
    console.log('numeroLinea', numeroLinea);
    const itemSelected = items.find(item => item.title === numeroLinea);
    return itemSelected ? itemSelected.line : null;
  }

  const handleScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const totalContentWidth = totalItems * itemTotalWidth;
    const threshold = originalItemCount * itemTotalWidth;

    // Calcular la página actual (normalizada sobre el grupo central)
    const offsetFromStart = x - initialOffset;
    const index = Math.round(offsetFromStart / itemTotalWidth);
    const normalizedIndex = ((index % originalItemCount) + originalItemCount) % originalItemCount;
    setCurrentPage(normalizedIndex);

    // Scroll infinito
    if (x < threshold) {
      scrollRef.current?.scrollTo({ x: initialOffset, animated: false });
    }

    if (x > totalContentWidth - threshold) {
      scrollRef.current?.scrollTo({ x: initialOffset, animated: false });
    }
  };

  const iconoEstado = (estado) => {
      switch (estado) {
        case '0':
          return <CheckCirculo width={stadeRedSize} height={stadeRedSize} fill={Globals.COLOR.L5} />
        case '1':
          return <CheckCirculo width={stadeRedSize} height={stadeRedSize} fill={Globals.COLOR.L5} />
        case '2':
          return <ExclamasionCirculo width={stadeRedSize} height={stadeRedSize} fill={Globals.COLOR.L2} />
        case '3':
          return <CerrarCirculo width={stadeRedSize} height={stadeRedSize} fill={Globals.COLOR.ROJO_METRO} />
        case '4':
          return <ExclamasionCirculo width={stadeRedSize} height={stadeRedSize} fill={Globals.COLOR.L2} />
      }
    }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="normal"
      >
        {repeatedItems.map((item, index) => (
          <View key={index} style={styles.item}>
            <Pressable
                    onPress={() =>
                      navigation.push('Estado de la Red', {
                        lineaActualinicial: item.title,
                        lineaActualPosicionInicial: item.data[0].sectionIndex,
                      })
                    }
                  >
            {getLine(item.title)} 
            <View style={{ positin: 'absolute', marginStart: 77, marginTop: -85, marginLeft: -20}}>{iconoEstado(item.estado)}</View>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* PAGINACIÓN */}
     <View style={styles.pagination}>
  {data.map((_, index) => (
    <View key={index} style={styles.dotWrapper}>
      <View
        style={[
          styles.dot,
          index === currentPage ? styles.activeDot : styles.inactiveDot,
        ]}
      />
    </View>
  ))}
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingBottom: 5,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    marginHorizontal: ITEM_SPACING / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center', 
  marginTop: 20, 
  gap: 14,       
},

dotWrapper: {
  justifyContent: 'center',
  alignItems: 'center',
  width: 14, 
  height: 14,
},

dot: {
  borderRadius: 999,
},

inactiveDot: {
  backgroundColor: 'rgba(41, 40, 40, 0.43)',
  width: 6,
  height: 6,
},

activeDot: {
  backgroundColor: 'rgba(30, 30, 30, 0.86)',
  width: 10,
  height: 10,
},
});

export default CarouselHome;
