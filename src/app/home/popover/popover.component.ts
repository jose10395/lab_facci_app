import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/api/storage.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(private storage: StorageService) { }

  ngOnInit() { }

  logout() {
    this.storage.logout();
  }

}
