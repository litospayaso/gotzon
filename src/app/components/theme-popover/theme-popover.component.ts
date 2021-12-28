import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LessonsInterface } from '@app/interfaces/lessons.interface';

@Component({
  selector: 'app-theme-popover',
  templateUrl: './theme-popover.component.html',
  styleUrls: ['./theme-popover.component.scss'],
})
export class ThemePopoverComponent implements OnInit {

  @Input() theme: LessonsInterface;
  constructor(
    public popoverController: PopoverController
  ) { }

  ngOnInit() {}

  continue(route: string){
    this.popoverController.dismiss({route});
  }

}
