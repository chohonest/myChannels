import React from 'react';
import { Text, View, Dimensions, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { Video, LinearGradient } from 'expo';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import VideoPlayer from '@expo/videoplayer';
import { scale, moderateScale } from 'react-native-size-matters';
import ActionButton from 'react-native-action-button';
import { Ionicons } from '@expo/vector-icons';
import Loading from '../../components/LoadingComponent';
import { fetchChEvents } from './actions';
import { ChannelsURL } from '../../shared/ChannelsURL';

class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      name: ''
    };
    //this._toggleModal = this._toggleModal.bind(this); // Bind this to playVideo
  }
    componentDidMount() {
    this.props.fetchChEvents();
  }
/**
 * TODO: add pull to refresh
 */
  /* _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });*/

  render() {
    console.log(this.props.chEvents);
    //const { navigate } = this.props.navigation;
    const renderVideoPic = ({ item, index }) => {
      return (
        <TouchableOpacity
          onPress={() =>
            this.setState({
              isModalVisible: !this.state.isModalVisible,
              name: item.name,
              video: ChannelsURL + item.video
            })
          }
        >
          <View
                  style={[
                    { width: Dimensions.get('window').width / 2.2 },
                    { height: 250,
                      margin: 8
                  }]}
                >
                    <Image
                      square
                      source={{ uri: ChannelsURL + item.image }}
                      key={index}
                      style={{
                        flex: 1,
                        height: undefined,
                        width: undefined,
                        borderRadius: 10,
                        borderWidth: 0.5,
                        borderColor: '#dddddd'
                      }}
                    />
                    <LinearGradient
                      colors={['rgba(0,0,0,0.8)', 'transparent', 'transparent']}
                      style={styles.gradientTop}
                    />
                    <LinearGradient
                      colors={['transparent', 'transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.gradientBottom}
                    />
                    <Text style={{ position: 'absolute', color: 'white', marginLeft: 50, marginTop: 17, fontFamily: 'Roboto-Bold' }}>{item.name}</Text>
                    <Text style={{ position: 'absolute', color: 'white', marginLeft: 10, marginTop: 215, fontFamily: 'Roboto-Bold', fontSize: 20 }}>{item.label}</Text>
                    <View style={styles.thumbnailOuter}>
                      <Image
                        source={{ uri: ChannelsURL + item.avatar }}
                        key={index}
                        style={styles.thumpnailImage}
                      />
                    </View>
          </View>
        </TouchableOpacity>
      );
    };

    if (this.props.chEvents.isChLoading) {
      return (
        <Loading />
      );
    }
    else if (this.props.chEvents.errChMess) {
      return (
        <View>
          <Text>{this.props.chEvents.errChMess}</Text>
        </View>
      );
    }
    else {
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.props.chEvents.chEvents}
            renderItem={renderVideoPic}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            numColumns={2}
            initialNumToRender={8}
            maxToRenderPerBatch={2}
            onEndReachedThreshold={0.5}
          />
          <ActionButton buttonColor="#0336FF">
          <ActionButton.Item buttonColor='#9b59b6' title="Record" onPress={() => console.log("notes tapped!")}>
            <Ionicons name="ios-videocam" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="Search" onPress={() => this.props.navigation.navigate('ChannelSearch')}>
            <Ionicons name="ios-search" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>

          <Modal
            isVisible={this.state.isModalVisible}
            propagateSwipe
            animationOut='slideOutDown'
            //onBackdropPress={() => this.setState({ isVisible: false })}
            backdropOpacity={1}
            backdropColor='white'
            style={{
              justifyContent: 'center',
              margin: 0,
              alignItems: 'center',
              ...ifIphoneX({
                paddingTop: 30
              }, {
                paddingTop: 0
              })
            }}
            onSwipe={() => this.setState({ isModalVisible: false })}
            swipeDirection='down'

            supportedOrientations={['portrait', 'landscape']}
          >
            <VideoPlayer
              videoProps={{
                shouldPlay: true,
                resizeMode: Video.RESIZE_MODE_CONTAIN,
                isMuted: false,
                source: {
                  uri: this.state.video,
                },
              }}
                isPortrait
                playFromPositionMillis={0}
                showFullscreenButton
                //switchToLandscape={() => ScreenOrientation.allow(ScreenOrientation.Orientation.LANDSCAPE)}
              //switchToPortrait={() => ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT)}
            />
            <Text>{this.state.name}</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.props.chEvents.chEvents}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) =>
                <View>
                  <View
                      style={{
                          height: 100,
                          width: 80,
                          borderWidth: 0.5,
                          borderColor: '#dddddd',
                          marginTop: 10,
                          marginLeft: 13,
                          marginBottom: 15,
                          borderRadius: 5,
                          backgroundColor: '#F2F2F2'

                          }}
                  >
                      <View style={{ flex: 2 }}>
                          <Image
                              square
                              source={{ uri: ChannelsURL + item.image }}
                              style={{
                                  flex: 1,
                                  width: null,
                                  height: null,
                                  resizeMode: 'cover',
                                  borderRadius: 5
                                  }}
                          />
                      </View>
                  </View>
                </View>
              }
            />

          </Modal>

        </View>


      );
    }
  }
}
const mapDispatchToProps = dispatch => ({
  fetchChEvents: () => dispatch(fetchChEvents()),
});

const mapStateToProps = state => {
  return {
    chEvents: state.chEvents
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Channel);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',

    //flexWrap: 'wrap',
    //marginLeft: 3,
    //marginRight: 3,
    //paddingBottom: 10,
    justifyContent: 'center'
    //justifyContent: 'space-around'
  },
  gradientBottom: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: Dimensions.get('window').width / 2.2,
    height: 250,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  gradientTop: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: Dimensions.get('window').width / 2.2,
    height: 250,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  thumbnailOuter: {
    position: 'absolute',
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(30),
    borderWidth: moderateScale(1),
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 5
  },
  thumpnailImage: {
    position: 'absolute',
    height: moderateScale(33),
    width: moderateScale(33),
    borderRadius: moderateScale(15),
    resizeMode: 'cover',
    backgroundColor: '#D8D8D8',
  },
    actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: 'white',
    }
});


/*
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.playVideo = this.playVideo.bind(this);
  }

  playVideo() {
    this.setState({ show: true });
  }

               {this.state.show ?
            <VideoPlayer
              videoProps={{
                shouldPlay: true,
                resizeMode: Video.RESIZE_MODE_CONTAIN,
                source: {
                  uri: 'https://gcs-vimeo.akamaized.net/exp=1549330881~acl=%2A%2F671569878.mp4%2A~hmac=17bb2f7f2be7c20848448cfc810096c82cf7e7715b7fa43566c4a899912fa42b/vimeo-prod-skyfire-std-us/01/4838/7/199191069/671569878.mp4',
                },
              }}
              isPortrait
              playFromPositionMillis={0}
            />
:*/
