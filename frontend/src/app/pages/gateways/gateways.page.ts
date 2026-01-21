import { Gateway } from '../../models';
import { GatewayService } from '../../core/services';

export class GatewaysPage {
  gateways: Gateway[] = [];

  constructor(private gatewayService: GatewayService) {}

  ionViewWillEnter() {
    this.gatewayService.getAll().subscribe((data: Gateway[]) => {
      this.gateways = data;
    });
  }

  delete(id: number) {
    this.gatewayService.delete(id).subscribe(() => {
      this.gateways = this.gateways.filter((g) => g.id !== id);
    });
  }
}
