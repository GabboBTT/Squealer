import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import * as moment from 'moment';

Chart.register(...registerables);

const chartOptions = {
  responsive: true, // Se impostato su true, il grafico si adatterà al contenitore
  maintainAspectRatio: false, // Se impostato su false, consente di impostare una dimensione fissa
};

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css']
})
export class GraphicsComponent {
  userSqueals: any[] = []; // Array per archiviare i squeal dell'utente
  width = 400; // Larghezza in pixel
  height = 200; // Altezza in pixel
  postsChart: any;

  //Informazioni utente
  userDati = localStorage.getItem('Dati utente amministrato');
  datiUtente = this.userDati ? JSON.parse(this.userDati) : null;
  userId = this.datiUtente ? this.datiUtente._id : null;
  userNickname = this.datiUtente ? this.datiUtente.nickname : null;
  squealsWithAnswers: any;
  answers: any[] = [];

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    console.clear();
        this.getAllUserSqueals();
        this.processAnswersOverTime();
  }

  getAllUserSqueals() {
    this.databaseService.getAllSquealsByUser().subscribe(
      (squeals) => {
        this.userSqueals = (squeals as Array<any>).filter(s => s.sender === this.userNickname); // Archivia tutti i squeal dell'utente
        this.answers = this.userSqueals.flatMap(squeal => squeal.answers || []);
	if (this.userSqueals.length > 0) {
        this.processUserReactionsOverTime();
        this.processUserPostsOverTime();
        this.processAnswersOverTime();
	}
      },
      (error) => {
        console.error('Error during user squeal retrieval:', error);
      }
    );
  }

  processUserReactionsOverTime() {
    const reactionsOverTime = this.userSqueals.map(squeal => {
      const formattedDate = moment(squeal.date, 'DD/MM/YYYY').isValid() 
        ? moment(squeal.date, 'DD/MM/YYYY').toDate() 
        : undefined;
      
      return {
        date: formattedDate,
        posReactions: squeal.pos_reactions,
        negReactions: squeal.neg_reactions
      };
    });
  
    const validReactionsOverTime = reactionsOverTime.filter(r => r.date !== undefined);
  
    const filledReactionsOverTime = [validReactionsOverTime[0]]; // Inizia con il primo giorno

    // Aggiungi solo le date con reazioni o la prima/ultima di una serie di date senza reazioni
    for (let i = 1; i < validReactionsOverTime.length - 1; i++) { // Cicla da secondo elemento al penultimo
      const prev = validReactionsOverTime[i - 1];
      const curr = validReactionsOverTime[i];
      const next = validReactionsOverTime[i + 1];

      // Se ci sono reazioni o se siamo all'inizio o alla fine di una serie senza reazioni
      if (curr.posReactions + curr.negReactions > 0 ||
          (prev.posReactions + prev.negReactions > 0 && next.posReactions + next.negReactions === 0) ||
          (prev.posReactions + prev.negReactions === 0 && next.posReactions + next.negReactions > 0)) {
        filledReactionsOverTime.push(curr);
      }
    }

    filledReactionsOverTime.push(validReactionsOverTime[validReactionsOverTime.length - 1]);
    
    this.createChart(filledReactionsOverTime);
    this.createDifferenceChart(filledReactionsOverTime);
  }
  
  
  createChart(reactionsOverTime: any[]) {
    // Trova il valore massimo tra tutte le reazioni positive e negative
    const maxReactions = Math.max(...reactionsOverTime.map(r => Math.max(r.posReactions, r.negReactions)));
  
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    ctx.width = this.width;
    ctx.height = this.height;
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: reactionsOverTime.map(r => moment(r.date).format('YYYY-MM-DD')),
          datasets: [{
            label: 'Reazioni Totali',
            data: reactionsOverTime.map((r: { posReactions: number; negReactions: number; }) => r.posReactions + r.negReactions),
            borderColor: 'blue',
            borderWidth: 2
          }]
        },
        options: {
          responsive: false,
          scales: {
            y: {
              beginAtZero: true, // Fai iniziare l'asse Y da 0
              min: 0, // Imposta il minimo dell'asse Y a 0 per evitare valori negativi
              suggestedMax: maxReactions // Usa il valore massimo calcolato come prima
            },
            x: {
              type: 'time',
              time: {
                unit: 'day',
                tooltipFormat: 'LL',
                displayFormats: {
                  day: 'YYYY-MM-DD'
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: (tooltipItems) => {
                  return tooltipItems[0].label;
                },
                label: (context) => {
                  const reactionIndex = context.dataIndex;
                  const posReactions = reactionsOverTime[reactionIndex].posReactions;
                  const negReactions = reactionsOverTime[reactionIndex].negReactions;
                  return `Positive: ${posReactions}, Negative: ${negReactions}`;
                }
              }
            }
          }
        }  
      });
    } 
  }

  createDifferenceChart(reactionsOverTime: any[]) {
    const ctxDifference = document.getElementById('myChartDifference') as HTMLCanvasElement;
    ctxDifference.width = this.width;
    ctxDifference.height = this.height;
  
    if (ctxDifference) {
      const differenceChart = new Chart(ctxDifference, {
        type: 'line',
        data: {
          labels: reactionsOverTime.map(r => r.date),
          datasets: [{
            label: 'Differenza Reazioni Pos/Neg',
            data: reactionsOverTime.map(r => r.posReactions - r.negReactions),
            borderColor: 'red',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              // beginAtZero: true
            },
            x: {
              type: 'time',
              time: {
                unit: 'day',
                tooltipFormat: 'LL',
                displayFormats: {
                  day: 'YYYY-MM-DD'
                }
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 20
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: (tooltipItems) => {
                  return tooltipItems[0].label;
                },
                label: (context) => {
                  const reactionIndex = context.dataIndex;
                  const posReactions = reactionsOverTime[reactionIndex].posReactions;
                  const negReactions = reactionsOverTime[reactionIndex].negReactions;
                  return `Diff: ${posReactions - negReactions}`;
                }
              }
            }
          }
        }
      });
    }
  }
  
  processUserPostsOverTime() {
    const countsByDate: { [date: string]: number } = {};

    this.userSqueals.forEach(squeal => {
      // Converte la data dello squeal in un formato consistente
      const date = moment(squeal.date, 'DD/MM/YYYY').isValid() 
        ? moment(squeal.date, 'DD/MM/YYYY').format('YYYY-MM-DD') 
        : 'Invalid date'; // Usa un segnaposto come 'Invalid date' per le date non valide

      if (date !== 'Invalid date' && date in countsByDate) {
        countsByDate[date]++;
      } else if (date !== 'Invalid date') {
        countsByDate[date] = 1;
      }
    });

    // Creo l'array dei dati per il grafico
    const postsData = Object.keys(countsByDate).map(date => {
      return { date, count: countsByDate[date] };
    });

    const validPostsData = postsData.filter(post => moment(post.date, 'YYYY-MM-DD').isValid());
    // Ordina i dati per data
    validPostsData.sort((a, b) => moment(a.date).diff(moment(b.date)));
    // Crea il grafico con i dati
    this.createPostChart(validPostsData);
  }

  createPostChart(postsData: { date: string; count: number }[]): void {
    // Trova il valore massimo del conteggio per impostare l'intervallo dell'asse y
    const maxCount = Math.max(...postsData.map(post => post.count));
  
    const currentDate = moment().format('YYYY-MM-DD');
    // Verifica se la data corrente esiste nell'array postsData
    const currentDateIndex = postsData.findIndex(post => post.date === currentDate);

    // Se la data corrente non esiste, aggiungerla con un conteggio di 0
    if (currentDateIndex === -1) {
      postsData.push({ date: currentDate, count: 0 });
    }

    postsData.sort((a, b) => moment(a.date).diff(moment(b.date)));


    const ctx = document.getElementById('myChartPosts') as HTMLCanvasElement;
    ctx.width = this.width;
    ctx.height = this.height;
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: postsData.map(post => moment(post.date, 'YYYY-MM-DD').toDate()),
          datasets: [{
            label: 'Posts per day',
            data: postsData.map(post => post.count),
            borderColor: 'green',
            borderWidth: 2
          }]
        },
        options: {
          responsive: false,
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              suggestedMax: maxCount
            },
            x: {
              type: 'time',
              time: {
                unit: 'day',
                tooltipFormat: 'LL',
                displayFormats: {
                  day: 'YYYY-MM-DD'
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: (tooltipItems) => {
                  return tooltipItems[0].label;
                },
                label: (context) => {
                  const postIndex = context.dataIndex;
                  const count = postsData[postIndex].count;
                  return `Count: ${count}`;
                }
              }
            }
          }
        }
      });
    }
  }

  
  processAnswersOverTime() {
    const countsByDate: { [date: string]: number } = {};
  
    this.answers.forEach((answer: { date: string | Date; }) => {
      const answerDate = typeof answer.date === 'string' ? new Date(answer.date) : answer.date;
      const formattedDate = this.formatDate(answerDate);
      if (formattedDate) {
        countsByDate[formattedDate] = (countsByDate[formattedDate] || 0) + 1;
      }
    });
  
    const answersData = Object.entries(countsByDate).map(([date, count]) => ({ date, count }));
    answersData.sort((a, b) => moment(a.date).diff(moment(b.date)));
  
    this.createAnswersChart(answersData);
    console.log('answersData:', answersData);
  }

  createAnswersChart(answersData: any[]) {
    const ctx = document.getElementById('answersChart') as HTMLCanvasElement;
    console.log('ctx:', ctx); 
  
    if (ctx && answersData && answersData.length > 0) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: answersData.map((data: { date: any; }) => data.date),
          datasets: [{
            label: 'Number of Answers per Day',
            data: answersData.map((data: { count: any; }) => data.count),
            borderColor: 'purple',
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            },
            x: {
              type: 'time',
              time: {
                unit: 'day',
                tooltipFormat: 'LL',
                displayFormats: {
                  day: 'YYYY-MM-DD'
                }
              }
            }
          }
        }
      });
    }
  }
  
  formatDate(date: Date): string {
    return date ? moment(date).format('YYYY-MM-DD') : '';
  }
}
