import React, { useState, useEffect} from 'react';
import { Container, Nav, InputGroup, FormControl, Button, Card, Row, Image} from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './App.css';
import search_logo from '../src/img/search.png'
import logo from './img/logo.png'
import {XCircle, List, PersonFillUp, Bag, Bell, PatchCheckFill, Clipboard2Pulse, Clipboard2Data } from 'react-bootstrap-icons';
import 'leaflet/dist/leaflet.css';
import {getUsers, getListChannels, getUserById, getListSqueals, getActualUser, updateUsers, updateUser, updateChannels, updateSqueals, addUser, addSqueal, addChannel} from './serverRequests.js';

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

function Settings() {
    const [actualuser, setactualuser] = useState({nickname:"", bio:'', photoprofile:'', photoprofileX:0, photoprofileY:0, fullname:'', email:'', password:'', version:"normal", managedAccounts:[], smm:'', blocked:false, char_d:400, char_w:2500, char_m: 9000, notifications:[true, true, true, true]})
    const [openBar, setOpenBar] = useState(true);
    const location = useLocation();
    const [isNotifications, setIsNotifications] = useState(true);
    const [isAccount, setIsAccount] = useState(false);
    const [isCharacters, setIsCharacters] = useState(false);
    const [isFindSMM, setIsFindSMM] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [showIcon, setShowIcon] = useState(true);
    const [allSqueals, setallSqueals] = useState([]);
    const [allPrint, setAllPrint] = useState([]);
    const [clientInputSearch, setClientInputSearch] = useState("");
    const [confirmBuyProfessional, setConfirmBuyProfessional] = useState(false);
    const [confirmBuyCharacters, setConfirmBuyCharacters] = useState(false);
    const [optionCharacters, setOptionCharacters] = useState(0);
    const windowSize = useWindowSize();
    const UrlSite = 'https://site222325.tw.cs.unibo.it';

    useEffect(() => {
        if (location.pathname.endsWith('/settings')) {
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
            getAll1();
            getAll2();
            getAll3();
        }
    },[location.pathname]);

    async function updateAllUsers(UsersToUpdate){
        try{
          let userUpdate = {}
            for(let i=0; i< UsersToUpdate.length; i++){
                if(UsersToUpdate[i].nickname === actualuser.nickname){
                    userUpdate = {char_d:UsersToUpdate[i].char_d, char_w:UsersToUpdate[i].char_w, char_m:UsersToUpdate[i].char_m, version:UsersToUpdate[i].version, notifications:UsersToUpdate[i].notifications};
                }
            }
            await updateUser(actualuser._id, userUpdate);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            throw error;
        }
    }

    async function addnewSqueal(squealToAdd){
        try{
          await addSqueal(squealToAdd);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            throw error;
        }
    }

    const openNotifications = () => {
        setIsNotifications(true);
        setIsAccount(false);
        setIsCharacters(false);
    };

    const openAccount = () => {
        setIsNotifications(false);
        setIsAccount(true);
        setIsCharacters(false);
    };

    const openCharacters = () => {
        setIsNotifications(false);
        setIsAccount(false);
        setIsCharacters(true);
    };

    const gotoDashboard = () => {
        if(actualuser.version=="SMM"){
            window.location.href = UrlSite+"/SMM";
        } else {
            window.location.href = UrlSite+"/moderator";
        }
    };

    const requestVerified = () => {
        let actualdate = new Date();
        let newdate = actualdate.getDate() +"/"+ (actualdate.getMonth()+1) +"/"+ actualdate.getFullYear();
        let newhour = actualdate.getHours() +"/"+ actualdate.getMinutes();
        let newseconds = actualdate.getSeconds();
        let newsqueal = {sender:actualuser.nickname, photoprofile: actualuser.photoprofile, photoprofileX:actualuser.photoprofileX, photoprofileY:actualuser.photoprofileY, typesender:'Users', channel:'Request verified', body:{text:'Request verified', position:[], photo:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", link:'', video:''}, date: newdate, hour: newhour, seconds: newseconds, pos_reactions:0, neg_reactions:0, usersReactions:[], usersViewed:[], answers:[], receivers:['@fvMod'], category:'', impressions:0}
        setallSqueals([...allSqueals, newsqueal]);
        addnewSqueal(newsqueal);
    };

    const requestSMM = () => {
        let actualdate = new Date();
        let newdate = actualdate.getDate() +"/"+ (actualdate.getMonth()+1) +"/"+ actualdate.getFullYear();
        let newhour = actualdate.getHours() +"/"+ actualdate.getMinutes();
        let newseconds = actualdate.getSeconds();
        let newsqueal = {sender:actualuser.nickname, photoprofile: actualuser.photoprofile, photoprofileX:actualuser.photoprofileX, photoprofileY:actualuser.photoprofileY, typesender:'Users', channel:'Request SMM', body:{text:'Request SMM', position:[], photo:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", link:'', video:''}, date: newdate, hour: newhour, seconds: newseconds, pos_reactions:0, neg_reactions:0, usersReactions:[], usersViewed:[], answers:[], receivers:['@fvMod'], category:'', impressions:0}
        setallSqueals([...allSqueals, newsqueal]);
        addnewSqueal(newsqueal);
    };

    const findSMM = () => {
        if(actualuser.version!='SMM'){
            setIsFindSMM(!isFindSMM);
            setClientInputSearch('');
            setAllPrint([]);
        } else {
            alert('You can\'t have a Social Media Manager if you\'re one of them');
        }
    };

    const buyProfessional = () => {
        setConfirmBuyProfessional(true);
    };

    const buyProfessionalConfirm = async (confirm) => {
        if(confirm){
            setactualuser({...actualuser, version:'professional'});
            const updatedUsers = allUsers.map((obj) => {
                if (obj.nickname === actualuser.nickname) {

                  return {
                    ...obj,
                    version: 'professional',
                  };
                }
                return obj;
              });
              alert("Your payment was successfull. You've now access to the professional actions");
              setAllUsers(updatedUsers);
              await updateAllUsers(updatedUsers);
        }
        setConfirmBuyProfessional(false);
    }

    const handleBlur = () => {
        setShowIcon(true);
    };

    const handleFocus = () => {
        setShowIcon(false);
    };

    const writeinputSearch = (event) => {
        setAllPrint([]);
        const value = event.target.value;
        setClientInputSearch(value);
        if(value!=""){
            for(let i=0;i<allUsers.length;i++){
                let user = ((allUsers[i].nickname).slice(0,value.length)).toLowerCase();
                    if((value.toLowerCase()==user)&&(allUsers[i].version=='social media manager')&&(!(allUsers[i].managedAccounts.includes(actualuser._id)))){
                        setAllPrint(prevallUsers => [...prevallUsers, allUsers[i].nickname]);
                    }
            }
        } else {
        setAllPrint([]);
    }
    };

    const handleItemSelect = async (item) => {
        setIsFindSMM(!isFindSMM);
        setClientInputSearch('');
        setAllPrint([]);
        const updatedUsers = allUsers.map((obj) => {
            if (obj.nickname === item) {
              return {
                ...obj,
                managedAccounts: [...obj.managedAccounts, actualuser._id],
              };
            }
            return obj;
          });
          setAllUsers(updatedUsers);
          let userUpdate = {}
          let idUpdate;
            for(let i=0; i< updatedUsers.length; i++){
                if(updatedUsers[i].nickname === item){
                    userUpdate = {managedAccounts:updatedUsers[i].managedAccounts};
                    idUpdate = updatedUsers[i]._id;
                }
            }
          await updateUser(idUpdate, userUpdate);
    }

    const changenotification = async (x) => {
        const newnotifications = [...actualuser.notifications];
        newnotifications[x] = !newnotifications[x];
        setactualuser({...actualuser, notifications:newnotifications});
        const updatedUsers = allUsers.map((obj) => {
            if (obj.nickname === actualuser.nickname) {
              return {
                ...obj,
                notifications: newnotifications,
              };
            }
            return obj;
          });
          setAllUsers(updatedUsers);
          await updateAllUsers(updatedUsers);
    }

    const morecharacter = (x) => {
        setConfirmBuyCharacters(true);
        setOptionCharacters(x);
    }

    const buyCharactersConfirm = async (confirm) => {
        if(confirm){
            if(optionCharacters==1){
                setactualuser({...actualuser, char_d:actualuser.char_d + 300, char_w: actualuser.char_w + 2000, char_m: actualuser.char_m + 7000});
                const updatedUsers = allUsers.map((obj) => {
                    if (obj.nickname === actualuser.nickname) {
                    return {
                        ...obj,
                        char_d:actualuser.char_d + 300, char_w: actualuser.char_w + 2000, char_m: actualuser.char_m + 7000
                    };
                    }
                    return obj;
                });
                alert("Your payment was successfull. You've now access to the professional actions");
                setAllUsers(updatedUsers);
                await updateAllUsers(updatedUsers);
            } else if(optionCharacters==2){
                setactualuser({...actualuser, char_d:actualuser.char_d + 700, char_w: actualuser.char_w + 4500, char_m: actualuser.char_m + 16000});
                const updatedUsers = allUsers.map((obj) => {
                    if (obj.nickname === actualuser.nickname) {
                        
                    return {
                        ...obj,
                        char_d:actualuser.char_d + 700, char_w: actualuser.char_w + 4500, char_m: actualuser.char_m + 16000
                    };
                    }
                    return obj;
                });
                alert("Your payment was successfull. You've now more characters to use this month");
                setAllUsers(updatedUsers);
                await updateAllUsers(updatedUsers);
            }
        }
        setConfirmBuyCharacters(false);
    }

    return (
        <>
            <div style={{backgroundColor: '#eee', color: "black", height: '100vh', display: 'flex', flexDirection: 'column'}} className={openBar ? '' : 'd-none'}>
                <Nav className="d-flex flex-column text" style={{backgroundColor: "white", color: "black", width: windowSize >= 1024 ? '20%' : windowSize >= 600 ? '10%' : '100%',position:'absolute', top:windowSize >= 600 ? '0' : '90%', height: windowSize >= 600 ? '100vh' : '10%', overflow:'hidden', zIndex:'1006', alignItems:'center'}}>
                    <div style={{ flex: '0.5' }}></div>

                    {windowSize >= 1024 && (<div className="text-center mb-3">
                    <Image src={logo} alt="Logo" roundedCircle width="80%" />
                    </div>)}

                    <div className={windowSize >= 600 ? 'd-flex flex-column' : 'd-flex flex-row'} style={{alignItems:'center', justifyContent:'space-around', flex: windowSize >= 1024 ? '0' : '1', width:'100%'}}>
                        <Nav.Item className='mb-2 d-flex' style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s', width: windowSize < 600 ? '100%' : '80%', position:'relative', justifyContent:'center'}}>
                            <Button onClick={openNotifications} style={{backgroundColor:'transparent', border:'0'}}><Bell alt="bell" size="25" className='mt-2' style={{color: "black"}}/></Button>
                            {windowSize >= 1024 && (<Button onClick={openNotifications} style={{backgroundColor:'transparent', border:'0', color: "black"}} className='nav-link'>Notifications</Button>)}
                        </Nav.Item>
                        <Nav.Item className={`${actualuser.version=='moderator' ? "d-none" : "mb-2 d-flex"}`} style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s', width: windowSize < 600 ? '100%' : '80%', position:'relative', justifyContent:'center'}}>
                            <Button onClick={openAccount} style={{backgroundColor:'transparent', border:'0'}}><PersonFillUp alt="bell" size="25" className='mt-2' style={{color: "black"}}/></Button>
                            {windowSize >= 1024 && (<Button onClick={openAccount} style={{backgroundColor:'transparent', border:'0', color: "black"}} className='nav-link'>Account</Button>)}
                        </Nav.Item>
                        <Nav.Item className='mb-2 d-flex' style={{borderRadius:'12px',cursor:'pointer',transition:'0.4s', width: windowSize < 600 ? '100%' : '80%', position:'relative', justifyContent:'center'}}>
                            <Button onClick={openCharacters} style={{backgroundColor:'transparent', border:'0'}}><Bag alt="bell" size="25" className='mt-2' style={{color: "black"}}/></Button>
                            {windowSize >= 1024 && (<Button onClick={openCharacters} style={{backgroundColor:'transparent', border:'0', color: "black"}} className='nav-link'>Characters</Button>)}
                        </Nav.Item>
                        {windowSize < 1024 && (actualuser.version==='moderator' || actualuser.version==='SMM') && (<Button onClick={gotoDashboard} style={{ display: 'flex', justifyContent: 'center', width:'80%', backgroundColor:'transparent', border:'0'}}>
                        {actualuser.version=='SMM' ? <Clipboard2Data alt="clipboard1" size="25" className='mt-2' style={{color: "black"}}></Clipboard2Data> : <Clipboard2Pulse alt="clipboard2" size="25" className='mt-2' style={{color: "black"}}></Clipboard2Pulse>}
                        </Button>)}
                    </div>
                    
                    <div style={{ flex: '0.2' }}></div>

                    {windowSize >= 1024 && (actualuser.version==='moderator' || actualuser.version==='SMM') && (<Button onClick={gotoDashboard} style={{ display: 'flex', justifyContent: 'center', width:'80%', color: "black"}}>
                    <Button>{actualuser.version=='SMM' ? 'SMM Dashboard' : 'Moderator Dashboard'}</Button>
                    </Button>)}
                    <div style={{ flex: '0.5' }}></div>

                </Nav>
            </div>
            <Container style={{ width: windowSize >=1024 ? '80%' : windowSize>=600 ? '90%' : '100%', left: windowSize >= 1024 ? '20%' : windowSize>=600 ? '10%' : '0', height: windowSize>= 600 ? '100vh' : '90%', position:'absolute', alignItems: 'center', overflowY:'scroll'}}>
                <XCircle style={{position:'absolute', left:'10px', top:'10px', width:'30px', height:'30px', cursor:'pointer'}} color='black' className={`${openBar ? "" : "d-none"}`} onClick={() => {setOpenBar(!openBar)}}></XCircle>
                <List style={{position:'absolute', left:'10px', top:'10px', width:'30px', height:'30px', cursor:'pointer'}} color='black' className={`${openBar ? "d-none" : ""}`} onClick={() => {setOpenBar(!openBar)}}></List>

                <Container className={isNotifications ? 'd-flex flex-column' : 'd-none'} style={{alignItems:'center'}}>
                    <h3 style={{textAlign:'center'}} className='m-3'>Decide when and how receiving notifications</h3>
                    <p style={{}} className='m-3 mb-5'>Select the push notifications that you want receive</p>
                    <label className="switch d-flex flex-row mb-3" style={{width:'300px', padding:'0.5em'}}>
                        <input type="checkbox" style={{cursor:'pointer'}} checked={actualuser.notifications[0]} onChange={() => changenotification(0)}/>
                        <span className="slider" style={{left:'0'}}></span>
                        <p style={{width:'80%', marginLeft:'70px'}}>My channels squeals</p>
                    </label>
                    <label className="switch d-flex flex-row mb-3" style={{width:'300px', padding:'0.5em'}}>
                        <input type="checkbox" style={{cursor:'pointer'}} checked={actualuser.notifications[1]} onChange={() => changenotification(1)}/>
                        <span className="slider" style={{left:'0'}}></span>
                        <p style={{width:'80%', marginLeft:'70px'}}>My CHANNELS squeal</p>
                    </label>
                    <label className="switch d-flex flex-row mb-3" style={{width:'300px', padding:'0.5em'}}>
                        <input type="checkbox" style={{cursor:'pointer'}} checked={actualuser.notifications[2]} onChange={() => changenotification(2)}/>
                        <span className="slider" style={{left:'0'}}></span>
                        <p style={{width:'80%', marginLeft:'70px'}}>For you squeals</p>
                    </label>
                    <label className="switch d-flex flex-row mb-3" style={{width:'300px', padding:'0.5em'}}>
                        <input type="checkbox" style={{cursor:'pointer'}} checked={actualuser.notifications[3]} onChange={() => changenotification(3)}/>
                        <span className="slider" style={{left:'0'}}></span>
                        <p style={{width:'80%', marginLeft:'70px'}}>Personal squeals</p>
                    </label>
                </Container>
                <Container className={isAccount ? 'd-flex flex-column' : 'd-none'} style={{alignItems:'center', overflowY:'scroll', height:'100%'}}>
                    <div className={actualuser.version=='normal' ? 'd-flex flex-column' : 'd-none'} style={{alignItems:'center', maxWidth:'80%'}}>
                        <h4 style={{}} className='m-3'>Request to be verified</h4>
                        <p style={{width:'70%', textAlign:'center'}} className='m-3'>You'll send a message to the Squealer moderators requesting to switch to a verified account. This will allow you to be more recognizable among users</p>
                        <Button className='m-3' onClick={requestVerified}>Request</Button>
                        <hr style={{width:'100%', height:'2px'}}></hr>
                    </div>
                    <div className={actualuser.version!='SMM' & actualuser.version=='professional' ? 'd-flex flex-column' : 'd-none'} style={{alignItems:'center', maxWidth:'80%'}}>
                        <h4 style={{}} className='m-3'>Request to be Social Media Manager</h4>
                        <p style={{width:'70%', textAlign:'center'}} className='m-3'>You'll send a message to the Squealer moderators requesting to switch to a Social Media Manager account. This will allow you to be the account manager for your professional clients. You'll also have your personal access to the SMM Dashboard with the your clients data</p>
                        <Button onClick={requestSMM} className='m-3'>Request</Button>
                        <hr style={{width:'100%', height:'2px'}}></hr>
                    </div>
                    <div className={actualuser.version=='professional' ? 'd-flex flex-column' : 'd-none'} style={{alignItems:'center', maxWidth:'80%'}}>
                        <h4 style={{}} className='m-3'>Find a Social Media Manager</h4>
                        <p style={{width:'70%', textAlign:'center'}} className='m-3'>You can decide a person that can manage and modify your account for you! You can remove this person from your account whenever you want</p>
                        <div className={isFindSMM ? 'd-flex flex-column' : 'd-none'} style={{alignItems:'center'}}>
                            <InputGroup style={{ width: '500px'}} className="d-flex flex-column">
                                <FormControl type="text" 
                                value={clientInputSearch}
                                placeholder='Search Social Media Manager'
                                variant="outline-success"
                                className="formcontroll-inputSearchlight"
                                style={{boxShadow: 'none', borderRadius: '14px', borderColor: 'black', backgroundColor: 'transparent',backgroundImage: showIcon ? `url(${search_logo})` : 'none', backgroundSize: '20px', backgroundRepeat: 'no-repeat', backgroundPosition: '10px center', paddingLeft: showIcon ? '40px' : '20px', paddingRight: '160px', color: 'black', width: '100%',}}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChange={writeinputSearch}
                                />
                            </InputGroup>
                            {allPrint.length > 0 && (
                                <div style={{marginTop:'9%', color:'black', fontSize:'large', overflowX:'hidden', overflowY:'scroll',}}>
                                <ul style={{paddingLeft:'0'}}>
                                    {allPrint.map((profile, index) => (
                                    <li key={index} className='mb-3 d-flex flex-row' style={{listStyle:'none',cursor:'pointer', width:'300px', borderRadius:'12px', paddingTop:'0.6em', paddingBottom:'0.6em', alignItems:'center'}}>
                                        <p style={{width:'70%', marginBottom:'0'}}>{profile}<PatchCheckFill className='ms-2' color='cornflowerblue'></PatchCheckFill></p>
                                        <Button className='ms-3' onClick={() => handleItemSelect(profile)}>Select</Button>
                                    </li>
                                    ))}
                                </ul>
                                </div>
                            )} 

                        </div>
                        <Button onClick={findSMM} className='m-3'>{isFindSMM ? 'Close' : 'Find'}</Button>
                        <hr style={{width:'100%', height:'2px'}}></hr>
                    </div>
                    <div className={actualuser.version=='normal' | actualuser.version=='verified' ? 'd-flex flex-column' : 'd-none'} style={{alignItems:'center', maxWidth:'80%'}}>
                        <h4 style={{}} className='m-3'>Buy a professional account</h4>
                        <p style={{width:'70%', textAlign:'center'}} className='m-3'>For 11.99$ a month, you can buy a professional account. With a professional account you can become a social media manager or decide on a social media manager who can manage your profile. Additionally, your account will be verified if it isn't already and you receive <b>300</b> more characters for day, <b>2000</b> more characters for week and <b>7000</b> more characters for month</p>
                        <Button onClick={buyProfessional} className='m-3'>Buy</Button>
                    </div>

                </Container>
                <Container className={isCharacters ? windowSize>= 1000 ? 'd-flex flex-row' : 'd-flex flex-column' : 'd-none'} style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center', marginTop:'30px'}}>
                    <Card style={{position: 'relative', width: '30%', minWidth:'260px', margin: '4%', height:'50%', background: 'linear-gradient(40deg,#539bdb,#8983f7 70%)', textAlign: 'center', justifyContent: 'center', alignItems: 'center', display:'flex', flexDirection: 'column', borderRadius: '12px'}}>
                        <Card.Body style={{flex:'0 1 auto'}}>
                            <h3 className='mb-4' style={{cursor:'default'}}>First option</h3>
                            <p style={{cursor:'default'}}>300 more characters for day</p>
                            <p style={{cursor:'default'}}>2000 more characters for week</p>
                            <p style={{cursor:'default'}}>7000 more characters for month</p>
                            <h5 style={{cursor:'default'}}>For 9.99$ a month</h5>
                            <Button className='mt-3' onClick={() => morecharacter(1)}>Go to payment</Button>
                        </Card.Body>
                    </Card>
                    <Card style={{position: 'relative', width: '30%', minWidth:'260px', margin: '4%', height: '50%', background: 'linear-gradient(40deg,#539bdb,#8983f7 70%)', textAlign: 'center',justifyContent: 'center', alignItems: 'center', display:'flex', flexDirection: 'column', borderRadius: '12px', flex:'0 1 auto'}}>
                        <Card.Body style={{flex:'0 1 auto'}}>
                            <h3 className='mb-4' style={{cursor:'default'}}>Second option</h3>
                            <p style={{cursor:'default'}}>700 more characters for day</p>
                            <p style={{cursor:'default'}}>4500 more characters for week</p>
                            <p style={{cursor:'default'}}>16000 more characters for month</p>
                            <h5 style={{cursor:'default'}}>For 19.99$ a month</h5>
                            <Button className='mt-3' onClick={() => morecharacter(2)}>Go to payment</Button>
                        </Card.Body>
                    </Card>
                </Container>
                <Container className={confirmBuyProfessional ? 'text-center' : 'd-none'} style={{position:'absolute', width:'100%', minHeight:'100vh', backgroundColor:'#eee', color: 'black', overflowY:'scroll', paddingTop:'10%', left:'0', top:'0'}}>
                    <h4 className='mb-3 mt-3'>Buy a professional account</h4>
                    <p>Are you sure you want to buy a professional account?</p>
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => buyProfessionalConfirm(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                        <Button onClick={() => buyProfessionalConfirm(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                    </Row>
                </Container>
                <Container className={confirmBuyCharacters ? 'text-center' : 'd-none'} style={{position:'absolute', width:'100%', minHeight:'100vh', backgroundColor:'#eee', color: 'black', overflowY:'scroll', paddingTop:'10%', left:'0', top:'0'}}>
                    <h4 className='mb-3 mt-3'>Buy Characters</h4>
                    <p>Are you sure you want to buy additional characters?</p>
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <Button onClick={() => buyCharactersConfirm(false)} style={{width:'20%'}} className='me-3 mt-3'>No</Button>
                        <Button onClick={() => buyCharactersConfirm(true)} style={{width:'20%'}} className='mt-3'>Yes</Button>
                    </Row>
                </Container>
            </Container>
        </>
    );
}

export default Settings;