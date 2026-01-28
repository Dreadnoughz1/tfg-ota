import { Gateway } from '../../models';
import { GatewayService } from '../../core/services';
import { Component } from '@angular/core';

@Component({
  selector: 'app-gateways',
  templateUrl: './gateways.page.html',
  standalone: false,
})
export class GatewaysPage {
  gateways: Gateway[] = [];

  constructor(private gatewayService: GatewayService) {}

  ionViewWillEnter() {
    console.log('Loading gateways...');
    this.gatewayService.getAll().subscribe((data: any[]) => {
      console.log('Gateways loaded');
      this.gateways = data;
    });
  }

  delete(id: number) {
    this.gatewayService.delete(id).subscribe(() => {
      this.gateways = this.gateways.filter((g) => g.id !== id);
    });
  }
}
