import React from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import { GestureHandlerRootView, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';


const Task = (props) => {


    
    const leftAction = (progress, dragX) => {
        
        const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        })
        return(

            <View style={styles.leftAction}>
                <Animated.Text style={[styles.actionText, {transform: [{scale}]}]}>Güle güle!</Animated.Text>
            </View>

        )
    };
    

    const rightAction = (progress, dragX) => {
    
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        })
        return(
            
            <View style={styles.rightAction}>
                <Animated.Text style={[styles.actionText, {transform: [{scale}]}]}>Güle güle!</Animated.Text>
            </View>

        )
    };
    return <GestureHandlerRootView>{
        <Swipeable
            useNativeAnimations 
            renderLeftActions={leftAction}
            renderRightActions={rightAction}
            onSwipeableOpen={props.deleteAction}
        >

            <TouchableOpacity style={styles.item} onPress={props.edit}> 
                <View style={styles.itemLeft}>
                    <Text style={styles.itemText}>{props.text}</Text>
                </View>
                <View style={styles.date}>
                    <Text style={styles.dateText}>{props.date}</Text>
                </View>
            </TouchableOpacity>

        </Swipeable>

    }</GestureHandlerRootView>
}



const styles = StyleSheet.create({

    item:{
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    itemLeft:{
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: '85%',
    },
    dateText:{
        fontSize: 16,
        fontStyle: 'italic',
    },
    itemText:{
        fontSize: 24,
    },
    leftAction:{
        backgroundColor: '#EBEAED',
        justifyContent: 'center',
        marginBottom: 20,
        borderRadius: 20,
        flex: 1,
    },
    rightAction:{
        backgroundColor: '#EBEAED',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flex: 1,
        borderRadius: 20,
        marginBottom: 20,
    },
    actionText:{
        color: '#000',
        fontWeight: '900',
        padding: 20,
    },
    

});

export default Task;