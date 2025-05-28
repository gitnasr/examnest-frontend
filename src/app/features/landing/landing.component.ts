import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { HeroComponent } from "./hero/hero.component";
import { WhyUsComponent } from "./why-us/why-us.component";

@Component({
  selector: 'app-landing',
  imports: [HeaderComponent, HeroComponent, WhyUsComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
