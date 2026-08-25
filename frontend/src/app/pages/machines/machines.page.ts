import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Connector, Gateway, Machine } from '../../models';
import { GatewayService, ResourceService } from '../../core/services';

@Component({ selector: 'app-machines', templateUrl: './machines.page.html', styleUrls: ['./machines.page.scss'], standalone: false })
export class MachinesPage {
  machines: Machine[] = []; connectors: Connector[] = []; gateways: Gateway[] = [];
  showForm = false; loading = false; editing?: Machine; filterConnectorId?: number;
  form = { name: '', description: '', serial: '', model: '', connectorId: null as number | null, gatewayId: null as number | null };

  constructor(private resources: ResourceService, private gatewayService: GatewayService, private route: ActivatedRoute, private router: Router, private alerts: AlertController) {}
  ionViewWillEnter() {
    this.filterConnectorId = Number(this.route.snapshot.queryParamMap.get('connectorId')) || undefined;
    this.load();
    this.resources.list<Connector>('connectors').subscribe(r => this.connectors = r.connectors ?? []);
    this.gatewayService.getAll().subscribe((r: any) => this.gateways = r.gateways ?? []);
  }
  load() { this.loading = true; this.resources.list<Machine>('machines').subscribe({ next: r => { const all = r.machines ?? []; this.machines = this.filterConnectorId ? all.filter((m: any) => (m.connector?.id ?? m.connectorId) === this.filterConnectorId) : all; this.loading = false; }, error: () => this.loading = false }); }
  openCreate() { this.editing = undefined; this.form = { name: '', description: '', serial: '', model: '', connectorId: this.filterConnectorId ?? null, gatewayId: null }; this.showForm = true; }
  openEdit(m: Machine) { this.editing = m; this.form = { name:m.name, description:m.description, serial:m.serial, model:m.model, connectorId:m.connector?.id ?? m.connectorId ?? null, gatewayId:m.gateway?.id ?? m.gatewayId ?? null }; this.showForm = true; }
  save() { if (!this.form.connectorId || !this.form.gatewayId) return; const payload = { ...this.form, connectorId: Number(this.form.connectorId), gatewayId: Number(this.form.gatewayId) }; const call = this.editing ? this.resources.update('machines', this.editing.id, payload) : this.resources.create('machines', payload); call.subscribe(() => { this.showForm = false; this.load(); }); }
  async delete(m: Machine) { const a = await this.alerts.create({ header:'Eliminar máquina', message:`Se eliminará «${m.name}» y sus alertas y reglas asociadas.`, buttons:[{text:'Cancelar',role:'cancel'},{text:'Eliminar',role:'destructive',handler:()=>this.resources.remove('machines',m.id).subscribe(()=>this.load())}] }); await a.present(); }
  alertsFor(m: Machine) { void this.router.navigate(['/alerts'], { queryParams: { machineId:m.id, machineName:m.name } }); }
  connector(m: Machine) { const id=m.connector?.id ?? m.connectorId; if(id) void this.router.navigate(['/connectors'], {queryParams:{connectorId:id}}); }
  gateway(m: Machine) { const id=m.gateway?.id ?? m.gatewayId; if(id) void this.router.navigate(['/gateways'], {queryParams:{selected:id}}); }
  nav(p:string) { void this.router.navigate([p]); }
}
