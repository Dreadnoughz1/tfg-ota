import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Machine } from '../../models';
import { AuthService, ResourceService } from '../../core/services';

@Component({
  selector: 'app-alert-rules',
  templateUrl: './alert-rules.page.html',
  styleUrls: ['./alert-rules.page.scss'],
  standalone: false,
})
export class AlertRulesPage {
  rules: any[] = [];
  machines: Machine[] = [];
  showForm = false;
  loading = false;
  form = {
    attributeName: '',
    operator: '>',
    threshold: null as number | null,
    severity: 'warning',
    machineId: null as number | null,
  };
  constructor(
    private resources: ResourceService,
    private authService: AuthService,
    private router: Router,
    private alerts: AlertController,
  ) {}
  ionViewWillEnter() {
    this.load();
    this.resources
      .list<Machine>('machines')
      .subscribe((r) => (this.machines = r.machines ?? []));
  }
  load() {
    this.loading = true;
    this.resources.alertRules().subscribe({
      next: (rules) => {
        this.rules = rules;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
  openCreate() {
    this.form = {
      attributeName: '',
      operator: '>',
      threshold: null,
      severity: 'warning',
      machineId: null,
    };
    this.showForm = true;
  }
  save() {
    if (!this.form.machineId || this.form.threshold === null) return;
    this.resources
      .createAlertRule({
        ...this.form,
        machineId: Number(this.form.machineId),
        threshold: Number(this.form.threshold),
      })
      .subscribe(() => {
        this.showForm = false;
        this.load();
      });
  }
  async delete(rule: any) {
    const alert = await this.alerts.create({
      header: 'Eliminar regla',
      message: `Se eliminará la regla «${rule.attributeName} ${rule.operator} ${rule.threshold}».`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () =>
            this.resources
              .deleteAlertRule(rule.id)
              .subscribe(() => this.load()),
        },
      ],
    });
    await alert.present();
  }
  nav(path: string) {
    void this.router.navigate([path]);
  }
  logout() {
    this.authService.logout();
  }
}
