import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList } from 'react-native';
import { Card } from 'react-native-elements';
import { ListItem } from 'react-native-elements';
import { HISTORY } from '../shared/history';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      leaders: state.leaders
    }
  }

function History(props) {
    console.log(props.item);
        const item = props.item;
        
        if (item != null) {
            return(
                <Card title={item.name}>
                    <Text>{item.description}</Text>
                </Card>
            );
        }
        else {
            return(<View></View>);
        }
}


class About extends Component {

    constructor(props) {
        super(props);
        this.state = {
            history: HISTORY
        };
        
    }

    static navigationOptions = {
      title:'About Us',
    };

   

    render() {

         const renderMenuItem = ({item, index}) => {
        

        return (
                <ListItem
                    key={index}
                    title={item.name}
                    subtitle={item.description}
                    hideChevron={true}
                     leftAvatar={{source: {uri: baseUrl + item.image}}}
                  />
        );
    };


     if (this.props.leaders.isLoading) {
            return(
                <ScrollView>
                    <History item={this.state.history[0]} />
                    <Card
                        title='Corporate Leadership'>
                        <Loading />
                    </Card>
                </ScrollView>
            );
        }
        else if (this.props.leaders.errMess) {
            return(
                <ScrollView>
                  <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                    <History item={this.state.history[0]} />
                    <Card
                        title='Corporate Leadership'>
                        <Text>{this.props.leaders.errMess}</Text>
                    </Card>
                  </Animatable.View>
                </ScrollView>
            );
        }
        else
        {
          return(
          <ScrollView>
          <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
           <History item={this.state.history[0]}/>

          <Card title="Corporate Leadership">
          <FlatList  data={this.props.leaders.leaders}   renderItem={renderMenuItem}    keyExtractor={item => item.id.toString()}      />
              
          </Card>
          </Animatable.View>
          </ScrollView>
        );
        }
        
    }
}

export default connect(mapStateToProps)(About);