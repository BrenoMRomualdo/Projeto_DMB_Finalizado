import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { useState } from 'react'
import { FlatList, TextInput, TouchableOpacity } from 'react-native-web';
import axios from 'axios';
import positivoImg from '/assets/positivo.png';
import negativoImg from '/assets/negativo.png';
import neutroImg from '/assets/neutro.png';

export default function App() {
  const [ambos, setAmbos] = useState([])
  const [frase, setFrase] = useState('')
  const [sentimentoAtual, setSentimentoAtual] = useState(null)

  const implementarAmbos = () => {
    adicionarFrase()
    conversaGpt(frase)
  }

  const capturarFrase = (fraseDigitada) => {
    setFrase(fraseDigitada)
  }

  const conversaGpt = (texto) => {
    axios
      .post('http://localhost:4000/sentimentos', { texto })
      .then((response) => {
        const sentimentoBackend = response.data.sentimento
        let sentimentoObtido = sentimentoBackend.trim()
        const verificaSentimento = /(Positivo|Negativo|Neutro)/i
        const match = sentimentoObtido.match(verificaSentimento)

        if (match) {
          const sentimentoExtraido = match[0]
          setAmbos((ambos) => [...ambos, { frase, sentimento: sentimentoExtraido }])
          setSentimentoAtual(sentimentoExtraido)
        }
      })
  }

  const adicionarFrase = () => {
    setFrase('')
  }

  const removerItem = (frase) => { 
    setAmbos((ambos) => ambos.filter((item) => item.frase !== frase));};

  return (
    <View style={styles.container}>
      {sentimentoAtual === 'Positivo' && <Image source={positivoImg} style={styles.imagemSentimento} />}
      {sentimentoAtual === 'Negativo' && <Image source={negativoImg} style={styles.imagemSentimento} />}
      {sentimentoAtual === 'Neutro' && <Image source={neutroImg} style={styles.imagemSentimento} />}

      <View style={styles.entradaView}>
        <TextInput
          placeholder='Insira uma frase...'
          style={styles.sentimentoTextInput}
          onChangeText={capturarFrase}
          value={frase}
        />
        <Button
          title='OK'
          onPress={implementarAmbos}
        />
      </View>

      <FlatList
        data={ambos}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => removerItem(item.frase)}>
          <View style={styles.itemNaLista}>
            <Text>Frase: {item.frase}</Text>
            <Text>Sentimento: {item.sentimento}</Text>
          </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 40,
    width: '100%',
    alignItems: 'center'
  },
  sentimentoTextInput: {
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    marginBottom: 4,
    padding: 12,
    textAlign: 'center'
  },
  entradaView: {
    width: '80%',
    marginBottom: 4
  },
  itemNaLista: {
    padding: 12,
    backgroundColor: '#CCC',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 8,
    borderRadius: 8,
    textAlign: 'center'
  },
  imagemSentimento: {
    width: 200,
    height: 200,
    marginBottom: 16
  }
});