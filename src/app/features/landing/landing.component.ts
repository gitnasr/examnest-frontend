import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { HeroComponent } from "./hero/hero.component";

@Component({
  selector: 'app-landing',
  imports: [HeaderComponent, HeroComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
