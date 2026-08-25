import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Gateway, Connector } from '../../models';
import { GatewayService, ResourceService } from '../../core/services';
@Component({ selector: 'app-connectors', templateUrl: './connectors.page.html', styleUrls: ['./connectors.page.scss'], standalone: false })
export class ConnectorsPage {
  connectors: Connector[] = []; gateways: Gateway[] = []; loading = false; showForm = false; editing?: Connector; filterGatewayId?: number; selectedId?: number;
  form = { name: '', portName: '', gatewayId: null as number | null };
  constructor(private resources: ResourceService, private gatewaysService: GatewayService, private route: ActivatedRoute, private router: Router, private alerts: AlertController) {}
  ionViewWillEnter() { this.filterGatewayId = Number(this.route.snapshot.queryParamMap.get('gatewayId')) || undefined; this.selectedId = Number(this.route.snapshot.queryParamMap.get('connectorId')) || undefined; this.load(); this.gatewaysService.getAll().subscribe((r: any) => this.gateways = r.gateways ?? []); }
  load() { this.loading = true; this.resources.list<Connector>('connectors').subscribe({ next: r => { const all = r.connectors ?? []; this.connectors = this.selectedId ? all.filter((c: Connector) => c.id === this.selectedId) : this.filterGatewayId ? all.filter((c: any) => (c.gateway?.id ?? c.gatewayId) === this.filterGatewayId) : all; this.loading = false; }, error: () => this.loading = false }); }
  openCreate() { this.editing = undefined; this.form = { name: '', portName: '', gatewayId: this.filterGatewayId ?? null }; this.showForm = true; }
  openEdit(c: Connector) { this.editing = c; this.form = { name: c.name, portName: c.portName, gatewayId: c.gateway?.id ?? c.gatewayId ?? null }; this.showForm = true; }
  save() { if (!this.form.gatewayId) return; const payload = { ...this.form, gatewayId: Number(this.form.gatewayId), machinesId: [] }; const call = this.editing ? this.resources.update('connectors', this.editing.id, payload) : this.resources.create('connectors', payload); call.subscribe(() => { this.showForm = false; this.load(); }); }
  async delete(c: Connector) { const a = await this.alerts.create({ header: 'Eliminar conector', message: `Se eliminará «${c.name}» y sus máquinas y alertas dependientes.`, buttons: [{ text: 'Cancelar', role: 'cancel' }, { text: 'Eliminar', role: 'destructive', handler: () => this.resources.remove('connectors', c.id).subscribe(() => this.load()) }] }); await a.present(); }
  machines(c: Connector) { void this.router.navigate(['/machines'], { queryParams: { connectorId: c.id, connectorName: c.name } }); }
  gateway(c: Connector) { const id = c.gateway?.id ?? c.gatewayId; if (id) void this.router.navigate(['/gateways'], { queryParams: { selected: id } }); }
  nav(p: string) { void this.router.navigate([p]); }
}
