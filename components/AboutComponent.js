import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import { Card } from 'react-native-elements';
import { ListItem } from 'react-native-elements';
import { LEADERS } from '../shared/leaders';
import { HISTORY } from '../shared/history';

function History(props) {
    console.log(props.item);
        const item = props.item;
        
        if (item != null) {
            return(
                <Card title={item.name}>
                    <Text>
                        {item.description}</Text>
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
            leaders: LEADERS,
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
                    leftAvatar={{ source: require('./images/alberto.png')}}
                  />
        );
    };
        
        return(
          <View>
           <History item={this.state.history[0]}/>

          <Card title="Corporate Leadership">
          <FlatList  data={this.state.leaders}   renderItem={renderMenuItem}    keyExtractor={item => item.id.toString()}      />
              
          </Card>
          </View>
        );
    }
}

export default About;