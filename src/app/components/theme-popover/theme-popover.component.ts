import { Component, Input, OnInit } from '@angular/core';
import { ThemeInterface } from '@app/interfaces/theme.interface';

@Component({
  selector: 'app-theme-popover',
  templateUrl: './theme-popover.component.html',
  styleUrls: ['./theme-popover.component.scss'],
})
export class ThemePopoverComponent implements OnInit {

  @Input() theme: ThemeInterface;
  constructor() { }

  ngOnInit() {}

}
