import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Input } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';
import { ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit{

  @ViewChild('selectPhotoDialog') selectPhotoDialogRef!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any, any>;


  @ViewChild('selectVIPDialog') selectVIPDialogRef!: TemplateRef<any>;
  dialogVIPRef!: MatDialogRef<any, any>;

  @ViewChild('selectDescriptionDialog') selectDescriptionDialogRef!: TemplateRef<any>;
  dialogDescriptionRef!: MatDialogRef<any, any>;

  @ViewChild('confirmationDialog') confirmationDialog!: TemplateRef<any>;
  dialogPaymentRef!: MatDialogRef<any, any>;


  /*Dati utente*/
  nickname: string | null = '';
  profilePictureUrl: string | null = '';
  charLeftUserDaily: number = 0;
  charLeftUserWeekly: number = 0;
  charLeftUserMonthly: number = 0;
  profileDescription: string = '';

  

  /*Dati per il cambio vip*/
  selectedVIP: any; 
  vipList: any[] = []; // Lista per tenere traccia degli utenti (VIP) gestiti


  /*Dati per il pagamento e aumento caratteri*/
  charLeftDaily: number = 0;  //Caratteri rimanenti in percentuale su 150
  charLeftWeekly: number = 0; //Caratteri rimanenti in percentuale su 1000
  charLeftMonthly: number = 0; //Caratteri rimanenti in percentuale su 3000
  charMaximunDaily: number = 500; //Caratteri massimi
  charMaximunWeekly: number = 4000; //Caratteri massimi
  charMaximunMonthly: number = 10000; //Caratteri massimi
  selectedAmount: string | number = '';
  otherAmount: number | null = null;
  selectedPaymentMethod: string = '';


  /*Dati utente loggato */
  user = localStorage.getItem('Dati manager');
  datiUtente = this.user ? JSON.parse(this.user) : null;
  userLogged = localStorage.getItem('Dati utente amministrato')
  userId = this.userLogged ? JSON.parse(this.userLogged) : null;


  tempPhotoProfile: any = ''


  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private databaseService: DatabaseService, 
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() { 
    // console.clear();
    this.laodUserData(); // Carica i dati utente 
    this.loadManagedUsers(); // Carica gli utenti gestiti (VIP)
    /*Test
    this.databaseService.getAllUsers().subscribe((data: any) => {
      console.log('Tutti gli utenti:', data);
    }, error => {
      console.error('Errore nel caricamento degli utenti:', error);
    }
    );
    */
    
  }

  laodUserData(): void {
    this.nickname = this.userId ? this.userId.nickname : '';
    this.profilePictureUrl = this.userId ? this.userId.photoprofile : '';
    this.charLeftUserDaily = this.userId ? this.userId.char_d : 0;
    this.charLeftDaily = (this.charLeftUserDaily * 100) / this.charMaximunDaily;
    this.charLeftUserWeekly = this.userId ? this.userId.char_w : 0;
    this.charLeftWeekly = (this.charLeftUserWeekly * 100) / this.charMaximunWeekly;
    this.charLeftUserMonthly = this.userId ? this.userId.char_m : 0;
    this.charLeftMonthly = (this.charLeftUserMonthly * 100) / this.charMaximunMonthly;
    this.profileDescription = this.userId ? this.userId.bio : '';
    //this.loadManagedUsers(); // Carica gli utenti gestiti (VIP)
  }

  /*Gestione cambio immagini*/
  openDialog(): void {
    this.dialogRef = this.dialog.open(this.selectPhotoDialogRef);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  updateProfilePicture(newImageUrl: any): void {
    this.profilePictureUrl = newImageUrl;
    const updateData = { photoprofile: newImageUrl };

    this.databaseService.updateUserProfile(this.userId._id, updateData)
      .subscribe(
        response => {
          // Aggiorna i dati dell'utente nel localStorage
	  this.userId.photoprofile = newImageUrl;
          this.databaseService.getUserData(this.userId._id).subscribe((data: any) => {
            localStorage.removeItem('Dati utente amministrato');  
            localStorage.setItem('Dati utente amministrato', JSON.stringify(data));
          }, error => {
            console.error('Error loading user data.:', error);
          });
          //window.location.reload();
	  this.laodUserData();
          this.closeDialog();
        },
        error => console.error('Error updating profile photo', error)
      );
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Crea un URL temporaneo per il file selezionato
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const dataUrl = e.target.result;
        this.tempPhotoProfile = dataUrl;
      }
      reader.readAsDataURL(file);
    }
  }


  /*Gestione cambio vip funzionante*/
  loadManagedUsers(): void {
    const managerData = JSON.parse(localStorage.getItem('Dati manager') || '{}');  
    const managedAccounts = managerData.managedAccounts || [];
  
    // Carica gli utenti gestiti nell'ordine specificato in managedAccounts
    for (const uid of managedAccounts) {
      this.databaseService.getUserData(uid).subscribe((user: any) => {
        this.vipList.push(user);
        // Verifica se la lunghezza della vipList è uguale a quella di managedAccounts
        // Se lo è, significa che hai caricato tutti gli utenti gestiti, quindi puoi fermare il caricamento e uscire dal loop
        if (this.vipList.length === managedAccounts.length) {
          return;
        }
      }, error => {
        console.error('Error loading user data:', error);
      });
    }
    localStorage.setItem('VIPList', 'true');
  }

  openVIPSelectModule(): void {
    this.dialogVIPRef = this.dialog.open(this.selectVIPDialogRef);
  }

  closeVIPDialog(): void {
    this.dialogVIPRef.close();
  }

  selectVIP(): void {
    if (this.selectedVIP !== null && this.selectedVIP !== undefined) {
      const selectedVIPIndex = this.selectedVIP;
      if (selectedVIPIndex >= 0 && selectedVIPIndex < this.vipList.length) {
        const selectedVIP = this.vipList[selectedVIPIndex];
        this.userId = selectedVIP._id;
        this.databaseService.getUserData(this.userId).subscribe((data: any) => {
          localStorage.removeItem('Dati utente amministrato');  
          console.log('Dati utente amministrato:', data);
          localStorage.setItem('Dati utente amministrato', JSON.stringify(data)); 
          this.laodUserData(); // Ricarica i dati dell'utente
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['edit-profile']);
        }, error => {
          console.error('Error loading user data.:', error);
        });
      } else {
        console.error('Selected VIP index out of range');
      }
    } else {
      console.error('No VIP selected');
    }
    this.closeVIPDialog();
  }

  /*Gestione cambio descrizion*/
  openDescriptionModule(): void {
    this.dialogDescriptionRef = this.dialog.open(this.selectDescriptionDialogRef, {
      width: '80%', 
      maxWidth: '500px', 
      panelClass: 'custom-dialog-margin'
    });
  }
  
  /*Problemi aggiornamento*/
  updateDescription(newDescription: string): void {
    const userData = JSON.parse(localStorage.getItem('Dati utente amministrato') || '{}');
    const userId = userData._id;
  
    if (userId) {
      this.databaseService.updateUserProfile(userId, { bio: newDescription })
        .subscribe(response => {
          // Aggiornamento dei dati dell'utente nel localStorage
          userData.bio = newDescription;
          localStorage.setItem('Dati utente amministrato', JSON.stringify(userData));
          this.profileDescription = newDescription; // Aggiorna la descrizione nel componente
          this.laodUserData(); // Ricarica i dati dell'utente
          // Forza il refresh della pagina
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate([this.router.url]);
        }, error => {
          console.error('Error in updating description:', error);
        });
    } else {
      console.error('User ID not found.');
    }
    this.closeDescriptionDialog(); // Chiudi il modale dopo il salvataggio
  } 
  
  closeDescriptionDialog(): void {
    this.dialogDescriptionRef.close();
  }

  /*Gestione cambio caratteri DA FARE*/
  openConfirmationModal(): void {
    if (this.selectedAmount) {
      this.dialogPaymentRef = this.dialog.open(this.confirmationDialog);
    } else {
      console.log('No import selected.');
    }
  }

  confirmSelection(): void {
    let amountValue = this.selectedAmount === 'other' ? this.otherAmount : this.selectedAmount;
    let amountNumber = typeof amountValue === 'string' ? parseInt(amountValue, 10) : amountValue || 0;

    const userData = JSON.parse(localStorage.getItem('Dati utente amministrato') || '{}');
    const userId = userData._id;
  
    // Assicurati che this.userId sia una stringa che rappresenta l'ID dell'utente
    if (typeof userId === 'string' && userId) {
      // Calcola i nuovi valori per charLeft
      const newCharLeftDaily = this.charLeftUserDaily + amountNumber;
      const newCharLeftWeekly = this.charLeftUserWeekly + amountNumber;
      const newCharLeftMonthly = this.charLeftUserMonthly + amountNumber;
  
      const updateData = {
        char_d: newCharLeftDaily,
        char_w: newCharLeftWeekly,
        char_m: newCharLeftMonthly
      };
  
      this.databaseService.updateUserProfile(userId, updateData)
        .subscribe({
          next: (response) => {
            console.log('Server response:', response);
  
            // Aggiorna i valori locali e nel localStorage
            this.charLeftUserDaily = newCharLeftDaily;
            this.charLeftUserWeekly = newCharLeftWeekly;
            this.charLeftUserMonthly = newCharLeftMonthly;
            
            // Aggiorna i valori percentuali
            this.charLeftDaily = (this.charLeftUserDaily * 100) / this.charMaximunDaily;
            this.charLeftWeekly = (this.charLeftUserWeekly * 100) / this.charMaximunWeekly;
            this.charLeftMonthly = (this.charLeftUserMonthly * 100) / this.charMaximunMonthly;
  
            // Aggiorna il localStorage
            const userData = JSON.parse(localStorage.getItem('Dati utente amministrato') || '{}');
            userData.char_d = newCharLeftDaily;
            userData.char_w = newCharLeftWeekly;
            userData.char_m = newCharLeftMonthly;
            localStorage.setItem('Dati utente amministrato', JSON.stringify(userData));
          },
          error: (error) => {
            console.error("Error while updating user data:", error);
          },
          complete: () => {
            // Chiudi il modale di conferma
            this.closeConfirmationDialog();
          }
        });
    } else {
      console.error('User ID invalid or not found.');
    }
  }
  
  closeConfirmationDialog(): void {
    this.dialogPaymentRef.close();
  }

  // Test only
  updateUserProfileSMM(): void {
    const body = {
      managedAccounts: ['65b79216d5997e7ede8b49ed', '65b79246d5997e7ede8b49ee', '65b79256d5997e7ede8b49ef', '65b7926dd5997e7ede8b49f0', '65b792abd5997e7ede8b49f1', '65b792d1d5997e7ede8b49f2']
    }

    this.databaseService.updateUserProfile('65b791fcd5997e7ede8b49ec', body).subscribe(response => {
      console.log('Risposta del server:', response);
    }, error => {
      console.error('Errore durante l\'aggiornamento dei dati utente:', error);
    });
  }

}
