import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Button, Modal, StyleSheet, Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }
const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderDish(props) {
   // console.log(props);
    const dish = props.dish;

    //handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -200 )
            return true;
        else
            return false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        //onPanResponderGrant: () => {this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );

            return true;
        }
    })
    
        if (dish != null) {
            return(
                <View>
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000} 
                //ref={this.handleViewRef} 
                {...panResponder.panHandlers}>
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>

                    <Icon
                    raised
                    reverse
                    name={ props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                    <Icon
                    raised
                    reverse
                    name= 'pencil' 
                    type='font-awesome'
                    color='#512DA8'
                    onPress={() => props.PencilonPress()}                    />
                </Card>
                </Animatable.View>
                </View>
            );
        }
        else {
            return(<View> </View>);
        }
}


function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.comment} </Text>
            </View>
        );
    };
    
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>        
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
        </Animatable.View>
    );
}



class Dishdetail extends Component {
     
    constructor(props) {
        super(props);

        this.state = {
            rating: 1,
            author: false,
            comment: '',
            showModal: false
        }
        
    }
    
    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

     markComment(dishId, rating, author, comment) {
        this.props.postComment(dishId, rating, author, comment);
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
        console.log("toggleModal");
       
        
    }

    handleComment(dishId, rating, author, comment) {
        console.log(JSON.stringify(this.state));
        this.markComment(dishId, rating, author, comment);
        this.toggleModal();
    
    }
    

    resetForm() {
        this.setState({
            rating: 0,
            author: '',
            comment: ''
        });
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
             <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} PencilonPress={() => this.toggleModal()} 
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType = {"none"} transparent = {true} 
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>
                    <View style = {styles.modal}>
                        <View style={styles.formRow}>
                        <Rating
                              showRating
                              onFinishRating={value => this.setState({ rating: value })}
                              style={{ paddingVertical: 10 }}
                            />
                        </View>
                        <View style={styles.formRow}>
                        <Input
                           placeholder="Author"
                           leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                           style={styles}
                           onChangeText={value => this.setState({ author: value })}
                        />
                        </View>
                        <View style={styles.formRow}>
                        <Input
                           placeholder="Comment"
                           leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                           style={styles}
                           onChangeText={value => this.setState({ comment: value })}
                        />
                        </View>
                        <View style={styles.formRow}>
                        <Button 
                            onPress = {() =>{this.handleComment(dishId, this.state.rating, this.state.author, this.state.comment); this.resetForm();}}
                            color="#512DA8"
                            title="Submit" 
                            />
                        </View>
                        <View style={styles.formRow}>

                        <Button 
                            onPress = {() =>{this.toggleModal(); this.resetForm();}}
                            color="#696969"
                            title="Cancel" 
                            />
                            </View>
                    </View>
                </Modal>


            </ScrollView>
            );
    }
}

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
       justifyContent: 'center',
       margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }

});
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);