// settings.component.ts
import { Component, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  constructor(private databaseService: DatabaseService, private cdr: ChangeDetectorRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {}

  
}
