import React, { useState, useEffect, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, InputGroup, FormControl, Button, Image, Card, Modal, CardGroup} from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import './App.css';
import search_logo from './img/search.png'
import pos_reaction1 from './img/reaction_positive1.png'
import pos_reaction2 from './img/reaction_positive2.png'
import pos_reaction3 from './img/reaction_positive3.png'
import neg_reaction1 from './img/reaction_negative1.png'
import neg_reaction2 from './img/reaction_negative2.png'
import neg_reaction3 from './img/reaction_negative3.png'
import channel_profile from './img/channel_profile.png';
import Webcam from 'react-webcam';
import { Camera, PersonCircle, Send, CaretDownFill, GeoAlt, CameraVideo, Link45deg} from 'react-bootstrap-icons';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {getUsers, getListChannels, getListSqueals, getActualUser, updateUsers, updateUser, updateChannel, updateSqueals, updateSqueal} from './serverRequests.js';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

function Home(){
  const location = useLocation();
  const [showIcon, setShowIcon] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestedProfiles, setSuggestedProfiles] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [actualuser, setactualuser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [allSquealsReceived, setAllSquealsReceived] = useState(null);
  const [allSqueals, setallSqueals] = useState([]);
  const [allSquealsprint,setallSquealsprint] = useState([]);
  const [showbtnopacity, setshowbtnopacity] = useState(false);
  const [inputSearch, setinputSearch] = useState("");
  const [allchannels, setallchannels] = useState([]);
  const [allCHANNELS, setallCHANNELS] = useState([]);
  const [allkeywords, setallkeywords] = useState([]);
  const [clientinputSearch, setclientinputSearch] = useState("");
  const markerIcon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconAnchor: [12, 41]
  });
  const observer = useRef(null);
  const [allAnswersprint, setAllAnswersprint] = useState([]);
  const [viewAnswers, setViewAnswers] = useState(false);
  const [photoAnswer, setPhotoAnswer] = useState("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
  const [videoAnswer, setVideoAnswer] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [positionAnswer, setPositionAnswer] = useState([]);
  const [linkAnswer, setLinkAnswer] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [inputLink, setinputLink] = useState("");
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showCameraVideoModal, setShowCameraVideoModal] = useState(false);
  const webcamRef = useRef(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [positionMap, setPositionMap] = useState(null);
  const [displayedLink, setDisplayedLink] = useState(''); 
  const [idAnswer, setIdAnswer] = useState(-1);
  const windowSize = useWindowSize();
  const UrlSite = 'https://site222325.tw.cs.unibo.it';
  const [allSquealsCollection, setAllSquealsCollection] = useState();

  function rimuoviDuplicati(array) {
    const oggettiUnici = {};
    const risultato = [];

    for (const oggetto of array) {
        const chiave = oggetto.sender + '|' + oggetto.date + '|' + oggetto.hour + '|' + oggetto.seconds;
        if (!oggettiUnici[chiave]) {
            oggettiUnici[chiave] = true;
            risultato.push(oggetto);
        }
    }

    return risultato;
  }

  useEffect( () => {
    if(location.pathname.endsWith('/home')){
        async function getAll1(){
            try{
                const users = await getUsers();
                setAllUsers(users);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
                throw error;
            }
          }
          async function getAll2(){
            try{
                let actualUserId = JSON.parse(localStorage.getItem("actualUserId"));
                if(actualUserId=="1"){
                  setactualuser("none");
                } else {
                  const user = await getActualUser();
                  setactualuser(user);
                }
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
                throw error;
            }
          }
          async function getAll3(){
            try{
                const Channels = await getListChannels();
                Channels.forEach(channel => {
                  switch(channel.type) {
                    case '&':
                      setallchannels(allchannelsprev => [...allchannelsprev, channel]);
                    break;
                    case '$':
                      setallCHANNELS(allCHANNELSprev => [...allCHANNELSprev, channel]);
                    break;
                    case '#':
                      setallkeywords(allkeywordsprev => [...allkeywordsprev, channel]);
                    break;
                  }
                });
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
                throw error;
            }
          }
          async function getAll4(){
            try{
                const squeals = await getListSqueals();
                setAllSquealsReceived(squeals);
		setAllSquealsCollection(squeals);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
                throw error;
            }
          }
        getAll1();
        getAll2();
        getAll3();
        getAll4();
    }
},[location.pathname]);

useEffect(()=>{
  if(actualuser && allSquealsReceived){
    let squealsReceived = [];
    if(JSON.parse(localStorage.getItem("actualUserId"))!="1"){
      for(let i=0; i<allSquealsReceived.length;i++){
          for(let j=0; j<allSquealsReceived[i].receivers.length; j++){
              if((allSquealsReceived[i].receivers[j]=="@"+actualuser.nickname)||(allSquealsReceived[i].receivers[j]==actualuser.nickname)){
                switch(allSquealsReceived[i].typesender){
                  case "CHANNELS":
                    if(actualuser.notifications[1]){
                      let findIn = false;
                      for(let k=0; k<allCHANNELS.length; k++){
                        if(allCHANNELS[k].name==allSquealsReceived[i].channel){
                          for(let m=0;m<allCHANNELS[k].usersSilenced.length;m++){
                            if(allCHANNELS[k].usersSilenced[m] == actualuser.nickname){
                              findIn = true;
                            }
                          }
                        }
                      }
                      if(!findIn){
                        squealsReceived.push(allSquealsReceived[i]);
                      }
                    }
                  break;
                  case "channels":
                    if(actualuser.notifications[0]){
                      let findIn = false;
                      for(let k=0; k<allchannels.length; k++){
                        if(allchannels[k].name==allSquealsReceived[i].channel && !allchannels[k].blocked){
                          for(let m=0;m<allchannels[k].usersSilenced.length;m++){
                            if(allchannels[k].usersSilenced[m] == actualuser.nickname){
                              findIn = true;
                            }
                          }
                        }
                      }
                      if(!findIn){
                        squealsReceived.push(allSquealsReceived[i]);
                      }
                    }
                  break;
                  case "Users":
                    if(actualuser.notifications[2]){
                      for(let k=0; k<allUsers.length; k++){
                        if(allSquealsReceived[i].sender==allUsers[k].nickname && !allUsers[k].blocked){
                          squealsReceived.push(allSquealsReceived[i]);
                        }
                      }
                    }
                  break;
                  default:
                    if(actualuser.notifications[3]){
                      let findIn = false;
                      for(let k=0; k<allkeywords.length; k++){
                        if(allkeywords[k].name==allSquealsReceived[i].channel){
                          for(let m=0;m<allkeywords[k].usersSilenced.length;m++){
                            if(allkeywords[k].usersSilenced[m] == actualuser.nickname){
                              findIn = true;
                            }
                          }
                        }
                      }
                      if(!findIn){
                        squealsReceived.push(allSquealsReceived[i]);
                      }
                    }
                  break;
                }
              }
          }
      }
    } else {
      for(let i=0;i<allCHANNELS.length;i++){
        for(let j=0;j<allCHANNELS[i].list_posts.length;j++){
          squealsReceived.push(allCHANNELS[i].list_posts[j]);
        }
      }
    }
  setallSquealsprint(squealsReceived);
  setallSqueals(squealsReceived);
  }
}, [actualuser, allSquealsReceived, allCHANNELS]);

  const callback = (entries) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        const viewedMessage = allSqueals.find(
          (msg) => msg._id === entry.target.getAttribute('data-id')
        );
        if (viewedMessage && !viewedMessage.usersViewed.includes(actualuser.nickname)) {
          let updatedMessages = [];
            for (let i = 0; i < allSqueals.length; i++) {
              if (allSqueals[i]._id === viewedMessage._id) {
                let updatedMessage = {
                  ...allSqueals[i],
                  impressions: allSqueals[i].impressions + 1,
                  usersViewed: [...allSqueals[i].usersViewed, actualuser.nickname]
                };
                updatedMessages.push(updatedMessage);
              } else {
                updatedMessages.push(allSqueals[i]);
              }
            }
            setallSqueals(updatedMessages);
          updatedMessages = [];
            for (let i = 0; i < allSquealsCollection.length; i++) {
              if (allSquealsReceived[i]._id === viewedMessage._id) {
                let updatedMessage = {
                  ...allSquealsReceived[i],
                  impressions: allSquealsReceived[i].impressions + 1,
                  usersViewed: [...allSquealsReceived[i].usersViewed, actualuser.nickname]
                };
                updatedMessages.push(updatedMessage);
              } else {
                updatedMessages.push(allSquealsReceived[i]);
              }
            }
	    updatedMessages = await rimuoviDuplicati(updatedMessages);
            setAllSquealsReceived(updatedMessages);
            setAllSquealsCollection(updatedMessages);
	    let indexSqueal = updatedMessages.findIndex(item => item._id === viewedMessage._id);
            await updateAllSqueals(updatedMessages, indexSqueal);
        let updatedChannels = [...allchannels];
        let updatedCHANNELS = [...allCHANNELS];
        let updatedkeywords = [...allkeywords];
        switch(viewedMessage.typesender){
          case 'channels':
            updatedChannels = [];
            for (let i = 0; i < allchannels.length; i++) {
              let channel = allchannels[i];
              if (channel.name === viewedMessage.channel) {
                let updatedPosts = [];
                for (let j = 0; j < channel.list_posts.length; j++) {
                  let post = channel.list_posts[j];
                  if (post.sender === viewedMessage.sender && post.date === viewedMessage.date && post.hour === viewedMessage.hour && post.seconds === viewedMessage.seconds) {
                    let updatedPost = {
                      ...post,
                      impressions: post.impressions + 1,
                      usersViewed: [...post.usersViewed, actualuser.nickname]
                    };
                    updatedPosts.push(updatedPost);
                  } else {
                    updatedPosts.push(post);
                  }
                }
                updatedChannels.push({
                  ...channel,
                  list_posts: updatedPosts
                });
              } else {
                updatedChannels.push(channel);
              }
            }
            setallchannels(updatedChannels);
          break;
          case 'CHANNELS':
            updatedCHANNELS = [];
            for (let i = 0; i < allCHANNELS.length; i++) {
              let channel = allCHANNELS[i];
              if (channel.name === viewedMessage.channel) {
                let updatedPosts = [];
                for (let j = 0; j < channel.list_posts.length; j++) {
                  let post = channel.list_posts[j];
                  if (post.sender === viewedMessage.sender && post.date === viewedMessage.date && post.hour === viewedMessage.hour && post.seconds === viewedMessage.seconds) {
                    let updatedPost = {
                      ...post,
                      impressions: post.impressions + 1,
                      usersViewed: [...post.usersViewed, actualuser.nickname]
                    };
                    updatedPosts.push(updatedPost);
                  } else {
                    updatedPosts.push(post);
                  }
                }
                updatedCHANNELS.push({
                  ...channel,
                  list_posts: updatedPosts
                });
              } else {
                updatedCHANNELS.push(channel);
              }
            }
            setallCHANNELS(updatedCHANNELS);
          break;
          case 'keywords':
            updatedkeywords = [];
            for (let i = 0; i < allkeywords.length; i++) {
              let channel = allkeywords[i];
              if (channel.name === viewedMessage.channel) {
                let updatedPosts = [];
                for (let j = 0; j < channel.list_posts.length; j++) {
                  let post = channel.list_posts[j];
                  if (post.sender === viewedMessage.sender && post.date === viewedMessage.date && post.hour === viewedMessage.hour && post.seconds === viewedMessage.seconds) {
                    let updatedPost = {
                      ...post,
                      impressions: post.impressions + 1,
                      usersViewed: [...post.usersViewed, actualuser.nickname]
                    };
                    updatedPosts.push(updatedPost);
                  } else {
                    updatedPosts.push(post);
                  }
                }
                updatedkeywords.push({
                  ...channel,
                  list_posts: updatedPosts
                });
              } else {
                updatedkeywords.push(channel);
              }
            }
            setallkeywords(updatedkeywords);
          break;
          default:

          break;
        }
        let allupdatedChannels = [...updatedChannels,...updatedCHANNELS,...updatedkeywords];
        let index = allupdatedChannels.findIndex(item => item.name === viewedMessage.channel);
	await updateAllChannels(allupdatedChannels, index);
        }
      }
    });
  };

  useEffect(() => {
    if(allSquealsReceived!=[]){
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(callback, { threshold: 1 });
      document.querySelectorAll('.message').forEach((element) => {
        observer.current.observe(element);
      });

      return () => {
        if (observer.current) observer.current.disconnect();
      };
    }
  }, [allSquealsprint]);

  async function updateAllUsers(UsersToUpdate){
    try{
      let userUpdate = {}
            for(let i=0; i< UsersToUpdate.length; i++){
                if(UsersToUpdate[i].nickname === actualuser.nickname){
                    userUpdate = {char_d:UsersToUpdate[i].char_d, char_w:UsersToUpdate[i].char_w, char_m:UsersToUpdate[i].char_m, popularity:UsersToUpdate[i].popularity};
                }
            }
            await updateUser(actualuser._id, userUpdate);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

async function updateAllSqueals(squealsToUpdate, idsqueal){
  try{
   const squealUpdate = {impressions:squealsToUpdate[idsqueal].impressions, pos_reactions:squealsToUpdate[idsqueal].pos_reactions, neg_reactions:squealsToUpdate[idsqueal].neg_reactions, category:squealsToUpdate[idsqueal].category, usersReactions:squealsToUpdate[idsqueal].usersReactions, usersViewed:squealsToUpdate[idsqueal].usersViewed, answers:squealsToUpdate[idsqueal].answers};
   await updateSqueal(squealsToUpdate[idsqueal]._id, squealUpdate);
  } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      throw error;
  }
}

async function updateAllChannels(ChannelsToUpdate, indexChannel){
  try{
   if(indexChannel!=-1){
    const ChannelsUpdated = {list_posts:ChannelsToUpdate[indexChannel].list_posts, popularity:ChannelsToUpdate[indexChannel].popularity};
    await updateChannel(ChannelsToUpdate[indexChannel]._id, ChannelsUpdated);
   }
  } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      throw error;
  }
}

const handleFocus = () => {
    setShowIcon(false);
    setIsSuggestionsVisible(true);
    setshowbtnopacity(true);
    setinputSearch("");
    setSuggestedProfiles([]);
  };

  const handleBlur = () => {
      setclientinputSearch("");
      setShowIcon(true);
      setIsSuggestionsVisible(false);
      setshowbtnopacity(false);
  };

  const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = (item) => {
      const selectedIndex = selectedItems.indexOf(item);
      let updatedItems = [...selectedItems];
      setinputSearch();
      setIsDropdownOpen(true);

      if (selectedIndex === -1) {
          updatedItems.push(item);
      } else {
          updatedItems = updatedItems.filter((selectedItem) => selectedItem !== item);
      }
      const filterSquealprint = ([]);
      setSelectedItems(updatedItems);
      if(updatedItems.length!=0){
        for(let i=0;i<updatedItems.length;i++){
          for(let j=0;j<allSqueals.length;j++)
          if(updatedItems[i]==allSqueals[j].typesender){
            filterSquealprint.push(allSqueals[j]);
          }
        }
        setallSquealsprint(filterSquealprint);
      } else {
        setallSquealsprint([...allSqueals]);
      }
  };

  const handleItemSelect = (item) => {         //funzione per l'inserimento di un nome per filtrare i messaggi nella home
    setclientinputSearch("");
    setinputSearch(item);
    let filterSquealprint;
    if(selectedItems.length==0){
      filterSquealprint = allSqueals.filter(squeal => squeal.sender==item);
    } else {
      for(let i=0;i<selectedItems.length;i++){
        filterSquealprint = allSqueals.filter(squeal => (squeal.sender==item)&(squeal.typesender==selectedItems));
      }
    }
    setallSquealsprint(filterSquealprint);
    setIsSuggestionsVisible(false);
    setShowIcon(true);
    setshowbtnopacity(false);
  };

  const writeinputSearch = (event) => {                                  //selezione della ricerca 
    setSuggestedProfiles([]);
    const value = event.target.value;
    setclientinputSearch(value);
    if(value!=""){
      for(let i=0;i<allUsers.length;i++){
        let user = ((allUsers[i].nickname).slice(0,value.length)).toLowerCase();
            if(value.toLowerCase()==user){
                setSuggestedProfiles(prevallUsers => [...prevallUsers,allUsers[i].nickname]);
            }
      }
    } else {
      setSuggestedProfiles([]);
    }
  };

  const reactionSqueal = async (index,x) => {
    let newallSqueals = [...allSquealsCollection];
    const idToFind = allSqueals[index]._id;
    let indexSqueal = newallSqueals.findIndex(item => item._id === idToFind);
    let newallUsers = [...allUsers];
    let channelsModified = [...allchannels];
    let CHANNELSModified = [...allCHANNELS];
    let keywordsModified = [...allkeywords];
    if(x<4){
        newallSqueals[indexSqueal].pos_reactions += x;
        let find = false;
        for(let j=0; j<allSquealsCollection[indexSqueal].usersReactions.length;j++){
          if(allSquealsCollection[indexSqueal].usersReactions[j].nickname===actualuser.nickname){
            find = true;
            newallSqueals[indexSqueal].pos_reactions -= allSquealsCollection[indexSqueal].usersReactions[j].posReactions;
            if(newallSqueals[indexSqueal].pos_reactions<0)
              newallSqueals[indexSqueal].pos_reactions = 0;
            newallSqueals[indexSqueal].neg_reactions -= allSquealsCollection[indexSqueal].usersReactions[j].negReactions;
            if(newallSqueals[indexSqueal].neg_reactions<0)
              newallSqueals[indexSqueal].neg_reactions = 0;
            newallSqueals[indexSqueal].usersReactions[j] = {nickname: actualuser.nickname, posReactions:x, negReactions:0};
          }
        }
        if(!find){
          newallSqueals[indexSqueal].usersReactions.push({nickname: actualuser.nickname, posReactions:x, negReactions:0});
        }
        if(newallSqueals[indexSqueal].pos_reactions>0.25*newallSqueals[indexSqueal].impressions){
          if(newallSqueals[indexSqueal].neg_reactions>0.25*newallSqueals[indexSqueal].impressions){
            newallSqueals[indexSqueal].category = "controversial";
            for(let i=0;i<allCHANNELS.length;i++){
              if(allCHANNELS[i].name == "CONTROVERSIAL"){
                  allCHANNELS[i].list_posts.push(newallSqueals[indexSqueal]);
              }
            }
          } else {
            newallSqueals[indexSqueal].category = "popular";
          }
        } else if(newallSqueals[indexSqueal].neg_reactions>0.25*newallSqueals[indexSqueal].impressions) {
          newallSqueals[indexSqueal].category = "unpopular";
        }
        let count=0;
        for(let i=0;i<newallSqueals.length;i++){
          if(newallSqueals[i].category=="popular" & newallSqueals[indexSqueal].sender==newallSqueals[i].sender){
            count++;
          }
        }
        if(count%5==0 & count>0){
          for(let i=0;i<allUsers.length;i++){
            if(allUsers[i].nickname==newallSqueals[indexSqueal].sender){
              newallUsers[i].char_d = newallUsers[i].char_d + (newallUsers[i].char_d*0.01);
              newallUsers[i].char_w = newallUsers[i].char_w + (newallUsers[i].char_w*0.01);
              newallUsers[i].char_m = newallUsers[i].char_m + (newallUsers[i].char_m*0.01);
              newallUsers[i].popularity = newallUsers[i].popularity + 1;
            }
          }
        }
        if(newallSqueals[indexSqueal].channel!=""){
          switch(newallSqueals[indexSqueal].typesender){
            case "channels":
              for(let i=0; i<allchannels.length; i++){
                if(allchannels[i].name===newallSqueals[indexSqueal].channel){
                  let counter = 0;
                  for(let j=0; j<allchannels[i].list_posts.length; j++){
                    if((newallSqueals[indexSqueal].sender===allchannels[i].list_posts[j].sender)&(newallSqueals[indexSqueal].date===allchannels[i].list_posts[j].date)&(newallSqueals[indexSqueal].hour===allchannels[i].list_posts[j].hour)&(newallSqueals[indexSqueal].seconds===allchannels[i].list_posts[j].seconds)){
                      channelsModified[i].list_posts[j].pos_reactions = newallSqueals[indexSqueal].pos_reactions;
                      channelsModified[i].list_posts[j].neg_reactions = newallSqueals[indexSqueal].neg_reactions;
                      channelsModified[i].list_posts[j].usersReactions = newallSqueals[indexSqueal].usersReactions;
                    }
                    if(channelsModified[i].list_posts[j].category=="popular"){
                      counter += 1;
                    }
                  }
                  if(counter%5==0 & counter>0){
                    channelsModified[i].popularity = channelsModified[i].popularity + 1;
                  }
                }
              }
            break;
            case "CHANNELS":
              for(let i=0; i<allCHANNELS.length; i++){
                if(allCHANNELS[i].name===newallSqueals[indexSqueal].channel){
                  let counter = 0;
                  for(let j=0; j<allCHANNELS[i].list_posts.length; j++){
                    if((newallSqueals[indexSqueal].sender===allCHANNELS[i].list_posts[j].sender)&(newallSqueals[indexSqueal].date===allCHANNELS[i].list_posts[j].date)&(newallSqueals[indexSqueal].hour===allCHANNELS[i].list_posts[j].hour)&(newallSqueals[indexSqueal].seconds===allCHANNELS[i].list_posts[j].seconds)){
                      CHANNELSModified[i].list_posts[j].pos_reactions = newallSqueals[indexSqueal].pos_reactions;
                      CHANNELSModified[i].list_posts[j].neg_reactions = newallSqueals[indexSqueal].neg_reactions;
                      CHANNELSModified[i].list_posts[j].usersReactions = newallSqueals[indexSqueal].usersReactions;
                    }
                    if(CHANNELSModified[i].list_posts[j].category=="popular"){
                      counter += 1;
                    }
                  }
                  if(counter%5==0 & counter>0){
                    CHANNELSModified[i].popularity = CHANNELSModified[i].popularity + 1;
                  }
                }
              }
            break;
            case "keywords":
              for(let i=0; i<allkeywords.length; i++){
                if(allkeywords[i].name===newallSqueals[indexSqueal].channel){
                  let counter = 0;
                  for(let j=0; j<allkeywords[i].list_posts.length; j++){
                    if((newallSqueals[indexSqueal].sender===allkeywords[i].list_posts[j].sender)&(newallSqueals[indexSqueal].date===allkeywords[i].list_posts[j].date)&(newallSqueals[indexSqueal].hour===allkeywords[i].list_posts[j].hour)&(newallSqueals[indexSqueal].seconds===allkeywords[i].list_posts[j].seconds)){
                      keywordsModified[i].list_posts[j].pos_reactions = newallSqueals[indexSqueal].pos_reactions;
                      keywordsModified[i].list_posts[j].neg_reactions = newallSqueals[indexSqueal].neg_reactions;
                      keywordsModified[i].list_posts[j].usersReactions = newallSqueals[indexSqueal].usersReactions;
                    }
                    if(keywordsModified[i].list_posts[j].category=="popular"){
                      counter += 1;
                    }
                  }
                  if(counter%5==0 & counter>0){
                    keywordsModified[i].popularity = keywordsModified[i].popularity + 1;
                  }
                }
              }
            break;
          }
        }
    } else {
      x-= 3;
        newallSqueals[indexSqueal].neg_reactions += x;
        let find = false;
        for(let j=0; j<allSquealsCollection[indexSqueal].usersReactions.length;j++){
          if(allSquealsCollection[indexSqueal].usersReactions[j].nickname===actualuser.nickname){
            find = true;
            newallSqueals[indexSqueal].pos_reactions -= allSquealsCollection[indexSqueal].usersReactions[j].posReactions;
            if(newallSqueals[indexSqueal].pos_reactions<0)
              newallSqueals[indexSqueal].pos_reactions = 0;
            newallSqueals[indexSqueal].neg_reactions -= allSquealsCollection[indexSqueal].usersReactions[j].negReactions;
            if(newallSqueals[indexSqueal].neg_reactions<0)
              newallSqueals[indexSqueal].neg_reactions = 0;
            newallSqueals[indexSqueal].usersReactions[j] = {nickname: actualuser.nickname, posReactions:0, negReactions:x};
          }
        }
        if(!find){
          newallSqueals[indexSqueal].usersReactions.push({nickname: actualuser.nickname, posReactions:0, negReactions:x});
        }
        if(newallSqueals[indexSqueal].pos_reactions>0.25*newallSqueals[indexSqueal].impressions){
          if(newallSqueals[indexSqueal].neg_reactions>0.25*newallSqueals[indexSqueal].impressions){
            newallSqueals[indexSqueal].category = "controversial";
            for(let i=0;i<allCHANNELS.length;i++){
              if(allCHANNELS[i].name == "CONTROVERSIAL"){
                  allCHANNELS[i].list_posts.push(newallSqueals[indexSqueal]);
              }
            }
          } else {
            newallSqueals[indexSqueal].category = "popular";
          }
        } else if(newallSqueals[indexSqueal].neg_reactions>0.25*newallSqueals[indexSqueal].impressions) {
          newallSqueals[indexSqueal].category = "unpopular";
        }
        let count=0;
        for(let i=0;i<newallSqueals.length;i++){
          if(newallSqueals[i].category=="unpopular" & newallSqueals[indexSqueal].sender==newallSqueals[i].sender){
            count++;
          }
        }
        if(count%5==0 & count>0){
          for(let i=0;i<allUsers.length;i++){
            if(allUsers[i].nickname==newallSqueals[indexSqueal].sender){
              newallUsers[i].char_d = newallUsers[i].char_d - (newallUsers[i].char_d*0.01);
              newallUsers[i].char_w = newallUsers[i].char_w - (newallUsers[i].char_w*0.01);
              newallUsers[i].char_m = newallUsers[i].char_m - (newallUsers[i].char_m*0.01);
              newallUsers[i].popularity = newallUsers[i].popularity - 1;
            }
          }
        }
        if(newallSqueals[indexSqueal].channel!=""){
          switch(newallSqueals[indexSqueal].typesender){
            case "channels":
              for(let i=0; i<allchannels.length; i++){
                if(allchannels[i].name===newallSqueals[indexSqueal].channel){
                  let counter = 0;
                  for(let j=0; j<allchannels[i].list_posts.length; j++){
                    if((newallSqueals[indexSqueal].sender===allchannels[i].list_posts[j].sender)&(newallSqueals[indexSqueal].date===allchannels[i].list_posts[j].date)&(newallSqueals[indexSqueal].hour===allchannels[i].list_posts[j].hour)&(newallSqueals[indexSqueal].seconds===allchannels[i].list_posts[j].seconds)){
                      channelsModified[i].list_posts[j].pos_reactions = newallSqueals[indexSqueal].pos_reactions;
                      channelsModified[i].list_posts[j].neg_reactions = newallSqueals[indexSqueal].neg_reactions;
                      channelsModified[i].list_posts[j].usersReactions = newallSqueals[indexSqueal].usersReactions;
                    }
                    if(channelsModified[i].list_posts[j].category=="unpopular"){
                      counter += 1;
                    }
                  }
                  if(counter%5==0 & counter>0){
                    channelsModified[i].popularity = channelsModified[i].popularity - 1;
                  }
                }
              }
            break;
            case "CHANNELS":
              for(let i=0; i<allCHANNELS.length; i++){
                if(allCHANNELS[i].name===newallSqueals[indexSqueal].channel){
                  let counter = 0;
                  for(let j=0; j<allCHANNELS[i].list_posts.length; j++){
                    if((newallSqueals[indexSqueal].sender===allCHANNELS[i].list_posts[j].sender)&(newallSqueals[indexSqueal].date===allCHANNELS[i].list_posts[j].date)&(newallSqueals[indexSqueal].hour===allCHANNELS[i].list_posts[j].hour)&(newallSqueals[indexSqueal].seconds===allCHANNELS[i].list_posts[j].seconds)){
                      CHANNELSModified[i].list_posts[j].pos_reactions = newallSqueals[indexSqueal].pos_reactions;
                      CHANNELSModified[i].list_posts[j].neg_reactions = newallSqueals[indexSqueal].neg_reactions;
                      CHANNELSModified[i].list_posts[j].usersReactions = newallSqueals[indexSqueal].usersReactions;
                    }
                    if(CHANNELSModified[i].list_posts[j].category=="unpopular"){
                      counter += 1;
                    }
                  }
                  if(counter%5==0 & counter>0){
                    CHANNELSModified[i].popularity = CHANNELSModified[i].popularity - 1;
                  }
                }
              }
            break;
            case "keywords":
              for(let i=0; i<allkeywords.length; i++){
                if(allkeywords[i].name===newallSqueals[indexSqueal].channel){
                  let counter = 0;
                  for(let j=0; j<allkeywords[i].list_posts.length; j++){
                    if((newallSqueals[indexSqueal].sender===allkeywords[i].list_posts[j].sender)&(newallSqueals[indexSqueal].date===allkeywords[i].list_posts[j].date)&(newallSqueals[indexSqueal].hour===allkeywords[i].list_posts[j].hour)&(newallSqueals[indexSqueal].seconds===allkeywords[i].list_posts[j].seconds)){
                      keywordsModified[i].list_posts[j].pos_reactions = newallSqueals[indexSqueal].pos_reactions;
                      keywordsModified[i].list_posts[j].neg_reactions = newallSqueals[indexSqueal].neg_reactions;
                      keywordsModified[i].list_posts[j].usersReactions = newallSqueals[indexSqueal].usersReactions;
                    }
                    if(keywordsModified[i].list_posts[j].category=="unpopular"){
                      counter += 1;
                    }
                  }
                  if(counter%5==0 & counter>0){
                    keywordsModified[i].popularity = keywordsModified[i].popularity - 1;
                  }
                }
              }
            break;
          }
        }
    }
    newallSqueals = await rimuoviDuplicati(newallSqueals);
    setAllSquealsCollection(newallSqueals);
    await updateAllSqueals(newallSqueals, indexSqueal);
    const newSquealsPrint = allSqueals.map(subItem => {

      const superItem = newallSqueals.find(item => item._id === subItem._id);

      if (superItem) {
        return { ...subItem, ...superItem };
      }

      return subItem;
    });
    setallSqueals(newSquealsPrint);
    let ListChannelsModified = [...channelsModified, ...CHANNELSModified, ...keywordsModified];
    if(newallSqueals[indexSqueal].channel!=""){
    	let ind = ListChannelsModified.findIndex(item => item.name === newallSqueals[indexSqueal].channel);
    	await updateAllChannels(ListChannelsModified, ind);
    	ind = ListChannelsModified.findIndex(item => item.name === "CONTROVERSIAL");
    	await updateAllChannels(ListChannelsModified, ind);
    }
    setAllUsers(newallUsers);
    await updateAllUsers(newallUsers);
  };

const handleClose = () => {
    setViewAnswers(false);
};

const handleTextAnswer = (event) => {
  setTextAnswer(event.target.value);
};

const showModal = () => {
  setShowLinkModal(true);
};

const accessCamera = () => {
  setShowCameraModal(true);
};

const accessVideo = () => {
  setShowCameraVideoModal(true);
};

const handleInputChange = (e) => {
  setinputLink(e.target.value);
};

const handleSubmitLink = () => {
    if (isLink(inputLink)) {
      setLinkAnswer(inputLink);
      setShowLinkModal(false);
    } else {
      alert("Please insert a link that starts with 'http://' or 'https://'.");
    }
};     

const isLink = (string) => {
  const regex = /^(http:\/\/|https:\/\/)/;
  return regex.test(string);
}

const capturePhoto = () => {
  const imageSrc = webcamRef.current.getScreenshot();
  setPhotoAnswer(imageSrc);
  setShowCameraModal(false);
  }

const getPosition = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setPositionMap([latitude, longitude]);
      setIsMapVisible(true);
      setPositionAnswer([latitude, longitude]);
    }, (error) => {
      console.error(error);
    });
  } else {
    alert('Geolocation not supported on this browser.');
  }
};

const sendAnswer = async () => {
  let text = textAnswer;
  let link = linkAnswer;
  let img = photoAnswer;
  let video = videoAnswer;          
  let position = [];
  if(positionAnswer.length!=0){
    position[0] = positionAnswer[0];
    position[1] = positionAnswer[1];
  }
  if((text!="")|(link!="")|(video!="")|(img!="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")|(position.length!=0)){
  const data = new Date();
  let month;
  if((data.getMonth()+1)<10){
    month = "0" + (data.getMonth()+1);
  } else {
    month = data.getMonth()+1;
  }
  let day;
  if(data.getDate()<10){
    day = "0" + data.getDate();
  } else {
    day = data.getDate();
  }
  let date = day + "/" + month + "/" + data.getFullYear();
  let minutes = data.getMinutes();
  let seconds = data.getSeconds();
  if(minutes<10){
   minutes = "0" + minutes;
  }
  let hour = data.getHours() + ":" + minutes;
  let answer = {sender:actualuser.nickname,body:{text:text,photo:img,video:video,link:link,position:position}, photoprofile:actualuser.photoprofile, photoprofileX:actualuser.photoprofileX, photoprofileY:actualuser.photoprofileY, date:date,hour:hour,seconds:seconds};
  const allAnswers = [...allAnswersprint,answer];
  setAllAnswersprint(allAnswers);
  const newSqueals = allSquealsCollection.map(obj => {
    if (obj._id === idAnswer) {
      // Aggiorna l'array all'interno dell'oggetto
      return { ...obj, answers: [...obj.answers, answer] };
    }
    return obj;
  });
  const newSquealsPrint = allSqueals.map(subItem => {
    const superItem = newSqueals.find(item => item._id === subItem._id);
    if (superItem) {
      return { ...subItem, ...superItem };
    }
    return subItem;
  });
  setallSqueals(newSquealsPrint);
  setallSquealsprint(newSquealsPrint);
  setAllSquealsCollection(newSqueals);
  let NewSqueals = await rimuoviDuplicati(newSqueals);
  let index = NewSqueals.findIndex(obj => obj._id === idAnswer);
  await updateAllSqueals(NewSqueals, index);
  setLinkAnswer("");
  setTextAnswer("");
  setVideoAnswer("");
  setPhotoAnswer("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
  setPositionAnswer([]);
  setIsMapVisible(false);
  } else {
    alert("The answer is empty!");
  }
}

const OpenAnswers = (index) => {
  const newAnswers = [...allSquealsprint[index].answers];
  setAllAnswersprint(newAnswers);
  setViewAnswers(true);
  setIdAnswer(allSquealsprint[index]._id);
}

const loadImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoAnswer(e.target.result);
      setShowCameraModal(false);
    };
    reader.readAsDataURL(file);
  }
};

const handleVideoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoAnswer(e.target.result);
        setShowCameraModal(false);
      };
      reader.readAsDataURL(file);
    }
  }

    return(
        <Container
                style={{
                  width: windowSize>=1024 ? '80%': windowSize>=600 ? '90%' : '100%',
                  left:windowSize>=1024 ? '20%': windowSize>=600 ? '10%' : '0',
                  height: windowSize>=600 ? '100vh' : '90%',
                  position:'absolute',
                  alignItems: 'center',
                  overflow:'hidden'
                }}
                className="mx-auto d-flex flex-column"
              >
              <div style={{position:'relative', marginTop:'130px', height:'100%', overflowY:'scroll', width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                  {allSquealsprint.length!=0 && allSquealsprint.map((squeal,index) => (
                    <Card key={index} data-id={squeal._id} className='message' style={{color:'black', borderColor:'black', width:windowSize>=600 ? '500px' : '280px', marginBottom:'5%'}}>
                    <Card.Header className='d-flex' style={{justifyContent:'space-between'}}>
                      <CardGroup style={{width:windowSize<600 ? '100%' : 'auto', display:'flex'}}>
                        {squeal.typesender=='Users' ?
                          ( squeal.photoprofile!='' ? (<div className='me-3' style={{width:'30px',height:'30px', borderRadius:'50%', border:'2px solid black', display:'flex', alignItems:'center', overflow:'hidden'}}>
                            <Image src={squeal.photoprofile} style={{width:'100%', height:'100%', position:'relative', marginTop: squeal.photoprofileY/2.5, marginLeft: squeal.photoprofileX/2.5}}></Image>
                            </div>)
                            : (<PersonCircle size='30' fill='black' className='me-3'></PersonCircle>)
                          )
                          :
                          ( squeal.photoprofile!='' ? (<div className='me-3' style={{width:'30px',height:'30px', borderRadius:'50%', border:'2px solid black', display:'flex', alignItems:'center', overflow:'hidden'}}>
                            <Image src={squeal.photoprofile} style={{width:'100%', height:'100%', position:'relative', marginTop: squeal.photoprofileY/2.5, marginLeft: squeal.photoprofileX/2.5}}></Image>
                            </div>)
                            : (<div className='me-3' style={{width:'30px',height:'30px', borderRadius:'50%', border:'2px solid black', display:'flex', alignItems:'center', overflow:'hidden'}}>
                            <Image src={'/squealer-app'+channel_profile} style={{width:'100%', filter:'invert(1)'}}></Image></div>)
                          )
                        }
                        {((squeal.typesender=='channels')||(squeal.typesender=='CHANNELS')) ?
                        (squeal.sender+" from "+squeal.channel)
                        : (squeal.typesender=='keywords') ? 
                        (squeal.sender+" from #"+squeal.channel)
                        :
                        (squeal.sender)
                      }
                        
                      </CardGroup>
                      {windowSize>=600 && (<Card.Text>{squeal.date+" "+squeal.hour}</Card.Text>)}
                    </Card.Header>
                    <Card.Body>
                    <Card.Text style={{textAlign:'left'}}>
                                    {squeal.body.text}
                                </Card.Text>
                                {squeal.body.photo!="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" && (
                                  <div style={{ position: 'relative', width: '200px', maxHeight: '200px', overflow: 'hidden' }}>
                                    <img src={squeal.body.photo} alt="squeal photo" width="100%" />
                                  </div>
                                )} 
                                {squeal.body.video!='' && (
                                <div style={{ position: 'relative', width: '200px', maxHeight: '200px', overflow: 'hidden' }}>
                                    <video src={squeal.body.video} alt="Squeal video" width="200px" height="100px" controls/>
                                </div>
                                )}
                            {squeal.body.position.length!=0 &&(
                                <Card style={{ width: windowSize >= 600 ? '70%' : '200px', height: '200px', position: 'relative', marginTop:'20px', marginBottom:'20px' }}>
                                    <MapContainer center={squeal.body.position} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
                                            <Marker position={squeal.body.position} icon={markerIcon}>
                                                <Popup>Sei qui!</Popup>
                                            </Marker>
                                    </MapContainer>
                                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000 }}>
                                        <Button variant="light" onClick={() => {const url = `https://www.google.com/maps/search/?api=1&query=${squeal.body.position[0]},${squeal.body.position[1]}`; window.open(url, '_blank');}}>Open Map</Button>
                                    </div>
                                </Card>
                            )}
                            {squeal.body.link!='' && (
                                <div style={{ marginTop: '10px', wordBreak: 'break-all', width:'100%', display:'flex', alignItems:'center', justifyContent:'left'}}>
                                    <a href={squeal.body.link} target="_blank" rel="noreferrer">{squeal.body.link}</a>
                                </div>
                            )}
                    </Card.Body>
                    <Card.Footer className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap'}}>
                      <Button className="" style={{backgroundColor:'transparent',border:'0', color: "black"}} onClick={() => OpenAnswers(index)}><Send style={{cursor:'pointer'}}></Send>{'('+squeal.answers.length+')'}</Button>
                      {windowSize<600 && (<Card.Text style={{margin:'0', display:'flex', alignItems:'center'}}>{squeal.date+" "+squeal.hour}</Card.Text>)}
                      <div className='d-flex justify-content-center' style={{width:windowSize<600 ? '100%' : 'auto', marginTop:windowSize<600 ? '0.25rem' : '0'}}>
                        <Card.Text className='me-1'>
                          {squeal.pos_reactions}
                        </Card.Text>
                        <Image src={'/squealer-app'+pos_reaction1} style={{cursor:'pointer',marginRight:'1px'}} width='25' height='25' onClick={() => reactionSqueal(index,1)}></Image>
                        <Image src={'/squealer-app'+pos_reaction2} style={{cursor:'pointer',marginRight:'1px'}} width='25' height='25' onClick={() => reactionSqueal(index,2)}></Image>
                        <Image src={'/squealer-app'+pos_reaction3} style={{cursor:'pointer',marginRight:'1px'}} width='25' height='25' onClick={() => reactionSqueal(index,3)}></Image>
                        <Card.Text style={{marginLeft:'10px'}} className='me-1'>
                          {squeal.neg_reactions}
                        </Card.Text>
                        <Image src={'/squealer-app'+neg_reaction1} style={{cursor:'pointer',marginRight:'1px'}} width='25' height='25' onClick={() => reactionSqueal(index,4)}></Image>
                        <Image src={'/squealer-app'+neg_reaction2} style={{cursor:'pointer',marginRight:'1px'}} width='25' height='25' onClick={() => reactionSqueal(index,5)}></Image>
                        <Image src={'/squealer-app'+neg_reaction3} style={{cursor:'pointer',marginRight:'1px'}} width='25' height='25' onClick={() => reactionSqueal(index,6)}></Image>
                      </div>
                    </Card.Footer>
                  </Card>
                  ))}
              </div>
              <button
                style={{width:'100%',height:'100%', opacity:'0.7', position:'absolute', border:'none', backgroundColor:'black', zIndex:'1001'}}
                className={`${showbtnopacity ? '' : 'd-none'}`}
                onClick={handleBlur}
              >
              </button>

              <Form className="d-flex flex-column" style={{position:'absolute', top:'5%'}}>
                <InputGroup style={{ width: windowSize>= 600 ? '500px' : '300px', zIndex:'1002'}} className="d-flex flex-column">
                    <FormControl
                      type="text"
                      placeholder={inputSearch}
                      value={clientinputSearch}
                      variant="outline-success"
                      className="formcontroll-inputSearch"
                      style={{
                        boxShadow: 'none',
                        borderRadius: '14px',
                        borderColor: 'black',
                        backgroundColor: 'white',
                        backgroundImage: showIcon ? `url(${search_logo})` : 'none',
                        backgroundSize: '20px',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: '10px center',
                        paddingLeft: showIcon ? '40px' : '20px',
                        paddingRight: '160px',
                        color: 'black',
                        width: '100%',
                      }}
                      onFocus={handleFocus}
                      onChange={writeinputSearch}
                    />
                      <Button 
                        id="dropdown-button-dark-example1" 
                        variant="secondary"
                        style={{
                          boxShadow: 'none',
                          borderRadius: '14px',
                          width: windowSize>=600 ? '150px' : '100px',
                          backgroundColor: '#cd9933',
                          color: 'white',
                          position: 'absolute',
                          left: windowSize>=600 ? '351px' : '201px',
                          cursor:'pointer',
                        }}
                        onClick={toggleDropdown}
                      >Filter
                      <CaretDownFill size='12' style={{marginLeft:'10px'}}></CaretDownFill>
                      </Button>
                    
                      <div className='d-flex' width={windowSize>=600 ? '500px' : '300px'}>
                        {suggestedProfiles.length > 0 && isSuggestionsVisible == true && (
                        <div className="suggested-profiles-container" style={{borderRadius:'14px',marginRight:windowSize>=600 ? '-350px' : '-201px'}}>
                          <ul style={{paddingLeft:'0'}}>
                            {suggestedProfiles.map((profile, index) => (
                              <li key={index} onClick={() => handleItemSelect(profile)} style={{listStyle:'none',textAlign:'center',cursor:'pointer'}}>
                                {profile}
                              </li>
                            ))}
                          </ul>
                        </div>
                        )}
                        <ul
                          style={{
                            boxShadow: 'none',
                            borderRadius: '14px',
                            width: windowSize>=600 ? '150px' : '100px',
                            height: '130px',
                            marginLeft:windowSize>600 ? '350px' : '201px',
                            backgroundColor: '#cd9933',
                            color: 'white',
                            position:'relative',
                            padding:'0',
                            paddingTop:'12px',
                            textAlign:'center',
                          }}
                          className={`${isDropdownOpen ? '' : 'd-none'}`}
                        >
                          <li
                              onClick={() => handleItemClick('Users')}
                              className={`${selectedItems.includes('Users') ? 'active' : ''}`}
                              style={{listStyle:'none',cursor:'pointer',color:'white',marginBottom:'3px'}}
                            >
                              Users
                            </li>
                            <li
                              onClick={() => handleItemClick('channels')}
                              className={`${selectedItems.includes('channels') ? 'active' : ''}`}
                              style={{listStyle:'none',cursor:'pointer',color:'white',marginBottom:'3px'}}
                            >
                              channels
                            </li>
                            <li
                              onClick={() => handleItemClick('CHANNELS')}
                              className={`${selectedItems.includes('CHANNELS') ? 'active' : ''}`}
                              style={{listStyle:'none',cursor:'pointer',color:'white',marginBottom:'3px'}}
                            >
                              CHANNELS
                            </li>
                            <li
                              onClick={() => handleItemClick('keywords')}
                              className={`${selectedItems.includes('keywords') ? 'active' : ''}`}
                              style={{listStyle:'none',cursor:'pointer',color:'white',marginBottom:'3px'}}
                            >
                              keywords
                            </li>
                        </ul>
                      </div>
                </InputGroup>
              </Form> 
              <Container style={{width: '100%', height: '100vh', position:'absolute', alignItems: 'center', overflowY:'scroll', overflowX:'hidden', alignItems:'center', zIndex:'1003', backgroundColor:'#eee'}} className={`${viewAnswers ? 'd-flex flex-column' : 'd-none'}`}>
                <Form id="writenewsqueal" className="container-fluid position-relative flex-column align-items-center" style={{display: 'flex', width: '100%', top: '0', left: '0', backgroundColor:'#eee', marginBottom:'13%'}}>
                  <button type="button" className="btn-close" aria-label="Close" id="closewritenewsqueal" style={{position: 'absolute', top: '3%', right: '2%', fontSize: '30px', filter: 'invert(1)', zIndex: 2, color: "black", backgroundColor: "gray"}} onClick={handleClose}></button>
                  <h3 className="text-center mt-5 mb-4" style = {{color: "black !important"}}>Write new Answer</h3>
                  <div className="card border mt-3 d-flex flex-row" style={{width: windowSize >= 600 ? '400px' : '280px', minHeight: '200px', alignItems:'center', border: '#9a6634'}}>
                      <section  style={{width: '80%', height: '100%'}}>
                          <div className="card-body text-center d-flex align-items-center flex-column" style={{width: '100%', minHeight: '150px'}}>
                              <textarea className="bg-transparent border-0" id="textnewsqueal" style={{width: '100%', resize: 'none', outline:'none'}} placeholder="What're you thinking about?" value={textAnswer} onChange={handleTextAnswer}></textarea>
                              {photoAnswer!="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" && (
                              <div style={{ position: 'relative', width: '200px', maxHeight: '200px', overflow: 'hidden' }}>
                                <img src={photoAnswer} alt="Taken" width="100%" />
                                <button onClick={() => {setPhotoAnswer('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')}} className="btn btn-sm btn-danger" style={{ position: 'absolute', top: '10px', right: '10px' }}>X</button>
                              </div>
                            )} 
                            {videoAnswer!="" && (
                              <div style={{ position: 'relative', width: '200px', height: '100px', overflow: 'hidden' }}>
                                <video src={videoAnswer} alt="Taken" width="200px" height="100px" controls/>
                                <button onClick={() => {setVideoAnswer('')}} className="btn btn-sm btn-danger" style={{ position: 'absolute', top: '10px', right: '10px' }}>X</button>
                              </div>
                            )} 
                            {isMapVisible &&(
                                <Card style={{ width: windowSize>=600 ? '70%' : '200px', height: '200px', position: 'relative', marginTop:'20px', marginBottom:'20px' }}>
                                    <MapContainer center={positionMap} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
                                            <Marker position={positionMap} icon={markerIcon}>
                                                <Popup>Sei qui!</Popup>
                                            </Marker>
                                    </MapContainer>
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
                                        <Button variant="danger" onClick={() => {setIsMapVisible(false); setPositionMap(null); setPositionAnswer([])}}>X</Button>
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000 }}>
                                        <Button variant="light" onClick={() => {const url = `https://www.google.com/maps/search/?api=1&query=${positionMap[0]},${positionMap[1]}`; window.open(url, '_blank');}}>Open Map</Button>
                                    </div>
                                </Card>
                            )}
                            {linkAnswer!="" && (
                                <div style={{ marginTop: '10px', wordBreak: 'break-all', width:'100%', display:'flex', alignItems:'center', justifyContent:'left'}}>
                                    <a href={linkAnswer} target="_blank" rel="noreferrer">{linkAnswer}</a>
                                    <Button variant="danger" className='ms-3' onClick={() => {setLinkAnswer('')}}>X</Button>
                                </div>
                            )}
                          </div>
                          <div className="card-footer d-flex justify-content-center" style={{height: '50px', backgroundColor: 'transparent'}}>
                              <label style={{cursor: 'pointer'}} onClick={() => showModal()}><Link45deg className="me-3"></Link45deg></label>
                              <label style={{cursor: 'pointer'}}><Camera className="me-3" onClick={() => accessCamera()}></Camera></label>
                              <label style={{cursor: 'pointer'}}><CameraVideo className="me-3" onClick={() => accessVideo()}></CameraVideo></label>
                              <label style={{cursor: 'pointer'}}><GeoAlt className="me-3" onClick={() => getPosition()}></GeoAlt></label>
                          </div>
                      </section>
                      <section className="d-flex align-items-center justify-content-center" style={{width: '20%', height: '100%'}}>
                          <Send style={{fontSize: '32px', cursor: 'pointer'}} id="sendnewsqueal" onClick={() => sendAnswer()}></Send>
                      </section>
                  </div>
                </Form>
                <div style={{position:'relative', height:'100%', overflowY:'scroll', width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                  {allAnswersprint.length!=0 && allAnswersprint.map((squeal,index) => (
                    <Card key={index} data-id={squeal._id} className='message' style={{color:'black', borderColor:'white', width: windowSize>=600 ? '400px' : '280px', marginBottom: (allAnswersprint.length-1) ===index ? '100px': '5%'}}>
                    <Card.Header className='d-flex' style={{justifyContent:'space-between'}}>
                      <CardGroup>
                          {squeal.photoprofile!='' ? (<div className='me-3' style={{width:'30px',height:'30px', borderRadius:'50%', border:'2px solid white', display:'flex', alignItems:'center', overflow:'hidden'}}>
                            <Image src={squeal.photoprofile} style={{width:'100%', height:'100%', position:'relative', marginTop: squeal.photoprofileY/2.5, marginLeft: squeal.photoprofileX/2.5}}></Image>
                            </div>)
                            : (<PersonCircle size='30' fill='black' className='me-3'></PersonCircle>)
                          }
                        {squeal.sender}
                      </CardGroup>
                      <Card.Text>{squeal.date+" "+squeal.hour}</Card.Text>
                    </Card.Header>
                    <Card.Body>
                    <Card.Text style={{textAlign:'left'}}>
                                    {squeal.body.text}
                                </Card.Text>
                                {squeal.body.photo!="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" && (
                                  <div style={{ position: 'relative', width: '200px', maxHeight: '200px', overflow: 'hidden' }}>
                                    <img src={squeal.body.photo} alt="squeal photo" width="100%" />
                                  </div>
                                )} 
                                {squeal.body.video!='' && (
                                <div style={{ position: 'relative', width: '200px', maxHeight: '200px', overflow: 'hidden' }}>
                                    <video src={squeal.body.video} alt="Squeal video" width="200px" height="100px" controls/>
                                </div>
                                )}
                            {squeal.body.position.length!=0 &&(
                                <Card style={{ width: windowSize>=600 ? '70%' : '200px', height: '200px', position: 'relative', marginTop:'20px', marginBottom:'20px' }}>
                                    <MapContainer center={squeal.body.position} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
                                            <Marker position={squeal.body.position} icon={markerIcon}>
                                                <Popup>Sei qui!</Popup>
                                            </Marker>
                                    </MapContainer>
                                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000 }}>
                                        <Button variant="light" onClick={() => {const url = `https://www.google.com/maps/search/?api=1&query=${squeal.body.position[0]},${squeal.body.position[1]}`; window.open(url, '_blank');}}>Open Map</Button>
                                    </div>
                                </Card>
                            )}
                            {squeal.body.link!='' && (
                                <div style={{ marginTop: '10px', wordBreak: 'break-all', width:'100%', display:'flex', alignItems:'center', justifyContent:'left'}}>
                                    <a href={squeal.body.link} target="_blank" rel="noreferrer">{squeal.body.link}</a>
                                </div>
                            )}
                    </Card.Body>
                  </Card>
                  ))}
                </div>
              </Container>
              <Modal show={showLinkModal} onHide={() => setShowLinkModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Insert a Link</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup>
                        <FormControl placeholder="Inserisci il tuo link qui" value={inputLink} onChange={handleInputChange}/>
                        <InputGroup.Text>
                            <Button variant="primary" onClick={handleSubmitLink}>Send</Button>
                                {displayedLink && (
                                    <Button variant="danger" className="ms-2" onClick={() => {setDisplayedLink(''); setinputLink('');}}>Rimuovi</Button>
                                )}
                        </InputGroup.Text>
                    </InputGroup>
                </Modal.Body>
              </Modal>
              <Modal show={showCameraModal} style={{position:'absolute', top:'0', left:'20%', width:'80%', height:'100%'}} onHide={() => setShowCameraModal(false)}>
                  <Modal.Header closeButton>
                  <Modal.Title>Take or select photo</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width="100%"/>
                  <Button className="mt-2" onClick={capturePhoto}>Take</Button>
                  <input type="file" id="selectpicturewebcam" class="d-none" accept="image/*" onChange={loadImage}></input>
                  <label htmlFor="selectpicturewebcam" class="btn btn-primary mt-2 ms-2">Select picture</label>
                  </Modal.Body>
              </Modal>
              <Modal show={showCameraVideoModal} onHide={() => setShowCameraVideoModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Carica un video</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="mt-2">
                  <label className="btn btn-primary">
                    Carica video
                    <input 
                      type="file" 
                      hidden 
                      onChange={handleVideoChange}
                      accept="video/*"
                    />
                  </label>
                </div>
              </Modal.Body>
            </Modal>
            </Container>
    )
}

export default Home;
