import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LessonsInterface } from '@app/interfaces/lessons.interface';
import { UserData } from '@app/interfaces/userdata.interface';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-theme-popover',
  templateUrl: './theme-popover.component.html',
  styleUrls: ['./theme-popover.component.scss'],
})
export class ThemePopoverComponent implements OnInit {

  @Input() theme: LessonsInterface;
  public userData = {} as UserData;

  constructor(
    public popoverController: PopoverController,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.userData = this.userService.getUserThemeData(Number(this.theme.id));
  }

  continue(route: string){
    this.popoverController.dismiss({route});
  }

}
