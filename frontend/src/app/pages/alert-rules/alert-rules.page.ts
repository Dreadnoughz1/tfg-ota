import { Component } from '@angular/core'; import { Router } from '@angular/router';
@Component({selector:'app-alert-rules',templateUrl:'./alert-rules.page.html',styleUrls:['./alert-rules.page.scss'],standalone:false}) export class AlertRulesPage { constructor(private router:Router){} nav(path:string){void this.router.navigate([path]);} }
