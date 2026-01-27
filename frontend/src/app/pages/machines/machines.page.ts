import { Component, OnInit } from '@angular/core';
import { MachineService } from '../../core/services';
import { Machine } from '../../models';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.page.html',
  styleUrls: ['./machines.page.scss'],
  standalone: false,
})
export class MachinesPage implements OnInit {
  machines: Machine[] = [];

  constructor(private machineService: MachineService) {}

  ngOnInit() {
    this.machineService.getAll().subscribe((data: Machine[]) => {
      this.machines = data;
    });
  }

  delete(id: number) {
    this.machineService.delete(id).subscribe(() => {
      this.machines = this.machines.filter((m) => m.id !== id);
    });
  }
}
