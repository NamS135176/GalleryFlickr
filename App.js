import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, ScrollView, Button, Alert, Image, ImageBackground, TouchableHighlight, CameraRoll, LogBox , Animated} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
function HomeScreen({ navigation }) {
  const [w, setW] = useState(null)
  const [h, setH] = useState(null)
  const [data, setData] = useState([])
  const [api, setApi] = useState('https://www.flickr.com/services/rest/?method=flickr.favorites.getList&api_key=3f412037b4ba4ca3d7652e993ed5c5c1&user_id=188060317%40N07&format=json&nojsoncallback=1')
  const getData = async () => {
    await LogBox.ignoreAllLogs(true);
    let response = await fetch(api)
    let json = await response.json();
    let data1 = await json.photos.photo
    await setData(data1)
    

  }
  useEffect(() => {
    getData()

  })
  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: "row", backgroundColor: "#353d4a" }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <FlatList
          data={data.filter(item => item.id % 2 != 0)}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item, index }) => {
            return <TouchableHighlight onPress={
              () => {
                navigation.navigate('Details', {
                  link: `http://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`,
                  title: item.title,
                  index: index,
                  data:data.filter(item => item.id % 2 != 0)
                })
              }
            }>
              <View style={{ borderRadius: 50 }} >
                <ImageBackground
                  source={{ uri: `http://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg` }}
                  imageStyle={{ borderRadius: 20 }}
                  style={{
                    resizeMode: "cover",
                    justifyContent: "flex-end",
                    width: 200,
                    height: 250,
                    padding: 10, borderRadius: 30, marginVertical: 10
                  }}>
                  <Text style={{ color: "white" }}>{item.title}</Text>
                </ImageBackground>
              </View>
            </TouchableHighlight>
          }}
        />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        <FlatList
          data={data.filter(item => item.id % 2 == 0)}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item, index }) => {
            return <TouchableHighlight onPress={
              () => {
                navigation.navigate('Details', {
                  link: `http://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`,
                  title: item.title,
                  index: index,
                  data:data.filter(item => item.id % 2 == 0)
                })
              }
            }>
              <View style={{ borderRadius: 50 }} >
                <ImageBackground

                  source={{ uri: `http://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg` }}
                  imageStyle={{ borderRadius: 20 }}
                  style={{
                    resizeMode: "cover",
                    justifyContent: "flex-end",
                    width: 200,
                    height: 150,
                    padding: 10, borderRadius: 30, marginVertical: 10
                  }}>
                  <Text style={{ color: "white" }}>{item.title}</Text>
                </ImageBackground>
              </View>
            </TouchableHighlight>
          }}
        />
      </View>
    </View>
</ScrollView> 
  );
}

function DetailsScreen({ route, navigation }) {
  let { link } = route.params
  let { title } = route.params
  const [p, setP] = useState(0);
  const [ref, setRef] = useState(null);
  const totalItemWidth = Dimensions.get('window').width;
  const { data } = route.params
  const { index } = route.params
  // const [down, setDown] = useState("")
  // const [tit,setTit] = useState("")
  useEffect(
    () => {
      Image.getSize(link, (width, height) => {
        setP(height / width);
      }        
      )
      
      if (ref != null) {
        ref.scrollToIndex({ animated: true, index: "" + index })
        // setRef(null)
      }
      
    }
  )
  return (
    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'space-between', backgroundColor: "#353d4a" }}>

      <Text style={{ color: "white", paddingTop: 30, flex: 1 }}></Text>
      <FlatList
        onMomentumScrollEnd={(item) => {
          let o = data[Math.floor(item.nativeEvent.contentOffset.x / item.nativeEvent.layoutMeasurement.width)]
          link = `http://farm${o.farm}.staticflickr.com/${o.server}/${o.id}_${o.secret}.jpg`
          title = o.title
          // setDown(`http://farm${o.farm}.staticflickr.com/${o.server}/${o.id}_${o.secret}.jpg`)
          // setTit(o.title) 
        }}
        ref={(ref) => {setRef(ref)}}
        data={data}
        style={{
          flex:1
        }}
        renderItem={
          ({ item, index }) => {
            return    <Image
            source={{ uri: `http://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg` }}
            style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').width * p, flex: 1 }}></Image>
          }
        }
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={totalItemWidth}
      decelerationRate="fast"
      bounces={false}
      getItemLayout={(data, index) => ({
        length: totalItemWidth,
        offset: totalItemWidth * index,
        index,
      })}
      
    />
     <View style={{ paddingRight: 10, paddingBottom: 20, justifyContent: "flex-end", alignItems: "flex-end", flex: 1 }}> 
        {/* <Animated.View style={{marginVertical:10,position:"absolute", right:10, bottom:10 , transform:[{translateY}]}}>
        <Text style={{ color: "black", backgroundColor: "white", borderRadius: 40, width: 80, height: 80, textAlign: "center", lineHeight: 70, fontSize: 13 }}
          onPress={() => {
            const uri = link
            let fileUri = FileSystem.documentDirectory + title + ".jpg";
            FileSystem.downloadAsync(uri, fileUri)
              .then(({ uri }) => {
                saveFile(uri);
                Alert.alert("Download Successfully", "Your Image downloaded!")
              })
              .catch(error => {
                console.error(error);
              })
          }}
        >1920x1080</Text>
      </Animated.View>
      <Text style={{ color: "black", backgroundColor: "white", borderRadius: 40, width: 80, height: 80, textAlign: "center", lineHeight: 70, fontSize: 13 , marginVertical:10,position:"absolute", right:10, bottom:10}}
          onPress={() => {
            const uri = link
            let fileUri = FileSystem.documentDirectory + title + ".jpg";
            FileSystem.downloadAsync(uri, fileUri)
              .then(({ uri }) => {
                saveFile(uri);
                Alert.alert("Download Successfully", "Your Image downloaded!")
              })
              .catch(error => {
                console.error(error);
              })
          }}
        >1024x613</Text>
        <Text style={{ color: "black", backgroundColor: "white", borderRadius: 40, width: 80, height: 80, textAlign: "center", lineHeight: 70, fontSize: 13 , marginVertical:10,position:"absolute", right:10, bottom:10}}
          onPress={() => {
            const uri = link
            let fileUri = FileSystem.documentDirectory + title + ".jpg";
            FileSystem.downloadAsync(uri, fileUri)
              .then(({ uri }) => {
                saveFile(uri);
                Alert.alert("Download Successfully", "Your Image downloaded!")
              })
              .catch(error => {
                console.error(error);
              })
          }}
        >320x213</Text> */}
          <Text style={{ color: "black", backgroundColor: "white", borderRadius: 40, width: 80, height: 80, textAlign: "center", lineHeight: 70, fontSize: 20 }}
          onPress={() => {
            const uri = link
            let fileUri = FileSystem.documentDirectory + title + ".jpg";
            FileSystem.downloadAsync(uri, fileUri)
              .then(({ uri }) => {
                saveFile(uri);
                Alert.alert("Download Successfully", "Your Image downloaded!")
              })
              .catch(error => {
                console.error(error);
              })
          }}
        >+</Text>
      </View>

    </View>
  );
}
const saveFile = async (fileUri) => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === "granted") {
    await MediaLibrary.createAssetAsync(fileUri)
  }
}
const Stack = createStackNavigator();
export default function App() {

  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerTitle: "Home", headerTintColor: "white", headerStyle: { backgroundColor: "#353d4a" } }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

