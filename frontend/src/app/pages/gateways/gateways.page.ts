import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Gateway } from '../../models';
import { GatewayService } from '../../core/services';

@Component({
  selector: 'app-gateways',
  templateUrl: './gateways.page.html',
  standalone: false,
})
export class GatewaysPage {
  gateways: Gateway[] = [];
  loading = false;
  showForm = false;
  editing?: Gateway;
  form = { name: '', location: '' };

  selectedId?: number;
  constructor(private gatewayService: GatewayService, private router: Router, private route: ActivatedRoute, private alertController: AlertController) {}

  ionViewWillEnter() {
    this.selectedId = Number(this.route.snapshot.queryParamMap.get('selected')) || undefined;
    this.load();
  }

  load() {
    this.loading = true;
    this.gatewayService.getAll().subscribe({ next: (data: any) => { const all = data.gateways ?? data ?? []; this.gateways = this.selectedId ? all.filter((g: Gateway) => g.id === this.selectedId) : all; this.loading = false; }, error: () => this.loading = false });
  }

  openCreate() { this.editing = undefined; this.form = { name: '', location: '' }; this.showForm = true; }
  openEdit(gateway: Gateway) { this.editing = gateway; this.form = { name: gateway.name, location: gateway.location }; this.showForm = true; }
  save() {
    const request = this.editing
      ? this.gatewayService.update(this.editing.id, this.form)
      : this.gatewayService.create({ ...this.form, connectorsId: [], machinesId: [] });
    request.subscribe({ next: () => { this.showForm = false; this.load(); } });
  }
  async delete(gateway: Gateway) {
    const alert = await this.alertController.create({ header: 'Eliminar gateway', message: `Se eliminará «${gateway.name}» y todas sus entidades dependientes. Esta acción no se puede deshacer.`, buttons: [{ text: 'Cancelar', role: 'cancel' }, { text: 'Eliminar', role: 'destructive', handler: () => this.gatewayService.delete(gateway.id).subscribe(() => this.load()) }] });
    await alert.present();
  }
  goToConnectors(gateway: Gateway) { void this.router.navigate(['/connectors'], { queryParams: { gatewayId: gateway.id, gatewayName: gateway.name } }); }
  navigate(path: string) { void this.router.navigate([path]); }
}
