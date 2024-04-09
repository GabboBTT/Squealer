const UrlSite = 'https://site222325.tw.cs.unibo.it';

export async function getUsers(){
    try {
        const response = await fetch(UrlSite+'/get-users');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

export async function addUser(userData) {
    try {
        const response = await fetch(UrlSite+'/add-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

export async function getUserById(id) {
    try {
        const response = await fetch(UrlSite+`/get-user/${id}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}

export async function getActualUser() {
    try {
        let actualUserId = JSON.parse(localStorage.getItem("actualUserId"));
        const response = await fetch(UrlSite+`/get-user/${actualUserId}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}  

export async function getListChannels() {
    try {
        const response = await fetch(UrlSite+'/get-listChannels');

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

export async function getListSqueals() {
    try {
        const response = await fetch(UrlSite+'/get-listSqueals');

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        return data.reverse();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

export async function updateUsers(updatedUsers) {
    try {
        const response = await fetch(UrlSite+'/update-users', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUsers)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}

export async function updateUser(id, updates) {
    try {
        const response = await fetch(UrlSite+`/update-user/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Utente non trovato o nessun aggiornamento necessario');
            }
            throw new Error('Errore di rete. Impossibile completare la richiesta.');
        }

        const data = await response.json();
        return data;  // Potrebbe contenere un messaggio di successo o altro a seconda della risposta del server
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'utente:', error);
        throw error;
    }
}

export async function deleteUsers(updatedUsers) {
    try {
        const response = await fetch(UrlSite+'/delete-users', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUsers)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}

export async function updateSqueals(updatedSqueals) {
    try {
        const response = await fetch(UrlSite+'/update-squeals', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedSqueals)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}

export async function updateSqueal(id, updates) {
    try {
        const response = await fetch(UrlSite+`/update-squeal/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Squeal non trovato o nessun aggiornamento necessario');
            }
            throw new Error('Errore di rete. Impossibile completare la richiesta.');
        }

        const data = await response.json();
        return data;  // Potrebbe contenere un messaggio di successo o altro a seconda della risposta del server
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dello squeal:', error);
        throw error;
    }
}

export async function updateChannels(updatedChannels) {
    try {
        const response = await fetch(UrlSite+'/update-channels', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedChannels)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}

export async function updateChannel(id, updates) {
    try {
        const response = await fetch(UrlSite+`/update-channel/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Canale non trovato o nessun aggiornamento necessario');
            } else if (response.status === 400) {
                throw new Error('Errore di rete. Impossibile completare la richiesta.');
            } else if (response.status === 500) {
                throw new Error('Errore di rete. Impossibile completare la richiesta.');
            }
            throw new Error('Errore di rete. Impossibile completare la richiesta.');
        }

        const data = await response.json();
        return data;  // Potrebbe contenere un messaggio di successo o altro a seconda della risposta del server
    } catch (error) {
        console.error('Errore durante l\'aggiornamento del canale:', error);
        throw error;
    }
}

export async function addSqueal(squealData) {
    try {
        const response = await fetch(UrlSite+'/add-squeal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(squealData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

export async function addChannel(channelData) {
    try {
        const response = await fetch(UrlSite+'/add-channel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(channelData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

export async function deleteSqueal(id) {
    try {
        const response = await fetch(UrlSite+`/delete-squeal/${id}`, {
            method: 'DELETE'
          });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}

export async function deleteChannel(id) {
    try {
        const response = await fetch(UrlSite+`/delete-channel/${id}`, {
            method: 'DELETE'
          });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}

export async function deleteUser(id) {
    try {
        const response = await fetch(UrlSite+`/delete-user/${id}`, {
            method: 'DELETE'
          });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}
