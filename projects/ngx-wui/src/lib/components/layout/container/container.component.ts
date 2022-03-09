import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'wui-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})

export class ContainerComponent implements OnInit {

  @Input() justify?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
