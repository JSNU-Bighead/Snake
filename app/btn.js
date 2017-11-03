import React, {Component} from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native' 

export default class Btn extends Component{
    constructor(props){
        super(props);
        this.state={
            name:'button',
            direction: null
        }
    }
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} underlayColor="#fff" activeOpacity={0.8}>
                <View style={[styles.btn,this.props.style]}>
                    <Text>{this.props.name || this.state.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    btn:{
        backgroundColor:'#ccc',
        justifyContent:'center',
        alignItems:'center',
        height:45,
        width:80,
        borderRadius:5
    }
})