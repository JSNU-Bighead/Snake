import React ,{Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Alert
} from 'react-native'
import Dimensions from 'Dimensions'
import Extend from 'extend'
import Difference from 'lodash/difference'
import Btn from './btn.js'
let screenWidth = Dimensions.get('window').width;
let timer = null;
let average = 20;
let startTime = null;
let totalArr = [];
for(let i = 0; i <= Math.pow(average,2); i++){
    totalArr.push(i)
}
let safeArr = [];
for(let i = 1; i <= (average-2); i++){
    for(let j = 1; j <= (average-2); j++){
        safeArr.push(average*i+j)
    }
}
let defaultState = {
    interval:500,
    curDirection: 'right',
    nextDirection: 'right',
    snakeArr:[safeArr[2],safeArr[1],safeArr[0]],
    next: safeArr[3],
    food:null
};
let wallArr = Difference(totalArr,safeArr);
export default class Sanke extends Component {
    constructor(props){
        super(props);
        this.state = Extend({},defaultState)
    }
    componentDidMount(){
        this._setFood(this.state.snakeArr);
        timer = setInterval(()=>{
            this._snakeMove(Extend(true,{},this.state));
        },this.state.interval)
    }
    render(){
        let stageArr = [];
        for(let i = 0; i < Math.pow(average,2); i++){
            let s = null;
            if(safeArr.indexOf(i)!=-1){//安全区
                if(this.state.food == i){//食物
                    s = styles.food;
                } else {
                    if(this.state.snakeArr.indexOf(i)!=-1){//蛇
                        s = styles.snake;
                    } else {
                        s = styles.safe
                    }
                }
            } else {
                s = styles.wall;
            }
            stageArr.push(
                <Text style={[styles.item,s]} key={i}></Text>    
            )
        }
        return (
            <View style={[styles.container]}>
                <Text>得分：{this.state.snakeArr.length - 3}</Text>
                <View style={[styles.stage]}>
                    {stageArr}
                </View>
                <View style={[styles.btnGroup]}>
                    <Btn name={'up'} onPress={()=>{
                        this.setState({
                            nextDirection: 'up'
                        })
                        this._resetTimer();
                    }}></Btn>
                    <View style={[styles.horizontal]}>
                        <Btn name={'left'} style={[styles.btnLeft]} onPress={()=>{
                            this.setState({
                                nextDirection: 'left'
                            })
                            this._resetTimer();
                        }}></Btn>
                        <Btn name={'right'} onPress={()=>{
                            this.setState({
                                nextDirection: 'right'
                            })
                            this._resetTimer();
                        }}></Btn>
                    </View>
                    <Btn name={'down'} onPress={()=>{
                        this.setState({
                            nextDirection: 'down'
                        })
                        this._resetTimer();
                    }}></Btn>
                </View>  
            </View>  
        )
    }
    _setFood(snakeArr){
        if(this.state.food) return;
        let availableFood = Difference(safeArr,snakeArr)
        this.setState({
            food: availableFood[Math.floor(Math.random()*(Math.pow((average-2),2)+1))]
        })
    }
    _snakeMove(stateObj){
        //死亡判定
        if(wallArr.indexOf(stateObj.next)!=-1 || stateObj.snakeArr.indexOf(stateObj.next)!=-1){ 
            clearInterval(timer);
            Alert.alert(
                '',
                'Game Over!',
                [
                    {text: 'over', onPress: () => console.log('over!')},
                    {text: 'restart', onPress: () => {this._restart()}},
                ],
                { cancelable: false }
            )
        }
        stateObj.snakeArr.unshift(stateObj.next)
        //吃食判定
        if(stateObj.snakeArr.indexOf(stateObj.food)==-1){
            stateObj.snakeArr.pop();
        } else {
            this.setState({
                food:null
            })
            this._setFood(stateObj.snakeArr)
        }
        this.setState({
            next: this._countNext(stateObj.next),
            snakeArr:stateObj.snakeArr,
        })
        startTime = new Date().getTime();
    }
    _countNext(next){
        let _next = next;
        if((this.state.curDirection=='up' && this.state.nextDirection=='down')
            ||(this.state.curDirection=='down' && this.state.nextDirection=='up')
            ||(this.state.curDirection=='left' && this.state.nextDirection=='right')
            ||(this.state.curDirection=='right' && this.state.nextDirection=='left')){
            //移动方向反方向不做处理
        } else {
            this.setState({
                curDirection: this.state.nextDirection
            })
        }
        switch(this.state.curDirection){
            case 'up':
                _next -= average;
                break;
            case 'left':
                _next -= 1;
                break;
            case 'right':
                _next += 1;
                break;
            case 'down':
                _next += average;
                break;
        }
        return _next
    }
    _resetTimer(){
        clearInterval(timer);
        this.setState({
            next:this._countNext(this.state.snakeArr[0])
        })
        let remindTime = (new Date().getTime()) - startTime;
        setTimeout(()=>{
            this._snakeMove(Extend(true,{},this.state));
            timer = setInterval(()=>{
                this._snakeMove(Extend(true,{},this.state));
            },this.state.interval)
        },remindTime)
    }
    _restart(){
        this.setState(defaultState);
        this._setFood(this.state.snakeArr);
        this._snakeMove(Extend(true,{},this.state));
        timer = setInterval(()=>{
            this._snakeMove(Extend(true,{},this.state));
        },this.state.interval)
    }
}

let styles = StyleSheet.create({
    container:{
        padding:5,
    },
    stage:{
        flexDirection:'row',
        flexWrap:'wrap',
        borderWidth:1,
        borderColor:'#ccc',
        margin:-1
    },
    item:{
        width: (screenWidth-10)/average,
        height: (screenWidth-10)/average,
        fontSize: 6
    },
    snake:{
        backgroundColor:'#27ab8d'
    },
    wall:{
        backgroundColor:'#333'
    },
    safe:{
        backgroundColor:'#ccc'
    },
    food:{
        backgroundColor:'#f60'
    },
    btnGroup:{
        width:screenWidth,
        justifyContent:'center',
        alignItems:'center',
        marginTop: 30
    },
    horizontal:{
        flexDirection:'row',
        marginVertical:30,
        width:screenWidth,
        justifyContent:'space-around'
    },
    btnUp:{
        
    },
    btnLeft:{
        // marginRight:30,
    },
    btnRight:{
        
    },
    btnDown:{
        
    },
})