import { inheritsComments, isDoExpression, stringLiteral } from '@babel/types';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  LayoutAnimation,
  FlatList,
  UIManager,
  Modal,
  Pressable,
} from 'react-native';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const setData = async (key,value) => {  

    try {    
      await AsyncStorage.setItem(key, value)
    } 
    catch(e) {    // save error  
      console.log('Done.')
    }
}

const removeData = async (id) => {
  try {
    await AsyncStorage.removeItem(id);
  } catch(e) {
    // remove error
  }
}


const mergeData = async (id,item) => {
  try {
    await AsyncStorage.removeItem(id.toString());
    await AsyncStorage.setItem(id.toString(),JSON.stringify(item));
  } catch(e){
  }
}



//use it when it's needed to wipe data
/*
const clearAsyncStorage = async() => {
  AsyncStorage.clear();
}
clearAsyncStorage();
*/

export default function App() {

  const [task, setTask] = useState(null);
  const [utask, setuTask] = useState(null);
  const [taskItems, setTaskItems] = useState([]);
  const [idx, setidx] = useState(0);
  const [modalVisible,setModalVisible] = useState(false);
  const [item,setItem]  = useState([]);

  useEffect(async () => {
      let keys = await AsyncStorage.getAllKeys();
      let values = await AsyncStorage.multiGet(keys); 
      const tacos = []; 
      if(keys != []){
        values.map((result, i, s) => {
        let key = s[i][0];
        let value = JSON.parse(s[i][1]);
        tacos.push({id:key,text:value[0],date:value[1]})
      })
        setTaskItems(tacos);
        setidx(parseInt(tacos[tacos.length-1].id) + 1);
    }
  }, [])
  
  const addTask = () => {
    Keyboard.dismiss();
    if (task != null){
      let hours = new Date().getHours().toLocaleString();
      let minutes = new Date().getMinutes();
      if (minutes<10){
        let minutes1 = '0' + minutes.toLocaleString();
        minutes = minutes1; 
      }
      let date = hours + '.' + minutes;
      let newArray = [...taskItems, {id : idx, text: task, date:date}]
      setData(idx.toString(),JSON.stringify([task,date]));
      setidx(idx+1);
      setTaskItems(newArray);
    }
    setTask(null);
  }

  const deleteTask = (id) => {
    var itemsCopy = taskItems.filter(item => item.id !== id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setTaskItems(itemsCopy)
    removeData(id.toString())
  }

  const setModal = (item) => {
    setModalVisible(true)
    setItem(item)
  }

  const editTask = () => {
    Keyboard.dismiss()
    let hours = new Date().getHours().toLocaleString();
    let minutes = new Date().getMinutes();
    if (minutes<10){
      let minutes1 = '0' + minutes.toLocaleString();
      minutes = minutes1; 
    }
    let date = hours + '.' + minutes
    let newItem = {id:item.id,text:utask,date:date}
    let objIndex = taskItems.findIndex((obj => obj.id == item.id))
    let newArray = taskItems
    newArray[objIndex] = newItem
    setTaskItems(newArray)
    mergeData(item.id,[utask,date])
    setItem([])
    setuTask(null)
    setModalVisible(false)
  }

  return(

    <View style={styles.container}>

      <View style={styles.tasksWrapper}>
        
        <Text style={styles.sectionTitle}>Yapılacaklar</Text>

        <FlatList 
        style={styles.items}
        data={taskItems}
        keyExtractor={item => item.id}
        renderItem={({item}) => { return <Task date={item.date} text={item.text} deleteAction={() => deleteTask(item.id)} edit={() => setModal(item)}/>;}}
        />

      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <TouchableOpacity style={{alignItems:'flex-end'}}>
            <View style={styles.buttonClose}>
              <Text style={styles.addText}>x</Text>
            </View>
            </TouchableOpacity>
            <View style={{flexDirection:'row',justifyContent:'space-around'}}>
              <TextInput style={styles.modalInput} defaultValue={item.text} value={utask} onChangeText={text => setuTask(text)}/>
              <Pressable
                style={[styles.button, styles.buttonEdit]}
                onPress={() => editTask()}
              >
                <Text style={styles.textStyle}>Değiştir</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} value={task} onChangeText={text => setTask(text)}/>
        <TouchableOpacity onPress={() => addTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
        </KeyboardAvoidingView>

    </View>
    
  );
}


const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor: '#EBEAED',
  },

  tasksWrapper:{
    paddingTop: 80,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    //textDecorationLine: 'underline',
  },

  items:{
    marginTop: 30,
  },

  writeTaskWrapper:{
    position:'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

  },
  input:{
    paddingVertical: 15,
    width: 250,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,

  },
  addWrapper:{
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,

  },

  addText:{
    fontSize: 30,
    fontWeight: '100'
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },

  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width:"80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 40,
    padding: 15,
    elevation: 2,
    justifyContent:'center'
  },
  buttonEdit: {
    backgroundColor: "#F1940f",
  },
  buttonClose: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalInput:{
    //paddingVertical: 15,
    width: 150,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,

  },
  
});
