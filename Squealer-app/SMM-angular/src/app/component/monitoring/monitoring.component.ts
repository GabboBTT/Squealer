import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit{

  //Informazioni utente
  userDati = localStorage.getItem('Dati utente amministrato');
  datiUtente = this.userDati ? JSON.parse(this.userDati) : null;
  userId = this.datiUtente ? this.datiUtente._id : null;
  userNickname = this.datiUtente ? this.datiUtente.nickname : null;

  //Dati sui Squeal
  squealsWithAnswers: any[] = [];
  mostReactedSqueals: any[] = [];
  lessReactedSqueals: any[] = [];
  controversialSqueals: any[] = [];
  mostPopularSqueals: any[] = [];
  inpopularSqueals: any[] = [];

  //Struttura per cambio squeal
  currentAnswerSquealIndex = 0;
  currentSquealIndex = 0;
  currentLessReactedSquealIndex = 0;
  currentControversialSquealIndex = 0;
  currentPopularSquealIndex = 0;
  currentInpopularSquealIndex = 0;

  currentLessReactedSqueal: any; 
  addressForLessReactedSqueal: string = ''; // Per memorizzare l'indirizzo ottenuto

  isLoading = true;
  isModalOpen = false;
  selectedSquealAnswers: any[] = [];

  photoBase = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  constructor(
    private route: ActivatedRoute, 
    private databaseService: DatabaseService, 
    private http: HttpClient,
  ) { }

  ngOnInit() {
    console.clear();
    //this.printUserSqueals(this.userId);
    console.log('Id utente:', this.userId);
    this.printUserSqueals();
    // this.loadSqueals();
  }

  ngAfterViewInit() { }
  

  printUserSqueals() {
    this.isLoading = true;
    this.databaseService.getAllSquealsByUser().subscribe(
      async (squeals) => {
        const userSqueals = (squeals as Array<any>).filter(s => s.sender === this.userNickname);

        for (const squeal of userSqueals) {
          squeal.date = this.formatDate(squeal.date);
          if (squeal.body.position && squeal.body.position.length === 2) {
            try {
              const [lat, lon] = squeal.body.position;
              if (!isNaN(lat) && !isNaN(lon)) { // Controlla se lat e lon sono numeri validi
                const address = await this.databaseService.getAddressGeolocation(lat, lon);
                squeal.body.address = address;
              }
            } catch (error) {
              console.error('Error in retrieving address:', error);
            }
          }
        }

        this.squealsWithAnswers = userSqueals.filter(squeal => squeal.answers && squeal.answers.length > 0);
	console.log('Squeals with answers:', this.squealsWithAnswers);        

        this.mostReactedSqueals = userSqueals
          .map(squeal => ({
            ...squeal,
            totalReactions: squeal.pos_reactions + squeal.neg_reactions
          }))
          .sort((a, b) => b.totalReactions - a.totalReactions)
          .slice(0, 3);
  
        this.lessReactedSqueals = userSqueals
          .map(squeal => ({
            ...squeal,
            totalReactions: squeal.pos_reactions + squeal.neg_reactions
          }))
          .sort((a, b) => a.totalReactions - b.totalReactions)
          .slice(0, 3);
  
        this.controversialSqueals = userSqueals
          .filter(squeal => {
            const criticalMass = 0.25 * squeal.impressions;
            //return squeal.pos_reactions > criticalMass && squeal.neg_reactions > criticalMass;       /*Caso in cui non siano etichettati*/
            return squeal.category === "controversial"
          })
          .slice(0, 3);
  
        this.mostPopularSqueals = userSqueals
          .filter(squeal => {
            const criticalMass = 0.25 * squeal.impressions;
            //return (squeal.pos_reactions > criticalMass)        /*Caso in cui non siano etichettati*/ 
            return squeal.category === "popular"
          })
          .sort((a, b) => {
            return b.pos_reactions - a.pos_reactions; 
          })
          .slice(0, 3);

        this.inpopularSqueals = userSqueals
          .filter(squeal => {
            const criticalMass = 0.25 * squeal.impressions;
            // return squeal.neg_reactions > criticalMass;      /*Caso in cui non siano etichettati*/       
            return squeal.category === "unpopular"          
          })
          .sort((a, b) => b.neg_reactions - a.neg_reactions)
          .slice(0, 3);
        this.isLoading = false;
        });
      (error: any) => {
        console.error('Error during Squeals recovery: ', error);
      }
  }

  // Funzione per verificare e convertire le date
  formatDate(dateString: string | number | Date) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  openAnswerModal(squealIndex: number) {
    this.selectedSquealAnswers = this.squealsWithAnswers[squealIndex].answers;
    console.log('Selected squeal answers:', this.selectedSquealAnswers);
    this.isModalOpen = true;
  }
  

  // Funzione per chiudere il modale
  closeAnswerModal() {
    this.isModalOpen = false;
  }

  showNextAnswerSqueal() {
    if (this.currentAnswerSquealIndex < this.squealsWithAnswers.length - 1) {
        this.currentAnswerSquealIndex++;
    }
  }

  showPreviousAnswerSqueal() {
    if (this.currentAnswerSquealIndex > 0) {
        this.currentAnswerSquealIndex--;
    }
  }

  showNextSqueal() {
    if (this.currentSquealIndex < this.mostReactedSqueals.length - 1) {
        this.currentSquealIndex++;
    }
  }

  showPreviousSqueal() {
      if (this.currentSquealIndex > 0) {
          this.currentSquealIndex--;
      }
  }

  showNextLessReactedSqueal() {
    if (this.currentLessReactedSquealIndex < this.lessReactedSqueals.length - 1) {
        this.currentLessReactedSquealIndex++;
    }
  }
  
  showPreviousLessReactedSqueal() {
    if (this.currentLessReactedSquealIndex > 0) {
        this.currentLessReactedSquealIndex--;
    }
  }

  showPreviousControversialSqueal() {
    if (this.currentControversialSquealIndex > 0) {
      this.currentControversialSquealIndex--;
    }
  }

  showNextControversialSqueal() {
    if (this.currentControversialSquealIndex < this.controversialSqueals.length - 1) {
      this.currentControversialSquealIndex++;
    }
  }

  showPreviousPopularSqueal() {
    if (this.currentPopularSquealIndex > 0) {
      this.currentPopularSquealIndex--;
    }
  }

  showNextPopularSqueal() {
    if (this.currentPopularSquealIndex < this.mostPopularSqueals.length - 1) {
      this.currentPopularSquealIndex++;
    }
  }

  showNextInpopularSqueal() {
    if (this.currentInpopularSquealIndex < this.inpopularSqueals.length - 1) {
      this.currentInpopularSquealIndex++;
    }
  }

  showPreviousInpopularSqueal() {
    if (this.currentInpopularSquealIndex > 0) {
      this.currentInpopularSquealIndex--;
    }
  }

}

