import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from '../../core/services';
@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.page.html',
  styleUrls: ['./alerts.page.scss'],
  standalone: false,
})
export class AlertsPage {
  alerts: any[] = [];
  loading = false;
  machineId?: number;
  machineName = '';
  constructor(
    private resources: ResourceService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  ionViewWillEnter() {
    this.machineId =
      Number(this.route.snapshot.queryParamMap.get('machineId')) || undefined;
    this.machineName =
      this.route.snapshot.queryParamMap.get('machineName') ?? '';
    this.loading = true;
    const request = this.machineId
      ? this.resources.alertsForMachine(this.machineId)
      : this.resources.latestAlerts();
    request.subscribe({
      next: (a) => {
        this.alerts = a;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
  nav(path: string) {
    void this.router.navigate([path]);
  }
}
