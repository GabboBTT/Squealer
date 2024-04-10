import React, { useState, useRef, useEffect} from 'react';
import { Container, Form, InputGroup, FormControl, Button, Image, Card, Row, Col, CardGroup } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './App.css';
import search_logo from '../src/img/search.png'
import pos_reaction1 from '../src/img/reaction_positive1.png'
import pos_reaction2 from '../src/img/reaction_positive2.png'
import pos_reaction3 from '../src/img/reaction_positive3.png'
import neg_reaction1 from '../src/img/reaction_negative1.png'
import neg_reaction2 from '../src/img/reaction_negative2.png'
import neg_reaction3 from '../src/img/reaction_negative3.png'
import channel_profile from '../src/img/channel_profile.png';
import {CaretDownFill, PersonCircle} from 'react-bootstrap-icons';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {getUsers, getListChannels, getUserById, getListSqueals, getActualUser, updateUsers, updateChannel, updateSqueals, addUser, addSqueal, addChannel} from './serverRequests.js';

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

function Search() {
    const [actualuser, setactualuser] = useState()
    const [selectedItems, setSelectedItems] = useState([]);
    const location = useLocation();
    const [inputSearch, setinputSearch] = useState("");
    const [clientinputSearch, setclientinputSearch] = useState("");
    const [showIcon, setshowIcon] = useState(true);
    const [isDropdownOpen, setisDropdownOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [allSqueals, setallSqueals] = useState([]);
    const [allprint,setallprint] = useState([]);
    const [allchannels, setallchannels] = useState([]);
    const [allCHANNELS, setallCHANNELS] = useState([]);
    const [allkeywords, setallkeywords] = useState([]);
    const [viewprofile, setViewprofile] = useState(false);
    const [viewsearch, setViewsearch] = useState(true);
    const [viewchannel, setViewchannel] = useState(false);
    const [viewKeyword, setViewKeyword] = useState(false);
    const [actualprofile, setActualprofile] = useState({});
    const [allSquealsprint, setallSquealsprint] = useState([]);
    const [allChannelsprint, setallChannelsprint] = useState([]);
    const [mychannelsactive, setmychannelsactive] = useState(false);
    const [mypostsactive, setmypostsactive] = useState(true);
    const [n_channeladmin, setn_channeladmin] = useState(0);
    const [channelpostsactive, setchannelpostsactive] = useState(true);
    const [channelusersactive, setchannelusersactive] = useState(false);
    const [channelmessagesactive, setchannelmessagesactive] = useState(false);
    const [newchannelusers, setnewchannelusers] = useState([]);
    const [newchannelposts, setnewchannelposts] = useState([]);
    const [newchannelmessages, setnewchannelmessages] = useState([]);
    const [newnamechannel, setnewnamechannel] = useState('');
    const [newbiochannel, setnewbiochannel] = useState('');
    const [newphotochannel, setnewphotochannel] = useState('');
    const [positionchannel, setPositionchannel] = useState({ x: 0, y: 0 });
    const [newsilenceablechannel, setnewsilenceablechannel] = useState(false);
    const [inChannel, setInChannel] = useState(false);
    const [newKeywordPosts, setNewKeywordPosts] = useState([]);
    const [newNameKeyword, setNewNameKeyword] = useState('');
    const [newBioKeyword, setNewBioKeyword] = useState('');
    const [newPhotoKeyword, setNewPhotoKeyword] = useState('');
    const [positionKeyword, setPositionKeyword] = useState({ x: 0, y: 0 });
    const [inKeyword, setInKeyword] = useState(false);
    const markerIcon = new L.Icon({
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      iconAnchor: [12, 41]
    });
    const [silenceChannel, setSilenceChannel] = useState(false);
    const windowSize = useWindowSize();

  useEffect(() => {
        if (location.pathname.endsWith('/search')) {
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
                const user = await getActualUser();
                setactualuser(user);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
                throw error;
            }
          }
          async function getAll3(){
            try{
                const squeals = await getListSqueals();
                setallSqueals(squeals);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
                throw error;
            }
          }  
          async function getAll4(){
            try{
                const Channels = await getListChannels();
                let newAllchannels = [];
                let newAllCHANNELS = [];
                let newAllKeywords = [];

                for (let i = 0; i < Channels.length; i++) {
                  switch (Channels[i].type) {
                    case '&':
                      newAllchannels.push(Channels[i]);
                      break;
                    case '$':
                      newAllCHANNELS.push(Channels[i]);
                      break;
                    case '#':
                      newAllKeywords.push(Channels[i]);
                      break;
                  }
                }

                setallchannels(newAllchannels);
                setallCHANNELS(newAllCHANNELS);
                setallkeywords(newAllKeywords);
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

    async function updateAllChannels(ChannelsToUpdate, indexChannel){
      try{
        if(indexChannel!==-1){
          const ChannelsUpdated = {list_users:ChannelsToUpdate[indexChannel].list_users, usersSilenced:ChannelsToUpdate[indexChannel].usersSilenced};
          await updateChannel(ChannelsToUpdate[indexChannel]._id, ChannelsUpdated);
        }
      } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
          throw error;
      }
    }

    async function addNewSqueal(squeal){
      try{
        await addSqueal(squeal);
      } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
          throw error;
      }
    }

    const handleFocus = () => {
        setshowIcon(false);
        setinputSearch("");
    };

    const writeinputSearch = (event) => {
        setallprint([]);
        const value = event.target.value;
        setclientinputSearch(value);
        if(value!=""){
            for(let i=0;i<allUsers.length;i++){
                let user = ((allUsers[i].nickname).slice(0,value.length)).toLowerCase();
                    if(value.toLowerCase()==user){
                        setallprint(prevallUsers => [...prevallUsers,"@"+allUsers[i].nickname]);
                    }
            }
            for(let i=0;i<allchannels.length;i++){
                let chan = ((allchannels[i].name).slice(0,value.length)).toLowerCase();
                    if(value.toLowerCase()==chan){
                        setallprint(prevallchan => [...prevallchan,"&"+allchannels[i].name]);
                    }
            }
            for(let i=0;i<allCHANNELS.length;i++){
                let chan = ((allCHANNELS[i].name).slice(0,value.length)).toLowerCase();
                    if(value.toLowerCase()==chan){
                        setallprint(prevallCHAN => [...prevallCHAN,"$"+allCHANNELS[i].name]);
                    }
            }
            for(let i=0;i<allkeywords.length;i++){
                let key = ((allkeywords[i].name).slice(0,value.length)).toLowerCase();
                    if(value.toLowerCase()==key){
                        setallprint(prevallkey => [...prevallkey,"#"+allkeywords[i].name]);
                    }
            }
        } else {
        setallprint([]);
    }
    };

    const handleBlur = () => {
        setshowIcon(true);
    };
  
    const toggleDropdown = () => {
        setisDropdownOpen(!isDropdownOpen);
    };

    const handleItemSelect = (item) => {
        let typeItemSelect = item.slice(0,1);
        setinputSearch(item.slice(1,item.length));
        switch(typeItemSelect){
            case '@':
              setViewprofile(true);
              setViewsearch(false);
              for(let i=0;i<allUsers.length;i++){
                if(allUsers[i].nickname==(item.slice(1,item.length))){
                  setActualprofile(allUsers[i]);
                }
              }
              let channeladmin = 0;
            setallSquealsprint([]);
            setallChannelsprint([]);
            for(let i=0;i<allSqueals.length;i++){
                if(allSqueals[i].sender==(item.slice(1,item.length))){
                    setallSquealsprint(prevallSquealsprint => [...prevallSquealsprint,allSqueals[i]])
                }
            }
            for(let i=0;i<allchannels.length;i++){
                for(let j=0;j<allchannels[i].list_users.length;j++)
                if(allchannels[i].list_users[j].nickname==(item.slice(1,item.length))){
                    setallChannelsprint(prevallchannelsprint => [...prevallchannelsprint,allchannels[i]]);
                        if((allchannels[i].list_users[j].type=='Modifier')|(allchannels[i].list_users[j].type=='Creator')){
                            channeladmin += 1;
                        }
                }
            }
            for(let i=0;i<allCHANNELS.length;i++){
                for(let j=0;j<allCHANNELS[i].list_users.length;j++)
                if(allCHANNELS[i].list_users[j].nickname==(item.slice(1,item.length))){
                    setallChannelsprint(prevallchannelsprint => [...prevallchannelsprint,allCHANNELS[i]]);
                        if((allCHANNELS[i].list_users[j].type=='Modifier')|(allCHANNELS[i].list_users[j].type=='Creator')){
                            channeladmin += 1;
                        }
                }
            }
            for(let i=0;i<allkeywords.length;i++){
                for(let j=0;j<allkeywords[i].list_users.length;j++)
                if(allkeywords[i].list_users[j].nickname==(item.slice(1,item.length))){
                    setallChannelsprint(prevallchannelsprint => [...prevallchannelsprint,allkeywords[i]]);
                }
            }
            setn_channeladmin(channeladmin);
            break;
            case '&':
              setViewchannel(true);
              setViewsearch(false);
              for(let x=0; x<allchannels.length; x++){
                if(allchannels[x].name==(item.slice(1,item.length))){
                  setnewnamechannel(allchannels[x].name);
                  setnewbiochannel(allchannels[x].description);
                  setnewchannelusers(allchannels[x].list_users);
                  setnewchannelmessages(allchannels[x].list_mess);
                  setnewchannelposts(allchannels[x].list_posts);
                  setnewsilenceablechannel(allchannels[x].silenceable);
                  setInChannel(false);
                  for(let j=0;j<allchannels[x].list_users.length;j++){
                    if(allchannels[x].list_users[j].nickname==(actualuser.nickname)){
                        setInChannel(true);
                    }
                  }
                  setSilenceChannel(false);
                  for(let k=0; k<allchannels[x].usersSilenced.length;k++){
                    if(allchannels[x].usersSilenced[k] == (actualuser.nickname)){
                      setSilenceChannel(true);
                    }
                  }
                  setnewphotochannel(allchannels[x].photoprofile);
                  setPositionchannel({x:allchannels[x].photoprofileX, y:allchannels[x].photoprofileY});
                }
              }
            break;
            case '$':
              setViewchannel(true);
              setViewsearch(false);
              for(let x=0; x<allCHANNELS.length; x++){
                if(allCHANNELS[x].name==(item.slice(1,item.length))){
                  setnewnamechannel(allCHANNELS[x].name);
                  setnewbiochannel(allCHANNELS[x].description);
                  setnewchannelusers(allCHANNELS[x].list_users);
                  setnewchannelmessages(allCHANNELS[x].list_mess);
                  setnewchannelposts(allCHANNELS[x].list_posts);
                  setnewsilenceablechannel(allCHANNELS[x].silenceable);
                  setInChannel(false);
                  for(let j=0;j<allCHANNELS[x].list_users.length;j++){
                    if(allCHANNELS[x].list_users[j].nickname==(actualuser.nickname)){
                        setInChannel(true);
                    }
                  }
                  setSilenceChannel(false);
                  for(let k=0; k<allCHANNELS[x].usersSilenced.length;k++){
                    if(allCHANNELS[x].usersSilenced[k] == (actualuser.nickname)){
                      setSilenceChannel(true);
                    }
                  }
                  setnewphotochannel(allCHANNELS[x].photoprofile);
                  setPositionchannel({x:allCHANNELS[x].photoprofileX, y:allCHANNELS[x].photoprofileY});
                }
              }
            break;
            case '#':
              setViewKeyword(true);
              setViewsearch(false);
              for(let x=0; x<allkeywords.length; x++){
                if(allkeywords[x].name==(item.slice(1,item.length))){
                  setNewNameKeyword(allkeywords[x].name);
                  setNewBioKeyword(allkeywords[x].description);
                  setNewKeywordPosts(allkeywords[x].list_posts);
                  setInKeyword(false);
                  for(let j=0;j<allkeywords[x].list_users.length;j++){
                    if(allkeywords[x].list_users[j].nickname==(actualuser.nickname)){
                        setInKeyword(true);
                    }
                  }
                  setNewPhotoKeyword(allkeywords[x].photoprofile);
                  setPositionKeyword({x:allkeywords[x].photoprofileX, y:allkeywords[x].photoprofileY});
                }
              }
            break;
        }
        setclientinputSearch("");
        let filterprint = [];
        setallprint(filterprint);
        setshowIcon(true);
    }

    const handleItemClick = (item) => {
        const selectedIndex = selectedItems.indexOf(item);
        let updatedItems = [...selectedItems];
        setinputSearch();
        setisDropdownOpen(true);

        if (selectedIndex === -1) {
            updatedItems.push(item);
        } else {
            updatedItems = updatedItems.filter((selectedItem) => selectedItem !== item);
        }
        const filterprint = ([]);
        setSelectedItems(updatedItems);
        if(updatedItems.length!=0){
            for(let i=0;i<updatedItems.length;i++){
                switch(updatedItems[i]){
                    case 'Users':
                        for(let j=0;j<allUsers.length;j++){
                            filterprint.push("@"+allUsers[j].nickname);
                        }
                    break;
                    case 'channels':
                        for(let j=0;j<allchannels.length;j++){
                            filterprint.push("&"+allchannels[j].name);
                        }
                    break;
                    case 'CHANNELS':
                        for(let j=0;j<allCHANNELS.length;j++){
                            filterprint.push("$"+allCHANNELS[j].name);
                        }
                    break;
                    case 'keywords':
                        for(let j=0;j<allkeywords.length;j++){
                            filterprint.push("#"+allkeywords[j].name);
                        }
                    break;
                }
            }
            setallprint(filterprint);
        } else {
            setallprint([]);
        }
    }

    const profilepostsactive = () => {
      setmypostsactive(true);
      setmychannelsactive(false);
    }

  const profilechannelsactive = () => {
      setmypostsactive(false);
      setmychannelsactive(true);
    }

  const closeviewprofile = () => {
    setViewprofile(false);
    setViewsearch(true);
  }

  const closeviewchannel = () => {
    setViewchannel(false);
    setViewsearch(true);
    setchannelpostsactive(true);
    setchannelusersactive(false);
    setchannelmessagesactive(false);
  }
  
const sectionchannelpostsactive = () => {
    setchannelpostsactive(true);
    setchannelusersactive(false);
    setchannelmessagesactive(false);
}

const sectionchannelusersactive = () => {
    setchannelpostsactive(false);
    setchannelusersactive(true);
    setchannelmessagesactive(false);
}

const sectionchannelmessagesactive = () => {
    setchannelpostsactive(false);
    setchannelusersactive(false);
    setchannelmessagesactive(true);
}

const closeViewKeyword = () => {
  setViewKeyword(false);
  setViewsearch(true);
}

const subscribechannel = async () => {
  if(inChannel){
    for(let i=0; i<allchannels.length; i++){
      if(allchannels[i].name==newnamechannel){
        for(let j=0;j<allchannels[i].list_users.length;j++){
          if(allchannels[i].list_users[j].nickname==actualuser.nickname){
            if(allchannels[i].list_users[j].type!='Creator'){
              allchannels[i].list_users.splice(j,1);
            } else {
              alert('You can not unsubscribe from a channel you are the creator of');
              return;
            }
          }
        }
      }
    }
    for(let i=0; i<allCHANNELS.length; i++){
      if(allCHANNELS[i].name==newnamechannel){
        for(let j=0;j<allCHANNELS[i].list_users.length;j++){
          if(allCHANNELS[i].list_users[j].nickname==actualuser.nickname){
            if(allCHANNELS[i].list_users[j].type!='Creator'){
              allCHANNELS[i].list_users.splice(j,1);
            } else {
              alert('You can not unsubscribe from a channel you are the creator of');
              return;
            }
          }
        }
      }
    }  
  } else {
    for(let i=0; i<allchannels.length; i++){
      if(allchannels[i].name==newnamechannel){
        allchannels[i].list_users.push({
          nickname:actualuser.nickname,
          photoprofile:actualuser.photoprofile,
          photoprofileX:0,
          photoprofileY:0,
          type:'User',
          blocked:false
        });
        for(let j=0; j<allchannels[i].list_mess.length; j++){
          if(allchannels[i].list_mess[j].type=='Welcome'){
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
            addNewSqueal({sender:allchannels[i].creator, typesender:"channels", body:{text:allchannels[i].list_mess[j].body.text, link:allchannels[i].list_mess[j].body.link, photo:allchannels[i].list_mess[j].body.photo, position:allchannels[i].list_mess[j].body.position, video:allchannels[i].list_mess[j].body.video}, date:date, hour:hour, seconds:seconds, photoprofile:allchannels[i].photoprofile, pos_reactions:0, neg_reactions:0, usersReactions:[], usersViewed:[], answers:[], category:null, receivers:["@"+actualuser.nickname], channel:allchannels[i].name, impressions:0});
          }
        }
      }
    }
    for(let i=0; i<allCHANNELS.length; i++){
      if(allCHANNELS[i].name==newnamechannel){
            allCHANNELS[i].list_users.push({
              nickname:actualuser.nickname, 
              photoprofile:actualuser.photoprofile, 
              photoprofileX:actualuser.photoprofileX, 
              photoprofileY:actualuser.photoprofileY, 
              type:'User', 
              blocked:false
            });
            for(let j=0; j<allCHANNELS[i].list_mess.length; j++){
              if(allCHANNELS[i].list_mess[j].type=='Welcome'){
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
                addNewSqueal({sender:allCHANNELS[i].creator, typesender:"CHANNELS", body:{text:allCHANNELS[i].list_mess[j].body.text, link:allCHANNELS[i].list_mess[j].body.link, photo:allCHANNELS[i].list_mess[j].body.photo, position:allCHANNELS[i].list_mess[j].body.position, video:allCHANNELS[i].list_mess[j].body.video}, date:date, hour:hour, seconds:seconds, photoprofile:allCHANNELS[i].photoprofile, pos_reactions:0, neg_reactions:0, usersReactions:[], usersViewed:[], answers:[], category:null, receivers:["@"+actualuser.nickname], channel:allCHANNELS[i].name, impressions:0});
              }
            }
      }
    }
  }
  setallCHANNELS(allCHANNELS);
  setallchannels(allchannels);
  setInChannel(!inChannel);
  let ListChannels = [...allchannels, ...allCHANNELS, ...allkeywords];
  let ind = ListChannels.findIndex(item => item.name === newnamechannel);
  await updateAllChannels(ListChannels, ind);
}

const subscribekeyword = async () => {
  if(inKeyword){
    for(let i=0; i<allkeywords.length; i++){
      if(allkeywords[i].name==newNameKeyword){
        for(let j=0;j<allkeywords[i].list_users.length;j++){
          if(allkeywords[i].list_users[j].nickname==actualuser.nickname){
              allkeywords[i].list_users.splice(j,1);
            }
          }
        }
      }
  } else {
    for(let i=0; i<allkeywords.length; i++){
      if(allkeywords[i].name==newNameKeyword){
            allkeywords[i].list_users.push({
              nickname:actualuser.nickname, 
              photoprofile:actualuser.photoprofile, 
              photoprofileX:actualuser.photoprofileX, 
              photoprofileY:actualuser.photoprofileY, 
              type:'User', 
              block:false
            });
      }
    }
  }
  setallkeywords(allkeywords);
  setInKeyword(!inKeyword);
  let ListChannels = [...allchannels, ...allCHANNELS, ...allkeywords];
  let ind = ListChannels.findIndex(item => item.name === newNameKeyword);
  await updateAllChannels(ListChannels, ind);
}

const toggleSilenceChannel = async () => {
  if(!silenceChannel){
    for(let i=0; i<allchannels.length; i++){
      if(allchannels[i].name==newnamechannel){
        allchannels[i].usersSilenced.push(actualuser.nickname);
      }
    }
    for(let i=0; i<allCHANNELS.length; i++){
      if(allCHANNELS[i].name==newnamechannel){
            allCHANNELS[i].usersSilenced.push(actualuser.nickname);
      }
    }
  } else {
    for(let i=0; i<allchannels.length; i++){
      if(allchannels[i].name==newnamechannel){
        let newArr = [...allchannels[i].usersSilenced];
        allchannels[i].usersSilenced = [];
        for(let j=0; j<newArr.length;j++){
          if (newArr[j]!=actualuser.nickname){
            allchannels[i].usersSilenced.push(newArr[j]);
          }
        }
      }
    }
    for(let i=0; i<allCHANNELS.length; i++){
      if(allCHANNELS[i].name==newnamechannel){
        let newArr = [...allCHANNELS[i].usersSilenced];
        allCHANNELS[i].usersSilenced = [];
        for(let j=0; j<newArr.length;j++){
          if (newArr[j]!=actualuser.nickname){
            allCHANNELS[i].usersSilenced.push(newArr[j]);
          }
        }
      }
    }
  }
  setallCHANNELS(allCHANNELS);
  setallchannels(allchannels);
  let ListChannels = [...allchannels, ...allCHANNELS, ...allkeywords];
  let ind = ListChannels.findIndex(item => item.name === newnamechannel);
  await updateAllChannels(ListChannels, ind);
  setSilenceChannel(!silenceChannel);
}

    return (
      <>
            <Container style={{ width: windowSize>=1024 ? '80%': windowSize>=600 ? '90%' : '100%', left:windowSize>=1024 ? '20%': windowSize>=600 ? '10%' : '0', height: windowSize>=600 ? '100vh' : '90%', position:'absolute', alignItems: 'center', overflowY:'scroll'}} className={`${viewsearch ? "mx-auto d-flex flex-column" : "d-none"}`}>
            <Form className="d-flex flex-column" style={{position:'absolute', top:'5%'}}>
                <InputGroup style={{ width:windowSize>= 600 ? '500px' : '300px'}} className="d-flex flex-column">
                    <FormControl type="text" placeholder={inputSearch} value={clientinputSearch} variant="outline-success" className="formcontroll-inputSearch"
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
                      onBlur={handleBlur}
                      onChange={writeinputSearch}
                    />
                      <Button id="dropdown-button-dark-example1" variant="secondary" style={{ boxShadow: 'none', borderRadius: '14px', width: windowSize>=600 ? '150px' : '100px', backgroundColor: '#cd9933', color: 'white', position: 'absolute', left:windowSize>=600 ? '351px' : '201px', cursor:'pointer'}} onClick={toggleDropdown}>Filter<CaretDownFill size='12' style={{marginLeft:'10px'}}></CaretDownFill></Button>
                      <div className='d-flex' width='500px'>
                        <ul style={{ boxShadow: 'none', borderRadius: '14px', width: windowSize>=600 ? '150px' : '100px', height: '130px', marginLeft:windowSize>600 ? '350px' : '201px', backgroundColor: '#cd9933', color: 'white', position:'relative', padding:'0', paddingTop:'12px', textAlign:'center'}} className={`${isDropdownOpen ? '' : 'd-none'}`}>
                          {/* Contenuto della tendina */}
                          <li
                              onClick={() => handleItemClick('Users')}
                              className={`${selectedItems.includes('Users') ? 'active' : ''}`}
                              style={{listStyle:'none',cursor:'pointer',color:'white',marginBottom:'3px'}}
                            >Users</li>
                            <li
                              onClick={() => handleItemClick('channels')}
                              className={`${selectedItems.includes('channels') ? 'active' : ''}`}
                              style={{listStyle:'none',cursor:'pointer',color:'white',marginBottom:'3px'}}
                            >channels</li>
                            <li
                              onClick={() => handleItemClick('CHANNELS')}
                              className={`${selectedItems.includes('CHANNELS') ? 'active' : ''}`}
                              style={{listStyle:'none',cursor:'pointer',color:'white',marginBottom:'3px'}}
                            >CHANNELS</li>
                            <li
                              onClick={() => handleItemClick('keywords')}
                              className={`${selectedItems.includes('keywords') ? 'active' : ''}`}
                              style={{listStyle:'none',cursor:'pointer',color:'white',marginBottom:'3px'}}
                            >keywords</li>
                        </ul>
                      </div>
                </InputGroup>
              </Form>
              {allprint.length > 0 && (
                        <div className="suggested-print-container">
                          <ul style={{paddingLeft:'0', marginTop:'60px', color: 'black'}}>
                            {allprint.map((profile, index) => (
                              <li key={index} className='mb-3' onClick={() => handleItemSelect(profile)} style={{listStyle:'none',textAlign:'center',cursor:'pointer', width:'300px', borderRadius:'12px', paddingTop:'0.6em', paddingBottom:'0.6em'}}>
                                {profile}
                              </li>
                            ))}
                          </ul>
                        </div>
                        )} 
              </Container>
              <Container style={{ width: windowSize>=1024 ? '80%': windowSize>=600 ? '90%' : '100%', left:windowSize>=1024 ? '20%': windowSize>=600 ? '10%' : '0', height: windowSize>=600 ? '100vh' : '90%', position:'absolute', alignItems: 'center', overflow:'hidden'}} className={`${viewprofile ? '"d-flex flex-column"' : 'd-none'}`}>
                <header className='d-flex flex-column text-center' style={{width:'100%', alignItems:'center'}}>
                  <Button style={{position:'absolute', top:'10px', left:'10px', backgroundColor: '#cd9933', border: 'none'}} onClick={closeviewprofile}>Back</Button>
                    { actualprofile.photoprofile!='' ? (<div className='mt-4' style={{width:'70px',height:'70px', display:'flex', alignItems:'center', borderRadius:'50%', border:'2px solid black', overflow:'hidden'}}>
                    <Image src={actualprofile.photoprofile} style={{height:'100%', position:'relative', marginTop: actualprofile.photoprofileY, marginLeft: actualprofile.photoprofileX}}></Image>
                    </div>)
                    : <PersonCircle size='70' color='black' className='mt-4'></PersonCircle>
                    }
                    <h4 className="mt-3">{actualprofile.nickname}</h4>
                    <Row className='mt-3' style={{width:'100%', justifyContent:'space-between'}}>
                        <p className='text' style={{width:'50%', padding:'0'}}>{allSquealsprint.length} post published</p>
                        <p className='text' style={{width:'50%', padding:'0'}}>{allChannelsprint.length} channels of which {n_channeladmin} admin</p>
                    </Row>
                    <textarea spellCheck='false' readOnly className='textareaprofile' value={actualprofile.bio} style={{borderRadius: '14px', resize:'none', backgroundColor: 'white', color: 'black', width: '100%', outline:'none', boxShadow:'none', borderColor:'black', textAlign:'center', padding:'0.5em', height:'50px'}}></textarea>
                </header>
                <hr style={{width:'100%', color:'black', height:'2px', marginBottom:'0'}}></hr>
                <Row  style={{width:'100%', justifyContent:'center'}}>
                    <Button className={`${mypostsactive ? 'active' : ''}`} style={{width:'95px', height:'40px', color:'black', background:'transparent', border:'0', borderRadius:'0px'}} onClick={profilepostsactive}>Posts</Button>
                    <Button className={`${mychannelsactive ? 'active' : ''}`} style={{width:'95px', height:'40px', color:'black', background:'transparent', border:'0', borderRadius:'0px'}} onClick={profilechannelsactive}>Channels</Button>
                </Row>
                <Container className="text-center mt-5" style={{overflowY:'scroll', height:'400px'}}>
                    <Row className={`${mypostsactive ? windowSize>=800 ? 'row-cols-2' : 'column' : 'd-none'}`} >
                    {allSquealsprint.map((squeal,index) => (
                    <Col key={index} className='mt-3'>
                        <Card style={{color:'black', borderColor:'black', minWidth:'280px', minHeight:'200px', marginBottom: index===(allSquealsprint.length-1) ? '150px' : '5%'}}>
                            <Card.Header className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap'}}>
                                <CardGroup style={{display:'flex', maxWidth:'280px', overflow:'hidden'}}>
                                { actualprofile.photoprofile!='' ? (<div className='me-3' style={{minWidth:'30px', width:'30px',height:'30px', borderRadius:'50%', border:'2px solid black', display:'flex', alignItems:'center', overflow:'hidden'}}>
                                <Image src={actualprofile.photoprofile} style={{width:'100%', height:'100%', position:'relative', marginTop: actualprofile.photoprofileY/2.5, marginLeft: actualprofile.photoprofileX/2.5}}></Image>
                                </div>)
                                : <PersonCircle size='30' color='black' className='me-3'></PersonCircle>
                                }
                                {squeal.sender}
                                </CardGroup>
                                <Card.Text>{squeal.date+" "+squeal.hour}</Card.Text>
                            </Card.Header>
                            <Card.Body>
                            <Card.Text style={{textAlign:'left'}}>
                                        {squeal.body.text}
                                    </Card.Text>
                                    {squeal.body.photo!='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' && (
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
                                    <Card style={{ width: '70%', height: '200px', position: 'relative', marginTop:'20px', marginBottom:'20px' }}>
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
                            <Card.Footer className='d-flex' style={{justifyContent:'end'}}>
                            <div className='d-flex'>
                                <Card.Text className='me-1' style={{cursor:'default'}}>
                                {squeal.pos_reactions}
                                </Card.Text>
                                <Image src={'/squealer-app'+pos_reaction1} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                <Image src={'/squealer-app'+pos_reaction2} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                <Image src={'/squealer-app'+pos_reaction3} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                <Card.Text style={{marginLeft:'17px', cursor:'default'}} className='me-1'>
                                {squeal.neg_reactions}
                                </Card.Text>
                                <Image src={'/squealer-app'+neg_reaction1} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                <Image src={'/squealer-app'+neg_reaction2} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                <Image src={'/squealer-app'+neg_reaction3} style={{marginRight:'1px'}} width='25' height='25'></Image>
                            </div>
                            </Card.Footer>
                        </Card>
                      </Col>
                      ))}
                    </Row>
                    <Row className={`${mychannelsactive ? windowSize>800 ? 'row-cols-2' : 'col' : 'd-none'}`} >
                    {allChannelsprint.map((channel,index) => (
                        <Row key={index} className='d-flex' style={{justifyContent:'center',alignItems:'center', color: 'black', cursor:'pointer', borderRadius:'12px', padding:'5px', marginBottom:index===(allChannelsprint.length-1) ? '150px' : '5%'}}>
                            <div style={{width:'80px',height:'80px', display:'flex', alignItems:'center', borderRadius:'50%', border:'2px solid white', overflow:'hidden',  borderColor: 'black', color: "black"}}>
                            { channel.photoprofile!='' ? 
                            (<Image src={channel.photoprofile} style={{width:'100%', height:'100%', marginTop:channel.photoprofileY, marginLeft:channel.photoprofileX, borderColor: 'black'}}></Image>)
                            : (<Image src={'/squealer-app'+channel_profile} style={{width:'100%', filter:'invert(1)', color: 'black', borderColor: 'black'}}></Image>)}
                            </div>
                            <h4 style={{color:'black',width:'60%',textAlign:'left',marginLeft:'10px'}}>{channel.name}</h4>
                        </Row>
                    ))}
                    </Row>
                </Container>
              </Container>

              <Container className={viewchannel ? '' : 'd-none'} style={{position:'absolute',width:windowSize>=1024 ? '80%': windowSize>=600 ? '90%' : '100%', left:windowSize>=1024 ? '20%': windowSize>=600 ? '10%' : '0', height:windowSize>=600 ? '100vh' : '90%', paddingTop:'10px',backgroundColor:'#eee', color: "black", overflow:'hidden'}}>
                <Button style={{position:'absolute', top:'10px', left:'10px', backgroundColor: '#cd9933', border: 'none'}} onClick={closeviewchannel}>Back</Button>
                <Button style={{position:'absolute', top:'10px', right:'10px', backgroundColor: '#cd9933', border: 'none'}} onClick={subscribechannel}>{inChannel ? "Unsubscribe" : "Subscribe"}</Button>
                <Col style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%', height:'100%'}}>
                    <Col style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <div style={{width:'80px',height:'80px', display:'flex', alignItems:'center', borderRadius:'50%', border:'2px solid black', overflow:'hidden'}}>
                        { newphotochannel!='' ? 
                        (<Image src={newphotochannel} style={{width:'100%', height:'100%', marginTop:positionchannel.y, marginLeft:positionchannel.x}}></Image>)
                        : (<Image src={'/squealer-app'+channel_profile} style={{width:'100%', filter:'invert(1)'}}></Image>)}
                    </div>
                    </Col>
                    <Container style={{ maxWidth: '800px', alignItems:'center'}} className="d-flex flex-column mt-3">
                        <Row className='d-flex flex-row' style={{width:'100%', justifyContent:'center'}}>
                            <p className='mb-3' style={{borderRadius: '14px', backgroundColor: 'transparent', color: 'black', width: '50%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em'}}>{newnamechannel}</p>
                            {inChannel && newsilenceablechannel && (
                            <label className="switch" style={{width:'30%', padding:'0.5em'}}>
                                <p style={{color:'black', width:'50%'}}>Silence</p>
                                <input type="checkbox" style={{cursor:'pointer'}} checked={silenceChannel} onChange={toggleSilenceChannel}/>
                                <span className="slider"></span>
                            </label>
                            )}
                        </Row>
                        <textarea spellCheck='false' readOnly className='textareaprofile' value={newbiochannel} style={{borderRadius: '14px', resize:'none', backgroundColor: 'white', color: 'black', width: '100%', outline:'none', boxShadow:'none', borderColor:'black', textAlign:'center', padding:'0.5em', height:'50px'}}></textarea>
                    </Container>
                    <hr style={{width:'100%', color:'black', height:'2px', marginBottom:'0'}}/>
                    <Row  style={{width:'100%', justifyContent:'center'}}>
                        <Button className={`${channelpostsactive ? 'active' : ''}`} style={{width:'95px', height:'40px', color:'black', background:'transparent', border:'0', borderRadius:'0px'}} onClick={sectionchannelpostsactive}>Posts</Button>
                        <Button className={`${channelusersactive ? 'active' : ''}`} style={{width:'95px', height:'40px', color:'black', background:'transparent', border:'0', borderRadius:'0px'}} onClick={sectionchannelusersactive}>Users</Button>
                        <Button className={`${channelmessagesactive ? 'active' : ''}`} style={{width:'95px', height:'40px', color:'black', background:'transparent', border:'0', borderRadius:'0px'}} onClick={sectionchannelmessagesactive}>Messages</Button>
                    </Row>
                    <Container className="text-center mt-3"  style={{overflowY:'scroll', height:'100vh'}}>
                        <Row className={`${channelpostsactive ? windowSize>= 800 ? 'row-cols-2' : 'col' : 'd-none'}`}>
                        {newchannelposts.map((squeal,index) => (
                        <Col key={index}>
                            <Card style={{color:'black', borderColor:'black', minWidth:'280px', minHeight:'200px', marginBottom:index===(newchannelposts.length-1) ? '150px' : '5%'}}>
                                <Card.Header className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap'}}>
                                    <CardGroup style={{display:'flex', maxWidth:'280px', overflow:'hidden'}}>
                                    { squeal.photoprofile!='' ? (<div className='me-3' style={{width:'30px', minWidth:'30px',height:'30px', borderRadius:'50%', border:'2px solid black', display:'flex', alignItems:'center', overflow:'hidden'}}>
                                    <Image src={squeal.photoprofile} style={{width:'100%', height:'100%', position:'relative', marginTop: squeal.photoprofileY/2.5, marginLeft: squeal.photoprofileX/2.5}}></Image>
                                    </div>)
                                    : <PersonCircle size='30' color='black' className='me-3'></PersonCircle>
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
                                    <Card style={{ width: '70%', height: '200px', position: 'relative', marginTop:'20px', marginBottom:'20px' }}>
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
                                <Card.Footer className='d-flex' style={{justifyContent:'end'}}>
                                  <div className='d-flex'>
                                      <Card.Text className='me-1' style={{cursor:'default'}}>
                                      {squeal.pos_reactions}
                                      </Card.Text>
                                      <Image src={'/squealer-app'+pos_reaction1} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                      <Image src={'/squealer-app'+pos_reaction2} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                      <Image src={'/squealer-app'+pos_reaction3} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                      <Card.Text style={{marginLeft:'17px', cursor:'default'}} className='me-1'>
                                      {squeal.neg_reactions}
                                      </Card.Text>
                                      <Image src={'/squealer-app'+neg_reaction1} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                      <Image src={'/squealer-app'+neg_reaction2} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                      <Image src={'/squealer-app'+neg_reaction3} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                  </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                                ))}
                        </Row>
                        <Row className={`${channelmessagesactive ? windowSize>= 800 ? 'row-cols-2 d-flex' : 'col' : 'd-none'}`}>
                        {newchannelmessages.map((squeal,index) => (
                        <Col key={index}>
                            <Card style={{color:'black', borderColor:'black', minWidth:'280px', minHeight:'200px', marginBottom:index===(newchannelmessages.length-1) ? '150px' : '5%'}}>
                                <Card.Header className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap'}}>
                                    <CardGroup style={{display:'flex', maxWidth:'280px', overflow:'hidden'}}>
                                    {squeal.type} {squeal.request!="" && (" "+squeal.request)} {squeal.repetition!="" && (" "+squeal.repetition)}
                                    </CardGroup>
                                    <Card.Text>{squeal.hour}</Card.Text>
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
                                    <Card style={{ width: '70%', height: '200px', position: 'relative', marginTop:'20px', marginBottom:'20px' }}>
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
                        </Col>
                        ))}
                        </Row>
                        <Col style={{width:'80%',marginLeft:'10%'}} className={`${channelusersactive ? 'row-cols-2' : 'd-none'}`} >
                        {newchannelusers.map((channeluser,index2) => (
                            <Row key={index2} className='mt-3 d-flex' style={{width:'70%',justifyContent:'center',alignItems:'center', borderRadius:'12px', padding:'5px', marginLeft:'15%'}}>
                                { channeluser.photoprofile!='' ? (<div className='me-3' style={{width:'30px',height:'30px', borderRadius:'50%', border:'2px solid black', display:'flex', alignItems:'center', overflow:'hidden', padding:'0'}}>
                                    <Image src={channeluser.photoprofile} style={{width:'100%', height:'100%', position:'relative', marginTop:channeluser.photoprofileY/2.5, marginLeft:channeluser.photoprofileX/2.5}}></Image>
                                    </div>)
                                    : <PersonCircle color='black' style={{width:'40px', height:'20px', padding:'0'}}></PersonCircle>
                                    }
                                <p style={{color:'black',width:'40%',textAlign:'left', paddingTop:'15px'}}>{channeluser.nickname}</p>
                                <Button style={{width:'120px', marginRight: '3%', cursor:'default', backgroundColor: '#cd9933', border: 'none'}}>{channeluser.type}</Button>
                                <Button style={{width:'120px', cursor:'default', backgroundColor: '#cd9933', border: 'none', marginTop: windowSize<508 ? '0.25rem' : ''}}>{`${channeluser.block ? 'Blocked' : 'Unblocked'}`}</Button>
                            </Row>
                        ))}
                        </Col>
                    </Container>
                </Col>
              </Container>

              <Container className={viewKeyword ? '' : 'd-none'} style={{position:'absolute',width:windowSize>=1024 ? '80%': windowSize>=600 ? '90%' : '100%', left:windowSize>=1024 ? '20%': windowSize>=600 ? '10%' : '0', height:windowSize>=600 ? '100vh' : '90%', paddingTop:'10px',backgroundColor:'#eee', color: 'black', overflow:'hidden'}}>
                <Button style={{position:'absolute', top:'10px', left:'10px', backgroundColor: '#cd9933', border: 'none'}} onClick={closeViewKeyword}>Back</Button>
                <Button style={{position:'absolute', top:'10px', right:'10px', backgroundColor: '#cd9933', border: 'none'}} onClick={subscribekeyword}>{inKeyword ? "Unsubscribe" : "Subscribe"}</Button>
                <Col style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%', height:'100%'}}>
                    <Col style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <div style={{width:'80px',height:'80px', display:'flex', alignItems:'center', borderRadius:'50%', border:'2px solid black', overflow:'hidden'}}>
                        { newPhotoKeyword!='' ? 
                        (<Image src={newPhotoKeyword} style={{width:'100%', height:'100%', marginTop:positionKeyword.y, marginLeft:positionKeyword.x}}></Image>)
                        : (<Image src={'/squealer-app'+channel_profile} style={{width:'100%', filter:'invert(1)'}}></Image>)}
                    </div>
                    </Col>
                    <Container style={{ maxWidth: '800px', alignItems:'center'}} className="d-flex flex-column mt-3">
                        <Row className='d-flex flex-row' style={{width:'100%', justifyContent:'center'}}>
                            <p className='mb-3' style={{borderRadius: '14px', backgroundColor: 'transparent', color: 'black', width: '50%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em'}}>{newNameKeyword}</p>
                        </Row>
                        <textarea spellCheck='false' readOnly className='textareaprofile' value={newBioKeyword} style={{borderRadius: '14px', resize:'none', backgroundColor: 'transparent', color: 'black', width: '100%', outline:'none', boxShadow:'none', borderColor:'transparent', textAlign:'center', padding:'0.5em', height:'50px'}}></textarea>
                    </Container>
                    <hr style={{width:'100%', color:'black', height:'2px', marginBottom:'0'}}/>
                    <Row  style={{width:'100%', justifyContent:'center'}}>
                        <Button className='active' style={{width:'150px', height:'40px', color:'black', background:'transparent', border:'0', borderRadius:'0px'}}>Posts</Button>
                    </Row>
                    <Container className="text-center mt-3"  style={{overflowY:'scroll', height:'100vh'}}>
                        <Row className={`${windowSize>= 800 ? 'row-cols-2' : 'col'}`}>
                        {newKeywordPosts.map((squeal,index) => (
                        <Col key={index}>
                            <Card style={{color:'black', borderColor:'black', minWidth:'280px', minHeight:'200px', marginBottom:index===(newKeywordPosts.length-1) ? '100px' : '5%'}}>
                                <Card.Header className='d-flex' style={{justifyContent:'space-between', fleWrap:'wrap'}}>
                                    <CardGroup>
                                    { squeal.photoprofile!='' ? (<div className='me-3' style={{minWidth:'30px', width:'30px',height:'30px', borderRadius:'50%', border:'2px solid black', display:'flex', alignItems:'center', overflow:'hidden'}}>
                                    <Image src={squeal.photoprofile} style={{width:'100%', height:'100%', position:'relative', marginTop: squeal.photoprofileY/2.5, marginLeft: squeal.photoprofileX/2.5}}></Image>
                                    </div>)
                                    : <PersonCircle size='30' color='black' className='me-3'></PersonCircle>
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
                                    <Card style={{ width: '70%', height: '200px', position: 'relative', marginTop:'20px', marginBottom:'20px' }}>
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
                                <Card.Footer className='d-flex' style={{justifyContent:'end'}}>
                                  <div className='d-flex'>
                                      <Card.Text className='me-1' style={{cursor:'default'}}>
                                      {squeal.pos_reactions}
                                      </Card.Text>
                                      <Image src={'/squealer-app'+pos_reaction1} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                      <Image src={'/squealer-app'+pos_reaction2} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                      <Image src={'/squealer-app'+pos_reaction3} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                      <Card.Text style={{marginLeft:'17px', cursor:'default'}} className='me-1'>
                                      {squeal.neg_reactions}
                                      </Card.Text>
                                      <Image src={'/squealer-app'+neg_reaction1} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                      <Image src={'/squealer-app'+neg_reaction2} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                      <Image src={'/squealer-app'+neg_reaction3} style={{marginRight:'1px'}} width='25' height='25'></Image>
                                  </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                                ))}
                        </Row>
                    </Container>
                </Col>
              </Container>
      </>    
    );
}

export default Search;