import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet,ImageBackground, Image} from "react-native";
import GeminiService from "../components/gemini";
import { Header, Icon } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { signOut } from "firebase/auth";
import { auth } from "../config";
import { useNavigation } from '@react-navigation/native';
import VoiceComp from "./voice";

const image = 'https://static.vecteezy.com/system/resources/thumbnails/006/429/746/small/abstract-background-gradient-abstract-modern-background-for-mobile-apps-free-vector.jpg'
const logo = 'https://cdn.vectorstock.com/i/500p/34/66/fact-check-inverted-circle-black-vector-57143466.jpg'
const mike = 'https://png.pngtree.com/png-vector/20190329/ourmid/pngtree-vector-microphone-icon-png-image_889551.jpg'
const go="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA3JlLf5pl1CNa53t5QwKEVCDCgLFqk3bufA&s"
const HomeScreen = () => {
  const navigation = useNavigation();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleGenerate = async () => {
    const result = await GeminiService.fetchResponse(prompt);
    console.log(result)
    if (result.success) {
      // res.success = true
      setResponse(result.result || "No response");
    } else {
      setResponse(result.errorMessage);
    }
  };

  return (
    <View style={{ padding: 0, flex:1 }}>
     <ImageBackground source={image} resizeMode="cover" style={styles.image}>
     <SafeAreaProvider>
    <Header
      leftComponent={{
        icon: 'menu',
        color: '#fff',
      }}
      centerComponent={{ text: 'Fact Checker', style: styles.heading }}
      containerStyle={{
    backgroundColor: 'lightblue',
    justifyContent: 'space-around',
  }}
  rightComponent={
    <Icon
    name = 'logout'
    type = 'material'
    color = 'white'
    onPress = {async()=>{
      try{
        await signOut(auth)
        alert('user signout')
        navigation.replace('Profile')
      }
      catch(error){
        alert('logout error'+error)
        console.error('logout failed', error)
      }
    }}
  />}
    />
    <Image source = {logo} style = {{width: 100, height: 100, borderRadius: 50, alignSelf: 'center', margin:20, borderWidth: 2, borderColor:'white'}}/>

      <TextInput
        placeholder="Enter prompt"
        value={prompt}
        onChangeText={setPrompt}
        style={{
          height: 40,
          borderColor: "white",
          borderWidth: 1,
          borderRadius: 20,
          margin: 10,
          paddingHorizontal: 10,
          textAlign: 'center',
          color:"white"
        }}
      />

      <VoiceComp/>

      <TouchableOpacity>

      <Image source = {mike} style = {{width: 100, height: 100, borderRadius: 50, alignSelf: 'center', margin:20, borderWidth: 2, borderColor:'white'}}/>
      </TouchableOpacity>

<TouchableOpacity onPress={()=>handleGenerate()}
style={styles.fact}
>
      <Text style={{ marginTop: 2,fontWeight:"bold",textAlign:"center" ,fontSize:40,color:"white"}}>
       GO
      </Text> 
    
      </TouchableOpacity >
      <Text style={styles.result}>
        {response || "Response will appear here"}
      </Text> 
      </SafeAreaProvider>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
headerContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#397af8',
  marginBottom: 20,
  width: '100%',
  paddingVertical: 0,
},
image: {
    flex: 1,
    justifyContent: 'center',
  },
heading: {
  color: 'white',
  fontSize: 22,
  fontWeight: 'bold',
},
headerRight: {
  display: 'flex',
  flexDirection: 'row',
  marginTop: 5,
},
subheaderText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},

fact:{
width:100,
height:100,
borderRadius:50,
borderWidth:2,
color:"black",
justifyContent:"center",
alignSelf:"center",
backgroundColor:"black",
borderColor:"white"
},
go:{
  width:100,
  height:100,
  borderRadius:50,
borderWidth:10,
color:"black",
justifyContent:"center",
alignSelf:"center",
},
result:{
  width:"80%",
  height:200,
  backgroundColor:"transparent",
  borderWidth:2,
  alignSelf:"center",
  borderRadius:20,
  borderColor:"white",
  textAlign:"center",
  margin:20,
  padding:10
}
});

export default HomeScreen;
